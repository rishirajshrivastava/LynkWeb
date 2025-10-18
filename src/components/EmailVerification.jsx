import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const EmailVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store?.user);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [shouldShowOtp, setShouldShowOtp] = useState(false);
  const [otpExpiryTime, setOtpExpiryTime] = useState(null);
  const [isExpiryTimer, setIsExpiryTimer] = useState(false);

  // Check if error message indicates OTP should be shown
  const shouldEnableOtpForError = (errorMessage) => {
    if (!errorMessage) return false;
    const lowerError = errorMessage.toLowerCase();
    return (
      lowerError.includes('use existing otp') ||
      lowerError.includes('retry after') ||
      lowerError.includes('otp already sent') ||
      lowerError.includes('wait') ||
      lowerError.includes('cooldown')
    );
  };

  // Calculate remaining time until OTP expiry
  const calculateTimeUntilExpiry = (expiryTimeString) => {
    const expiryTime = new Date(expiryTimeString);
    const now = new Date();
    const timeDiff = expiryTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return 0; // Already expired
    }
    
    return Math.ceil(timeDiff / 1000); // Return seconds
  };

  // Start expiry timer
  const startExpiryTimer = (expiryTimeString) => {
    const remainingSeconds = calculateTimeUntilExpiry(expiryTimeString);
    
    if (remainingSeconds > 0) {
      setTimer(remainingSeconds);
      setTimerActive(true);
      setIsExpiryTimer(true);
      setOtpExpiryTime(expiryTimeString);
    } else {
      // OTP already expired
      setTimer(0);
      setTimerActive(false);
      setIsExpiryTimer(false);
      setCanResend(true);
      setError(""); // Clear error when resend is enabled
    }
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => {
          const newTime = timer - 1;
          if (newTime <= 0) {
            setTimerActive(false);
            if (isExpiryTimer) {
              // OTP expired, enable resend
              setCanResend(true);
              setIsExpiryTimer(false);
              setError(""); // Clear error when resend is enabled
            } else {
              // Regular 2-minute timer expired, enable resend
              setCanResend(true);
              setError(""); // Clear error when resend is enabled
            }
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, isExpiryTimer]);

  // Effect to handle error messages and enable OTP input
  useEffect(() => {
    if (error && shouldEnableOtpForError(error)) {
      setShouldShowOtp(true);
      setShowOtp(true);
    }
  }, [error]);

  const checkVerificationStatus = async () => {
    try {
      const res = await axios.get(
        BASE_URL + "/user-verification-status",
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.log("Error checking verification status:", err);
      return null;
    }
  };

  const checkSelfieStatus = async () => {
    try {
      const res = await axios.get(
        BASE_URL + "/user-selfie-status",
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.log("Error checking selfie status:", err);
      return null;
    }
  };

  const handleSendOtp = async () => {
    try {
      setSendOtpLoading(true);
      setError("");
      setMessage("");
      
      const res = await axios.post(
        BASE_URL + "/send-email",
        {
          to: userData?.email,
        },
        { withCredentials: true }
      );
      
      setOtpSent(true);
      setShowOtp(true);
      setShouldShowOtp(false); // Reset error-triggered OTP display
      setTimer(120); // 2 minutes = 120 seconds
      setTimerActive(true);
      setCanResend(false);
      setIsExpiryTimer(false); // Reset expiry timer state
      setOtpExpiryTime(null); // Clear expiry time
    } catch (err) {
      console.log("Error sending OTP:", err);
      if (err.response?.data?.message === 'Email domain is blocked') {
        setError("This email domain is not allowed. Please use a different email address.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
        
        // Check if this is the "use existing OTP" error with expiry time
        if (err.response.data.message === "Use existing OTP or retry after 2 minutes" && err.response.data.expiryTime) {
          setShouldShowOtp(true);
          setShowOtp(true);
          startExpiryTimer(err.response.data.expiryTime);
        }
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setVerifyOtpLoading(true);
      setError("");
      setMessage("");
      
      // Call the verify-otp API endpoint
      const res = await axios.post(
        BASE_URL + "/verify-otp",
        { otp },
        { withCredentials: true }
      );
      
      if (res.data.emailVerified) {
        setMessage("Email verified successfully!");
        
        // Update user data with verification status
        dispatch(addUser({ ...userData, emailVerified: true }));
        
        // Proceed with existing verification flow
        // Check if user has photos uploaded
        if (!userData.photoUrl || userData.photoUrl.length === 0) {
          navigate("/photo-upload", { replace: true });
        } else {
          // Check if user has taken selfie
          const selfieStatus = await checkSelfieStatus();
          if (!selfieStatus?.selfieStatus) {
            navigate("/selfie-capture", { replace: true });
          } else {
            navigate("/verification-required", { replace: true });
          }
        }
      }
    } catch (err) {
      console.log("Error verifying OTP:", err);
      
      // Handle different error scenarios from the API
      if (err.response?.data?.message) {
        const errorMessage = err.response.data.message;
        
        if (errorMessage === 'Email already verified') {
          setMessage("Email is already verified!");
          // Redirect to next step since email is already verified
          if (!userData.photoUrl || userData.photoUrl.length === 0) {
            navigate("/photo-upload", { replace: true });
          } else {
            const selfieStatus = await checkSelfieStatus();
            if (!selfieStatus?.selfieStatus) {
              navigate("/selfie-capture", { replace: true });
            } else {
              navigate("/verification-required", { replace: true });
            }
          }
        } else if (errorMessage === 'No valid OTP found. Please request a new OTP') {
          setError("No valid OTP found. Please request a new OTP.");
          setCanResend(true);
          setShowOtp(false);
          setShouldShowOtp(false);
        } else if (errorMessage === 'OTP has expired. Please request a new OTP') {
          setError("OTP has expired. Please request a new OTP.");
          setCanResend(true);
          setShowOtp(false);
          setShouldShowOtp(false);
        } else if (errorMessage === 'Invalid OTP') {
          setError("Invalid OTP. Please check and try again.");
        } else if (errorMessage === 'OTP is required') {
          setError("Please enter the OTP.");
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setSendOtpLoading(true);
      setError("");
      setMessage("");
      
      const res = await axios.post(
        BASE_URL + "/send-email",
        {
          to: userData?.email,
        },
        { withCredentials: true }
      );
      
      setTimer(120); // Reset timer to 2 minutes
      setTimerActive(true);
      setCanResend(false);
      setShouldShowOtp(false); // Reset error-triggered OTP display
      setIsExpiryTimer(false); // Reset expiry timer state
      setOtpExpiryTime(null); // Clear expiry time
      setMessage("OTP resent successfully!");
    } catch (err) {
      console.log("Error resending OTP:", err);
      if (err.response?.data?.message === 'Email domain is blocked') {
        setError("This email domain is not allowed. Please use a different email address.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
        
        // Check if this is the "use existing OTP" error with expiry time
        if (err.response.data.message === "Use existing OTP or retry after 2 minutes" && err.response.data.expiryTime) {
          setShouldShowOtp(true);
          setShowOtp(true);
          startExpiryTimer(err.response.data.expiryTime);
        }
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      dispatch(addUser(null));
      setShowLogoutConfirm(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-3 sm:px-4 py-16">
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-xl rounded-xl">
        <div className="card-body p-4 sm:p-6">
          {/* Logo / App Name */}
          <div className="text-center mb-3">
            <span className="text-2xl font-extrabold text-primary">💕🔗</span>
            <p className="text-xs text-base-content/70 mt-1">Verify your email address</p>
          </div>

          {/* Form */}
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (canResend) {
                handleResendOtp();
              } else if (showOtp || shouldShowOtp) {
                handleVerifyOtp();
              } else {
                handleSendOtp();
              }
            }}
          >
            {/* Email Display */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm">Email Address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={userData?.email || ""}
                  className="w-full px-3 py-2 rounded-md border-b border-base-300 bg-base-200 text-base-content/70 pr-10 text-sm cursor-not-allowed"
                  disabled
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* OTP Input - Only show after OTP is sent or when error indicates to use existing OTP, but hide when resend is enabled */}
            {(showOtp || shouldShowOtp) && !canResend && (
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm">Enter OTP</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-3 py-2 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                />
                <label className="label py-1">
                  <span className="label-text-alt text-base-content/70 text-xs">
                    Check your email for the verification code
                  </span>
                </label>
              </div>
            )}


            {/* Timer Display */}
            {(showOtp || shouldShowOtp) && timerActive && !canResend && (
              <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-blue-700 text-xs font-medium">
                    {isExpiryTimer ? "OTP expires in" : "Time remaining"}: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed btn-sm"
              disabled={
                sendOtpLoading || 
                verifyOtpLoading || 
                ((showOtp || shouldShowOtp) && !canResend && otp.length !== 6)
              }
            >
              {sendOtpLoading ? (
                canResend ? "Resending OTP..." : "Sending OTP..."
              ) : verifyOtpLoading ? (
                "Verifying..."
              ) : canResend ? (
                "Resend OTP"
              ) : (showOtp || shouldShowOtp) ? (
                "Verify OTP"
              ) : (
                "Send OTP"
              )}
            </button>
          </form>

          {/* Loading OR Success/Error Messages */}
          {(sendOtpLoading || verifyOtpLoading) && (
            <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md animate-pulse">
              <div className="flex items-center space-x-2 text-blue-700 text-xs font-medium">
                {/* Spinner */}
                <svg
                  className="w-4 h-4 animate-spin text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 
                    00-4 4H4z"
                  ></path>
                </svg>
                <span>
                  {sendOtpLoading ? "Sending OTP to your email..." : "Verifying your OTP..."}
                </span>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-700 text-xs font-medium">{message}</span>
              </div>
            </div>
          )}

          {error && !sendOtpLoading && !verifyOtpLoading && (
            <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-red-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 
                    00-1 1v4a1 1 0 102 0V6a1 
                    1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 text-xs font-medium">{error}</span>
              </div>
            </div>
          )}

            {/* Footer */}
            <div className="mt-2">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="btn btn-ghost w-full text-base-content/70 text-xs btn-sm"
              >
                Logout
              </button>
            </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 pointer-events-auto p-2 sm:p-4">
          <div className="bg-base-200 text-base-content rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-3 sm:p-5 text-center animate-fade-in">
            <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Confirm Logout</h2>
            <p className="text-xs sm:text-sm opacity-80 mb-3 sm:mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
              <button
                onClick={handleLogout}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-sm hover:from-red-600 hover:to-red-700 transition-all text-xs sm:text-sm"
              >
                Yes, Log out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700 transition-all text-xs sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

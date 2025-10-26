import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from '../utils/constants';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => {
          const newTime = timer - 1;
          if (newTime <= 0) {
            setTimerActive(false);
            setCanResend(true);
            setError(""); // Clear error when resend is enabled
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const handleSendOTP = async () => {
    try {
      setSendOtpLoading(true);
      setError("");
      setSuccessMessage("");
      
      const res = await axios.put(
        BASE_URL + "/user/password-reset-mail-verification",
        { email },
        { withCredentials: true }
      );
      
      setOtpSent(true);
      setShowOtp(true);
      setTimer(120); // 2 minutes = 120 seconds
      setTimerActive(true);
      setCanResend(false);
      setSuccessMessage("OTP sent successfully! Please check your email.");
      
    } catch (err) {
      console.log("Error sending OTP:", err.response?.data);
      
      if (err.response?.status === 400 && err.response?.data?.message === "OTP already sent. Please use the existing OTP or wait for it to expire.") {
        // Handle existing OTP scenario
        const { timeLeft, expiresAt } = err.response.data;
        setError("OTP already sent. Please use the existing OTP or wait for it to expire.");
        setOtpSent(true);
        setShowOtp(true);
        setTimer(timeLeft);
        setTimerActive(true);
        setCanResend(false);
        
        // Start timer for existing OTP
        const interval = setInterval(() => {
          setTimer(prevTimer => {
            const newTime = prevTimer - 1;
            if (newTime <= 0) {
              setTimerActive(false);
              setCanResend(true);
              setError(""); // Clear error when resend is enabled
              clearInterval(interval);
              return 0;
            }
            return newTime;
          });
        }, 1000);
        
      } else if (err.response?.status === 404 && err.response?.data?.message === "User not found") {
        setError("No account found with this email address");
      } else if (err.response?.status === 400 && err.response?.data?.message === "Email is required") {
        setError("Please enter your email address");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Sorry, please try again");
      }
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setVerifyOtpLoading(true);
      setError("");
      setSuccessMessage("");
      
      const res = await axios.post(
        BASE_URL + "/user/verify-password-reset-otp",
        { email, otp },
        { withCredentials: true }
      );
      
      setSuccessMessage("OTP verified successfully!");
      setShowPasswordReset(true);
      setShowOtp(false);
      
    } catch (err) {
      console.log("Error verifying OTP:", err.response?.data);
      
      if (err.response?.status === 400) {
        const { message, valid, expired } = err.response.data;
        
        if (message === "No OTP found. Please request a new password reset.") {
          setError("No OTP found. Please request a new password reset.");
          setCanResend(true);
          setShowOtp(false);
        } else if (message === "OTP has expired. Please request a new password reset.") {
          setError("OTP has expired. Please request a new password reset.");
          setCanResend(true);
          setShowOtp(false);
        } else if (message === "Invalid OTP. Please check and try again.") {
          setError("Invalid OTP. Please check and try again.");
        } else if (message === "Email and OTP are required") {
          setError("Please enter both email and OTP.");
        } else {
          setError(message);
        }
      } else if (err.response?.status === 404 && err.response?.data?.message === "User not found") {
        setError("No account found with this email address");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setSendOtpLoading(true);
      setError("");
      setSuccessMessage("");
      
      const res = await axios.put(
        BASE_URL + "/user/password-reset-mail-verification",
        { email },
        { withCredentials: true }
      );
      
      setTimer(120); // Reset timer to 2 minutes
      setTimerActive(true);
      setCanResend(false);
      setSuccessMessage("OTP resent successfully!");
      
    } catch (err) {
      console.log("Error resending OTP:", err.response?.data);
      
      if (err.response?.status === 400 && err.response?.data?.message === "OTP already sent. Please use the existing OTP or wait for it to expire.") {
        // Handle existing OTP scenario
        const { timeLeft, expiresAt } = err.response.data;
        setError("OTP already sent. Please use the existing OTP or wait for it to expire.");
        setTimer(timeLeft);
        setTimerActive(true);
        setCanResend(false);
        
        // Start timer for existing OTP
        const interval = setInterval(() => {
          setTimer(prevTimer => {
            const newTime = prevTimer - 1;
            if (newTime <= 0) {
              setTimerActive(false);
              setCanResend(true);
              setError(""); // Clear error when resend is enabled
              clearInterval(interval);
              return 0;
            }
            return newTime;
          });
        }, 1000);
        
      } else if (err.response?.status === 404 && err.response?.data?.message === "User not found") {
        setError("No account found with this email address");
      } else if (err.response?.status === 400 && err.response?.data?.message === "Email is required") {
        setError("Please enter your email address");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setResetPasswordLoading(true);
      setError("");
      setSuccessMessage("");
      
      // Validate passwords
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      
      // Call the actual password reset endpoint
      const res = await axios.post(
        BASE_URL + "/user/password-reset",
        { email, password: newPassword },
        { withCredentials: true }
      );
      
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      
      // Redirect to login immediately after successful API response
      navigate("/login", { 
        state: { 
          message: "Password reset successfully! Please sign in with your new password." 
        } 
      });
      
    } catch (err) {
      console.log("Error resetting password:", err.response?.data);
      
      if (err.response?.status === 400) {
        const { message } = err.response.data;
        
        if (message === "Email and password are required") {
          setError("Please enter both email and password.");
        } else if (message === "Password reset not allowed. Please verify OTP first.") {
          setError("Password reset not allowed. Please verify OTP first.");
          // Reset to OTP verification step
          setShowPasswordReset(false);
          setShowOtp(true);
        } else {
          setError(message);
        }
      } else if (err.response?.status === 404 && err.response?.data?.message === "User not found") {
        setError("No account found with this email address");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-3 sm:px-4 py-16">
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-xl rounded-xl">
        <div className="card-body p-4 sm:p-6">
          {/* Logo / App Name */}
          <div className="text-center mb-3">
            <span className="text-2xl font-extrabold text-primary">💕🔗</span>
            <p className="text-xs text-base-content/70 mt-1">Reset your password</p>
          </div>

          {/* Form */}
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (showPasswordReset) {
                handleResetPassword();
              } else if (canResend) {
                handleResendOTP();
              } else if (showOtp) {
                handleVerifyOTP();
              } else {
                handleSendOTP();
              }
            }}
          >
            {/* Email Input */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm">Email Address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={showOtp}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* OTP Input - Only show after OTP is sent */}
            {showOtp && !canResend && (
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

            {/* Password Reset Form - Only show after OTP verification */}
            {showPasswordReset && (
              <>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm">New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={newPassword}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <label className="label py-1">
                    <span className="label-text-alt text-base-content/70 text-xs">
                      Password must be at least 6 characters long
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Timer Display */}
            {showOtp && timerActive && !canResend && (
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
                    {error && error.includes("OTP already sent") ? "OTP expires in" : "Time remaining"}: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
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
                resetPasswordLoading ||
                (showOtp && !canResend && otp.length !== 6) ||
                (showPasswordReset && (!newPassword || !confirmPassword || newPassword !== confirmPassword)) ||
                (!showOtp && !showPasswordReset && !email)
              }
            >
              {resetPasswordLoading ? (
                "Resetting Password..."
              ) : sendOtpLoading ? (
                canResend ? "Resending OTP..." : "Sending OTP..."
              ) : verifyOtpLoading ? (
                "Verifying..."
              ) : canResend ? (
                "Resend OTP"
              ) : showPasswordReset ? (
                "Reset Password"
              ) : showOtp ? (
                "Verify OTP"
              ) : (
                "Send OTP"
              )}
            </button>
          </form>

          {/* Loading OR Success/Error Messages */}
          {(sendOtpLoading || verifyOtpLoading || resetPasswordLoading) && (
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
                  {resetPasswordLoading ? "Resetting your password..." : 
                   sendOtpLoading ? "Sending OTP to your email..." : 
                   "Verifying your OTP..."}
                </span>
              </div>
            </div>
          )}

          {successMessage && (
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
                <span className="text-green-700 text-xs font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {error && !sendOtpLoading && !verifyOtpLoading && !resetPasswordLoading && (
            <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-red-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 
                    8 0 0116 0zm-7 4a1 1 0 11-2 
                    0 1 1 0 012 0zm-1-9a1 1 0 
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
            <p className="text-center text-xs text-base-content/70">
              Remember your password?{" "}
              <Link to="/login" className="link link-primary font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

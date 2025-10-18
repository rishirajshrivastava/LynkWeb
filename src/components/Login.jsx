import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {BASE_URL} from '../utils/constants'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from signup
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

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

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      
      // Check verification status after successful login
      const verificationStatus = await checkVerificationStatus();
      
      if (verificationStatus) {
        if (verificationStatus.isVerified) {
          navigate("/feed");
        } else {
          // Store verification status in Redux for later use
          dispatch(addUser({ ...res.data.user, verificationStatus }));
          
          // Check email verification first
          if (!verificationStatus.emailVerified) {
            navigate("/email-verification"); // Redirect to email verification
          } else {
            // Check if user has photos uploaded
            if (!res.data.user.photoUrl || res.data.user.photoUrl.length === 0) {
              navigate("/photo-upload"); // Redirect to photo upload
            } else {
              // Check if user has taken selfie
              const selfieStatus = await checkSelfieStatus();
              if (!selfieStatus?.selfieStatus) {
                navigate("/selfie-capture"); // Redirect to selfie capture
              } else {
                navigate("/verification-required"); // Redirect to verification required
              }
            }
          }
        }
      } else {
        // If we can't check verification status, redirect to email verification
        navigate("/email-verification");
      }
    } catch (err) {
      console.log("An error occured while logging in: ", err.response?.data?.Error);
      if (err.response?.data?.Error === "Invalid credentials") {
        setError("Invalid credentials");
      } else {
        setError("Sorry, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-3 sm:px-4">
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-xl rounded-2xl">
        <div className="card-body">
          {/* Logo / App Name */}
          <div className="text-center mb-6">
            <span className="text-3xl font-extrabold text-primary">Lynk 💕🔗</span>
            <p className="text-sm text-base-content/70 mt-1">Welcome back! Please sign in</p>
          </div>

          {/* Form */}
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password field with animated toggle */}
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
                <a href="#" className="label-text-alt link link-hover text-primary">
                  Forgot?
                </a>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition pr-12 text-sm"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* Eye toggle button */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors group"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <div className="relative w-6 h-6">
                    {/* Fade-in/out animation between icons */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ${
                        showPassword ? "opacity-0" : "opacity-100"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 
                        0 8.268 2.943 9.542 7-1.274 4.057-5.064 
                        7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ${
                        showPassword ? "opacity-100" : "opacity-0"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 
                        0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 
                        9.97 0 012.842-4.42M9.88 9.88A3 
                        3 0 0112 9c1.657 0 3 1.343 3 
                        3 0 .512-.129.995-.356 
                        1.414M15.88 15.88A3 3 0 0112 
                        15c-1.657 0-3-1.343-3-3 
                        0-.512.129-.995.356-1.414M3 
                        3l18 18"
                      />
                    </svg>
                  </div>
                  {/* Tooltip */}
                  <span className="absolute -top-8 right-0 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
            </div>

            {/* Disable button when loading */}
            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Loading OR Error Message */}
          {loading && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-pulse">
              <div className="flex items-center space-x-2 text-blue-700 text-sm font-medium">
                {/* Spinner */}
                <svg
                  className="w-5 h-5 animate-spin text-blue-500"
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
                <span>Hang tight, signing you in...</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-700 text-sm font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
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
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-base-content/70 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
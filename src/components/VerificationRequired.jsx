import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useState } from "react"

const VerificationRequired = ({ verificationInProgress = false }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    try {
      // Call logout API
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true })
    } catch (err) {
      console.log("Logout error:", err)
    } finally {
      // Clear user data and redirect to login
      dispatch(addUser(null))
      setShowLogoutConfirm(false)
      navigate("/login", { replace: true })
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-base-200 px-3 sm:px-4 py-20 sm:py-24 overflow-hidden">
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-xl rounded-2xl border border-base-300">
        <div className="card-body text-center p-4 sm:p-6 lg:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
              verificationInProgress ? 'bg-primary/10' : 'bg-warning/10'
            }`}>
              {verificationInProgress ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-content mb-2 sm:mb-3">
            {verificationInProgress ? "Verification In Progress" : "Verification Required"}
          </h2>

          {/* Message */}
          <div className="text-base-content/70 mb-3 sm:mb-4 space-y-1 sm:space-y-2">
            {verificationInProgress ? (
              <>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Your account verification is currently being reviewed by our team.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed">
                  This process usually takes 24-48 hours. You'll be notified once your verification is complete.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed">
                  You can check back later or contact support if you have any questions.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-medium text-primary">
                  Please wait while we review your information.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm leading-relaxed">
                  You need to complete account verification before you can view profiles, send likes, or use other features.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Verification helps us ensure a safe and authentic community for everyone.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-medium text-warning">
                  Please complete your verification to continue.
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {!verificationInProgress ? (
              <button
                onClick={() => {
                  // TODO: Implement verification process
                  console.log("Start verification process")
                }}
                className="btn btn-primary w-full rounded-lg text-sm py-2"
              >
                Start Verification
              </button>
            ) : (
              <div className="w-full p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-primary font-medium">
                    Verification Under Review
                  </span>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="btn btn-outline w-full rounded-lg text-sm py-2"
            >
              Sign Out
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
  )
}

export default VerificationRequired

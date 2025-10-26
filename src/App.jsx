import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import Body from "./components/Body"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Profile from "./components/Profile"
import { Provider } from "react-redux"
import appStore from "./utils/appstore"
import Feed from "./components/Feed"
import Requests from "./components/Requests"
import Connections from "./components/Connections"
import SavedLikedProfiles from "./components/SavedLikedProfiles"
import Settings from "./components/Settings"
import Notifications from "./components/Notifications"
import Chat from "./components/Chat"
import VerificationRequired from "./components/VerificationRequired"
import PhotoUpload from "./components/PhotoUpload"
import SelfieCapture from "./components/SelfieCapture"
import EmailVerification from "./components/EmailVerification"
import ForgotPassword from "./components/ForgotPassword"
import axios from "axios"
import { BASE_URL } from "./utils/constants"

// Wrapper component to handle verification status
const VerificationRequiredWrapper = () => {
  const [verificationInProgress, setVerificationInProgress] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user-verification-status", { withCredentials: true })
        setVerificationInProgress(res.data.verificationInProgress || false)
        setError(false)
      } catch (err) {
        console.log("Error fetching verification status:", err)
        const status = err?.response?.status || err?.status
        if (status === 401 || status === 403) {
          // User not authenticated, redirect to login
          window.location.href = "/login"
          return
        }
        setVerificationInProgress(false)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    
    fetchVerificationStatus()
  }, [])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading verification status</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
  
  return <VerificationRequired verificationInProgress={verificationInProgress} />
}

function App() {
  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <>
    <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body/>}>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/signup" element={<Signup/>}></Route>
              <Route path="/email-verification" element={<EmailVerification/>}></Route>
              <Route path="/photo-upload" element={<PhotoUpload/>}></Route>
              <Route path="/selfie-capture" element={<SelfieCapture/>}></Route>
              <Route path="/verification-required" element={<VerificationRequiredWrapper/>}></Route>
              <Route path="/profile" element={<Profile/>}></Route>
              <Route path="/feed" element={<Feed/>}></Route>
              <Route path="/connections" element={<Connections/>}></Route>
              <Route path="/requestReview" element={<Requests/>}></Route>
              <Route path="/savedLikedProfiles" element={<SavedLikedProfiles/>}></Route>
              <Route path="/settings" element={<Settings/>}></Route>
              <Route path="/notifications" element={<Notifications/>}></Route>
              <Route path="/chat/:TargetUserId" element={<Chat/>}></Route>
              <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

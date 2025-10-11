import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios"
import {BASE_URL} from '../utils/constants'
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useEffect, useState } from "react"
import VerificationRequired from "./VerificationRequired"

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store?.user)
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)
  
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

  const handleUnverifiedUserFlow = async (user, verificationStatus) => {
    // Check if user has photos uploaded
    if (!user.photoUrl || user.photoUrl.length === 0) {
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
  };

  const fetchUser = async()=>{
    console.log("fetchUser called, current path:", location.pathname)
    
    // Special handling for verification-required page - just check if user is verified
    if (location.pathname === "/verification-required") {
      try {
        const verificationStatus = await checkVerificationStatus();
        if (verificationStatus?.isVerified) {
          navigate("/feed", { replace: true });
          return;
        }
        setIsAuthChecked(true);
        return;
      } catch(err) {
        const status = err?.response?.status || err?.status
        if(status === 401 || status === 403){
          dispatch(addUser(null))
          navigate("/login", { replace: true })
          return;
        }
        setIsAuthChecked(true);
        return;
      }
    }
    
    // Handle login/signup pages
    if (location.pathname === "/login" || location.pathname === "/signup") {
      // If user is already logged in, redirect to appropriate page
      if (userData) {
        console.log("User data exists, checking verification status...")
        const verificationStatus = await checkVerificationStatus();
        console.log("Verification status:", verificationStatus)
        if (verificationStatus?.isVerified) {
          navigate("/feed", { replace: true });
        } else {
          // Check verification flow for unverified users
          await handleUnverifiedUserFlow(userData, verificationStatus);
        }
        return;
      }
      
      // Check if user is logged in via API
      try {
        console.log("Fetching user profile...")
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        })
        console.log("User profile response:", res.data?.user)
        dispatch(addUser(res.data?.user))
        
        // Check verification status
        const verificationStatus = await checkVerificationStatus();
        console.log("Verification status from API:", verificationStatus)
        if (verificationStatus?.isVerified) {
          navigate("/feed", { replace: true });
        } else {
          // Check verification flow for unverified users
          await handleUnverifiedUserFlow(res.data.user, verificationStatus);
        }
      } catch(err) {
        // User is not logged in, stay on login/signup page
        console.log("User not logged in, staying on login page");
      } finally {
        setIsAuthChecked(true)
      }
      return;
    }
    
    if(userData) {
      console.log("Existing user data found, checking verification status...")
      // Check verification status for existing user
      const verificationStatus = await checkVerificationStatus();
      console.log("Verification status for existing user:", verificationStatus)
      setVerificationStatus(verificationStatus);
      
      // Store verification status in Redux for consistency
      if (verificationStatus) {
        console.log("Storing verification status in Redux...")
        dispatch(addUser({ ...userData, verificationStatus }));
      }
      
      // If user is verified, allow access to all routes
      // If not verified, handle the verification flow
      if (!verificationStatus?.isVerified) {
        const protectedRoutes = ["/feed", "/profile", "/connections", "/requestReview", "/savedLikedProfiles", "/notifications"];
        const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
        
        if (isProtectedRoute) {
          console.log("User on protected route, handling unverified flow...")
          await handleUnverifiedUserFlow(userData, verificationStatus);
        }
      }
      
      setIsAuthChecked(true)
      return;
    }
    
    try {
      console.log("No user data, fetching from API...")
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      })
      console.log("API response:", res.data?.user)
      dispatch(addUser(res.data?.user))
      
      // Check verification status
      const verificationStatus = await checkVerificationStatus();
      console.log("Verification status from API call:", verificationStatus)
      setVerificationStatus(verificationStatus);
      
      // Store verification status in Redux for consistency
      if (verificationStatus) {
        console.log("Storing verification status in Redux from API...")
        dispatch(addUser({ ...res.data.user, verificationStatus }));
      }
      
      // If user is verified, allow access to all routes
      // If not verified, handle the verification flow
      if (!verificationStatus?.isVerified) {
        const protectedRoutes = ["/feed", "/profile", "/connections", "/requestReview", "/savedLikedProfiles", "/notifications"];
        const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
        
        if (isProtectedRoute) {
          console.log("User on protected route from API, handling unverified flow...")
          await handleUnverifiedUserFlow(res.data.user, verificationStatus);
        }
      }
    }
    catch(err){
      const status = err?.response?.status || err?.status
      if(status === 401 || status === 403){
        // Clear any existing user data and redirect to login
        dispatch(addUser(null))
        navigate("/login", { replace: true })
      }
      console.log("ERR: ", err.message);
    } finally {
      console.log("Setting isAuthChecked to true")
      setIsAuthChecked(true)
    }
  }
  useEffect(()=>{
    fetchUser();
  },[location.pathname])

  // Handle root path redirect - only after auth check is complete
  useEffect(() => {
    if (location.pathname === "/" && isAuthChecked) {
      if (userData) {
        if (verificationStatus?.isVerified) {
          navigate("/feed", { replace: true });
        } else {
          // Use the same flow for unverified users
          handleUnverifiedUserFlow(userData, verificationStatus);
        }
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [location.pathname, userData, isAuthChecked, verificationStatus, navigate])

  // Route protection for unverified users
  useEffect(() => {
    if (isAuthChecked && userData && verificationStatus && !verificationStatus.isVerified) {
      const protectedRoutes = ["/feed", "/profile", "/connections", "/requestReview", "/savedLikedProfiles", "/notifications"];
      const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
      
      if (isProtectedRoute && location.pathname !== "/verification-required" && 
          location.pathname !== "/photo-upload" && location.pathname !== "/selfie-capture") {
        // Use the same flow for unverified users
        handleUnverifiedUserFlow(userData, verificationStatus);
      }
    }
  }, [isAuthChecked, userData, verificationStatus, location.pathname, navigate])

  // Handle page refresh for verified users - redirect to feed if on verification, photo upload, or selfie capture page
  useEffect(() => {
    if (isAuthChecked && userData && verificationStatus?.isVerified && 
        (location.pathname === "/verification-required" || location.pathname === "/photo-upload" || location.pathname === "/selfie-capture")) {
      navigate("/feed", { replace: true });
    }
  }, [isAuthChecked, userData, verificationStatus, location.pathname, navigate])

  // Show verification required component if user is not verified and trying to access protected routes
  if (isAuthChecked && userData && verificationStatus && !verificationStatus.isVerified && 
      location.pathname !== "/verification-required" && location.pathname !== "/photo-upload" && location.pathname !== "/selfie-capture") {
    const protectedRoutes = ["/feed", "/profile", "/connections", "/requestReview", "/savedLikedProfiles", "/notifications"];
    const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
    
    if (isProtectedRoute) {
      // Ensure we have verification status data before rendering
      const verificationInProgress = verificationStatus.verificationInProgress !== undefined ? verificationStatus.verificationInProgress : false;
      return <VerificationRequired verificationInProgress={verificationInProgress} />;
    }
  }

  // Show loading spinner while auth is being checked or verification status is being loaded
  // Exception: Don't show loader for verification-required page as it handles its own loading
  if ((!isAuthChecked || (userData && !verificationStatus)) && location.pathname !== "/verification-required") {
    console.log("Showing loader - isAuthChecked:", isAuthChecked, "userData:", !!userData, "verificationStatus:", !!verificationStatus)
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body
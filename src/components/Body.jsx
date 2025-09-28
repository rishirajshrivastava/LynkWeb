import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios"
import {BASE_URL} from '../utils/constants'
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useEffect, useState } from "react"

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store?.user)
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  
  const fetchUser = async()=>{
    // Handle login/signup pages
    if (location.pathname === "/login" || location.pathname === "/signup") {
      // If user is already logged in, redirect to feed
      if (userData) {
        navigate("/feed", { replace: true });
        return;
      }
      
      // Check if user is logged in via API
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        })
        dispatch(addUser(res.data?.user))
        // If successful, redirect to feed
        navigate("/feed", { replace: true });
      } catch(err) {
        // User is not logged in, stay on login/signup page
        console.log("User not logged in, staying on login page");
      } finally {
        setIsAuthChecked(true)
      }
      return;
    }
    
    if(userData) {
      setIsAuthChecked(true)
      return;
    }
    
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      })
      dispatch(addUser(res.data?.user))
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
        navigate("/feed", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [location.pathname, userData, isAuthChecked, navigate])

  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body
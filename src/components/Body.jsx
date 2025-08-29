import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios"
import {BASE_URL} from '../utils/constants'
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useEffect } from "react"

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store?.user)
  const fetchUser = async()=>{
    if (location.pathname === "/login") return;
    if(location.pathname === "/signup") return;
    if(userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
      withCredentials: true,
      })
      dispatch(addUser(res.data?.user))
    }
    catch(err){
      const status = err?.response?.status || err?.status
      if(status===401){
        navigate("/login")
      }
      console.log("ERR: ", err.message);
    }
  }
  useEffect(()=>{
    fetchUser();
  },[location.pathname])

  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body
import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios"
import {BASE_URL} from '../utils/constants'
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useEffect } from "react"

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store?.user)
  const fetchUser = async()=>{
    if(userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
      withCredentials: true,
      })
      dispatch(addUser(res.data?.user))
    }
    catch(err){
      if(err.status===401){
        navigate("/login")
      }
      console.log("ERR: ", err.message);
    }
  }
  useEffect(()=>{
    fetchUser();
  },[])

  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body
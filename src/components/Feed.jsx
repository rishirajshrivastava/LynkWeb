import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addFeed } from "../utils/feedSlice"


const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch();

  const getFeed = async() =>{
    if(feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed",{withCredentials:true});
      dispatch(addFeed(res?.data))
    } catch (error) {
      console.log("Error while fetching feed data", error)
    }
  }

  useEffect(() => {
    getFeed();
  }, [])

  return (
    <div style={{
      marginTop: '100px'
    }}>
    </div>
  )
}

export default Feed
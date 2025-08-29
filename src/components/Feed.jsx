import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addFeed, removeFromFeed } from "../utils/feedSlice"
import UserFeed from "./UserFeed"
import NoMoreUsers from "./NoMoreUsers"

const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const getFeed = async (pageNum = 1) => {
    setLoading(true)
    try {
      const res = await axios.get(
        `${BASE_URL}/feed?page=${pageNum}`,
        { withCredentials: true }
      )

      const newProfiles = res?.data?.data ?? res?.data ?? []

      if (!newProfiles || newProfiles.length === 0) {
        setHasMore(false)
        return
      }

      if (pageNum === 1) {
        dispatch(addFeed(newProfiles))
        setCurrentIndex(0)
      } else {
        const existing = feed?.data || feed || []
        dispatch(addFeed([...existing, ...newProfiles]))
      }
    } catch (error) {
      console.log("Error while fetching feed data", error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!feed) {
      getFeed(1)
    }
  }, [])

  const profiles = useMemo(() => {
    if (!feed) return []
    return Array.isArray(feed?.data) ? feed.data : Array.isArray(feed) ? feed : []
  }, [feed])

  // Adjust currentIndex if it becomes invalid after removing profiles
  useEffect(() => {
    if (profiles.length > 0 && currentIndex >= profiles.length) {
      setCurrentIndex(0)
    }
  }, [profiles.length, currentIndex])

  const handleNext = () => {
    const nextIndex = currentIndex + 1

    if (nextIndex < profiles.length) {
      setCurrentIndex(nextIndex)
    } else if (hasMore && !loading) {
      // Fetch next page
      const nextPage = page + 1
      setPage(nextPage)
      getFeed(nextPage).then(() => {
        setCurrentIndex(nextIndex)
      })
    }
    // No loop back - let it naturally show NoMoreUsers when no more data
  }

  const handleLike = async (profile) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/interested/${profile._id}`,
        {},
        { withCredentials: true }
      )
      dispatch(removeFromFeed(profile._id))
    } catch (err) {
      console.log("Error while sending like", err)
      
      // Handle "Connection request already exists" error
      if (err.response?.data?.error?.includes("Connection request already exists") || 
          err.response?.data?.message?.includes("Connection request already exists")) {
        // Remove user from store and show next card
        dispatch(removeFromFeed(profile._id))
      }
    } finally {
      handleNext()
    }
  }

  const handleDislike = async (profile) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/ignored/${profile._id}`,
        {},
        { withCredentials: true }
      )
      dispatch(removeFromFeed(profile._id))
    } catch (err) {
      console.log("Error while sending dislike", err)
      
      // Handle "Connection request already exists" error
      if (err.response?.data?.error?.includes("Connection request already exists") || 
          err.response?.data?.message?.includes("Connection request already exists")) {
        // Remove user from store and show next card
        dispatch(removeFromFeed(profile._id))
      }
    } finally {
      handleNext()
    }
  }

  const noMoreProfiles =
    !loading && profiles.length === 0 && !hasMore

  return (
    <div className={`px-3 sm:px-4 flex items-start justify-center ${noMoreProfiles ? 'pt-16 pb-8' : 'pt-24 pb-20'}`}>
      <div className="w-full max-w-5xl">
        {!feed && loading && (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-400 mb-4"></div>
            <p>Loading profiles...</p>
          </div>
        )}

        {profiles.length > 0 && profiles[currentIndex] ? (
          <UserFeed
            profile={profiles[currentIndex]}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ) : noMoreProfiles ? (
          <NoMoreUsers />
        ) : null}

        {loading && profiles.length > 0 && (
          <div className="text-center text-gray-400 py-6 sm:py-10">Loading more...</div>
        )}
      </div>
    </div>
  )
}

export default Feed
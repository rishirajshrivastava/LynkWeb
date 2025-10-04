import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addFeed, removeFromFeed } from "../utils/feedSlice"
import UserFeed from "./UserFeed"
import NoMoreUsers from "./NoMoreUsers"

const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sparkleError, setSparkleError] = useState("")
  const [showLikeLimitPopup, setShowLikeLimitPopup] = useState(false)
  const [showSpecialLikeLimitPopup, setShowSpecialLikeLimitPopup] = useState(false)
  const [hasProcessedUsers, setHasProcessedUsers] = useState(false) // Track if any users have been processed

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

  // Auto-fetch next page when profiles become empty (but not on initial load)
  useEffect(() => {
    if (profiles.length === 0 && hasMore && !loading && hasProcessedUsers) {
      const nextPage = page + 1
      setPage(nextPage)
      getFeed(nextPage).then(() => {
        setCurrentIndex(0)
      })
    }
  }, [profiles.length, hasMore, loading, page, hasProcessedUsers])

  const handleNext = () => {
    const nextIndex = currentIndex + 1

    if (nextIndex < profiles.length) {
      setCurrentIndex(nextIndex)
    } else if (hasMore && !loading && profiles.length === 0) {
      // Only fetch next page when there are no users left in the store
      const nextPage = page + 1
      setPage(nextPage)
      getFeed(nextPage).then(() => {
        setCurrentIndex(0) // Reset to first user of new batch
      })
    }
    // No loop back - let it naturally show NoMoreUsers when no more data
  }

  const handleLike = async (profile) => {
    let shouldProceed = true
    
    try {
      await axios.post(
        `${BASE_URL}/request/send/interested/${profile._id}`,
        {},
        { withCredentials: true }
      )
      dispatch(removeFromFeed(profile._id))
      setHasProcessedUsers(true) // Mark that we've processed at least one user
    } catch (err) {
      console.log("Error while sending like", err)
      
      // Handle daily like limit error
      if (err.response?.data?.message?.includes("You have reached the maximum like limit per day")) {
        setShowLikeLimitPopup(true)
        shouldProceed = false
        return // Don't proceed to handleNext() or remove from feed
      }
      
      // Handle "Connection request already exists" error
      if (err.response?.data?.error?.includes("Connection request already exists") || 
          err.response?.data?.message?.includes("Connection request already exists")) {
        // Remove user from store and show next card
        dispatch(removeFromFeed(profile._id))
      setHasProcessedUsers(true) // Mark that we've processed at least one user
      }
    } finally {
      // Only call handleNext if we should proceed (not a like limit error)
      if (shouldProceed) {
        handleNext()
      }
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
      setHasProcessedUsers(true) // Mark that we've processed at least one user
    } catch (err) {
      console.log("Error while sending dislike", err)
      
      // Handle "Connection request already exists" error
      if (err.response?.data?.error?.includes("Connection request already exists") || 
          err.response?.data?.message?.includes("Connection request already exists")) {
        // Remove user from store and show next card
        dispatch(removeFromFeed(profile._id))
      setHasProcessedUsers(true) // Mark that we've processed at least one user
      }
    } finally {
      handleNext() 
    }
  }

  const onSparkleLike = async (profile) => {
    try {
      setSparkleError("") // Clear any previous errors
      const res = await axios.post(
        `${BASE_URL}/request/send/special-like/${profile._id}`,
        {},
        { withCredentials: true }
      ) 
      dispatch(removeFromFeed(profile._id))
      setHasProcessedUsers(true) // Mark that we've processed at least one user
      handleNext()
    } catch (err) {
      console.log(err?.response?.data?.message)
      
      // Handle specific error cases
      if(err?.response?.data?.message === 'You have reached the maximum limit of 3 special likes') {
        setShowSpecialLikeLimitPopup(true)
        return
      }  else {
        // Handle other errors
        setSparkleError("Failed to send special like. Please try again.")
        setTimeout(() => {
          setSparkleError("")
        }, 2000)
        return
      }
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
            onSparkleLike={onSparkleLike}
            onDislike={handleDislike}
            sparkleError={sparkleError}
          />
        ) : noMoreProfiles ? (
          <NoMoreUsers />
        ) : null}

        {loading && profiles.length > 0 && (
          <div className="text-center text-gray-400 py-6 sm:py-10">Loading more...</div>
        )}
      </div>

      {/* Like Limit Popup */}
      {showLikeLimitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="p-4 sm:p-5">
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Daily Like Limit Reached
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                You've reached the maximum number of likes you can send per day. 
                Upgrade to premium to send unlimited likes!
              </p>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLikeLimitPopup(false)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement premium purchase logic
                    console.log("Buy Premium clicked")
                    setShowLikeLimitPopup(false)
                  }}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                >
                  Buy Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Special Like Limit Popup */}
      {showSpecialLikeLimitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="p-4 sm:p-5">
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Special Like Limit Reached
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                You've reached the maximum number of special likes you can send. 
                Upgrade to premium to save more profiles and connect with more people!
              </p>

              {/* Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSpecialLikeLimitPopup(false)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement premium purchase logic
                      console.log("Buy Premium clicked")
                      setShowSpecialLikeLimitPopup(false)
                    }}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                  >
                    Buy Premium
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowSpecialLikeLimitPopup(false)
                    navigate('/savedLikedProfiles')
                  }}
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                >
                  📋 View Saved Profiles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Feed
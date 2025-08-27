import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addFeed } from "../utils/feedSlice"
import UserFeed from "./UserFeed"

const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const getFeed = async (pageNum = 0) => {
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

      // Append new profiles to existing feed in Redux
      dispatch(addFeed([...(feed?.data || feed || []), ...newProfiles]))
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
  }

  const handleLike = async (profile) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/interested/${profile._id}`,
        {},
        { withCredentials: true }
      )
    } catch (err) {
      console.log("Error while sending like", err)
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
    } catch (err) {
      console.log("Error while sending dislike", err)
    } finally {
      handleNext()
    }
  }

  const noMoreProfiles =
    !loading && (!profiles || currentIndex >= profiles.length) && !hasMore

  return (
    <div className="pt-24 pb-28 px-4 flex items-start justify-center">
      <div className="w-full max-w-4xl">
        {!feed && loading && (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-400 mb-4"></div>
            <p>Loading profiles...</p>
          </div>
        )}

        {profiles[currentIndex] && (
          <UserFeed
            profile={profiles[currentIndex]}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        )}

        {loading && profiles.length > 0 && (
          <div className="text-center text-gray-400 py-10">Loading more...</div>
        )}

        {noMoreProfiles && (
          <div className="text-center text-gray-300 py-16">
            <h3 className="text-xl font-semibold mb-2">You're all caught up ✨</h3>
            <p className="text-gray-400">Check back later for more matches.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed
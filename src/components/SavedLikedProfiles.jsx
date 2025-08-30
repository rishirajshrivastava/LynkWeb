import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'

const SavedLikedProfiles = () => {
  const [savedProfiles, setSavedProfiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [specialLikeInfo, setSpecialLikeInfo] = useState({ specialLikeCount: 0, remaining: 5 })
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [isSendingReminder, setIsSendingReminder] = useState(false)
  const [reminderStatuses, setReminderStatuses] = useState({})


  // Fetch saved profiles from API
  const fetchSavedProfiles = async () => {
    try {
      setError('')
      const response = await axios.get(`${BASE_URL}/user/saved-profiles`, {
        withCredentials: true
      })
      setSavedProfiles(response.data.data || [])
    } catch (error) {
      console.error('Error fetching saved profiles:', error)
      setError('Failed to load saved profiles. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch special like count information
  const fetchSpecialLikeInfo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/special-likes`, {
        withCredentials: true
      })
      setSpecialLikeInfo(response.data.data || { specialLikeCount: 0, remaining: 5 })
    } catch (error) {
      console.error('Error fetching special like info:', error)
      // Don't set error here as it's not critical for the main functionality
    }
  }

  // Fetch reminder status for each profile
  const fetchReminderStatuses = async (profiles) => {
    try {
      const statuses = {}
      
      // Fetch reminder status for each profile
      for (const profile of profiles) {
        try {
          const response = await axios.get(`${BASE_URL}/reminder/status/${profile._id}`, {
            withCredentials: true
          })
          statuses[profile._id] = response.data.data.reminderSent
        } catch (error) {
          console.error(`Error fetching reminder status for ${profile._id}:`, error)
          // Default to false if there's an error
          statuses[profile._id] = false
        }
      }
      
      setReminderStatuses(statuses)
    } catch (error) {
      console.error('Error fetching reminder statuses:', error)
    }
  }

  useEffect(() => {
    fetchSavedProfiles()
    fetchSpecialLikeInfo()
  }, [])

  // Fetch reminder statuses when savedProfiles changes
  useEffect(() => {
    if (savedProfiles.length > 0) {
      fetchReminderStatuses(savedProfiles)
    }
  }, [savedProfiles])

  // Get profiles in reverse order to show most recent first
  const filteredProfiles = useMemo(() => {
    if (!savedProfiles || !Array.isArray(savedProfiles)) {
      return [];
    }
    return [...savedProfiles].reverse();
  }, [savedProfiles]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'badge-success'
      case 'pending':
        return 'badge-warning'
      case 'rejected':
        return 'badge-error'
      default:
        return 'badge-base-content/70'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted! 🎉'
      case 'pending':
        return 'Pending ⏳'
      case 'rejected':
        return 'Declined ❌'
      default:
        return 'Unknown'
    }
  }

  const handleSendReminder = (profile) => {
    setSelectedProfile(profile)
    setShowReminderModal(true)
  }

  const confirmReminder = async () => {
    if (!selectedProfile) return
    
    try {
      setIsSendingReminder(true)
      // TODO: Implement your reminder API endpoint here
      // await axios.post(`${BASE_URL}/user/send-reminder/${selectedProfile._id}`, {}, { withCredentials: true })
      
      console.log('Sending reminder to:', selectedProfile.firstName)
      
      // Update the reminder status locally
      setReminderStatuses(prev => ({
        ...prev,
        [selectedProfile._id]: true
      }))
      
      // Close the modal
      setShowReminderModal(false)
      setSelectedProfile(null)
      
      // Optionally refresh the data
      // fetchSavedProfiles()
      
    } catch (error) {
      console.error('Error sending reminder:', error)
      alert('Failed to send reminder. Please try again.')
    } finally {
      setIsSendingReminder(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center pb-40">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Loading your saved profiles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center pb-40">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">Something went wrong</h3>
          <p className="text-base-content/70 mb-6">{error}</p>
          <button 
            onClick={fetchSavedProfiles}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!savedProfiles || savedProfiles.length === 0) {
    return (
      <div className="pt-24 pb-20 px-4 flex justify-center">
        <div className="w-full max-w-6xl bg-base-300 rounded-2xl shadow-xl border border-base-200 p-4 sm:p-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">✨</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-3">
              Saved Liked Profiles
            </h1>
            <p className="text-base-content/70 text-sm sm:text-base max-w-2xl mx-auto">
              Start building meaningful connections by sending special likes to profiles that interest you. 
              Each special like saves the profile here for easy tracking and management.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-base-100 px-4 py-2 rounded-full border border-base-300">
              <span className="text-sm text-base-content/70">Profiles saved:</span>
              <span className="badge badge-primary badge-sm">0/5</span>
            </div>
          </div>

          <div className="text-center py-8">
            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
              {/* Card 1: Special Like */}
              <div className="bg-base-100 p-4 rounded-xl border border-base-300 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                <div className="text-3xl mb-3">✨</div>
                <h4 className="text-base font-semibold text-base-content mb-2">Send Special Likes</h4>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  Use the sparkle button to show special interest in profiles. Each special like saves the profile here for tracking.
                </p>
              </div>

              {/* Card 2: Status Tracking */}
              <div className="bg-base-100 p-4 rounded-xl border border-base-300 hover:shadow-lg transition-all duration-300 hover:border-secondary/30">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="text-base font-semibold text-base-content mb-2">Track Status</h4>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  Monitor the progress of your connection requests - pending, accepted, or declined. Stay updated on your matches.
                </p>
              </div>

              {/* Card 3: Reminder System */}
              <div className="bg-base-100 p-4 rounded-xl border border-base-300 hover:shadow-lg transition-all duration-300 hover:border-accent/30">
                <div className="text-3xl mb-3">⏰</div>
                <h4 className="text-base font-semibold text-base-content mb-2">Send Reminders</h4>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  Gently remind users to review your connection request when needed. Keep the conversation flowing.
                </p>
              </div>
            </div>

            {/* How it works section */}
            <div className="bg-gradient-to-br from-base-100 to-base-200 p-6 rounded-2xl border border-base-300 max-w-4xl mx-auto">
              <h4 className="text-lg font-bold text-base-content mb-4 text-center">🚀 How the Special Like System Works</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-xs">1</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-base-content mb-1 text-sm">Browse Profiles</h5>
                      <p className="text-xs text-base-content/70">Go through your daily feed and find profiles that interest you</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-secondary font-bold text-xs">2</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-base-content mb-1 text-sm">Send Special Like</h5>
                      <p className="text-xs text-base-content/70">Click the ✨ button to show special interest and save the profile</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent font-bold text-xs">3</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-base-content mb-1 text-sm">Track Progress</h5>
                      <p className="text-xs text-base-content/70">Monitor connection status and manage your saved profiles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-xs">4</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-base-content mb-1 text-sm">Stay Connected</h5>
                      <p className="text-xs text-base-content/70">Send reminders and maintain engagement with your matches</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4 flex justify-center">
      {/* Parent container */}
      <div className="w-full max-w-6xl bg-base-300 rounded-2xl shadow-xl border border-base-200 p-4 sm:p-6">
        {/* Professional Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-base-content">Saved Liked Profiles</h1>
            <p className="text-sm text-base-content/70 mt-1">
              Track your special connection requests ({savedProfiles.length}/5)
            </p>
          </div>
          
          {/* Refresh Button */}
          <button 
            onClick={() => {
              setIsLoading(true)
              fetchSavedProfiles()
              fetchSpecialLikeInfo()
              // Reset reminder statuses when refreshing
              setReminderStatuses({})
            }}
            className="btn btn-sm btn-outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Refreshing...
              </>
            ) : (
              '🔄 Refresh'
            )}
          </button>
        </div>



        {/* Responsive grid of cards */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id}
                className="rounded-xl shadow-md overflow-hidden border flex flex-col h-full transition-all duration-200 bg-base-200 border-white border-base-300"
              >
                {/* Profile photo */}
                <div className="w-full h-40 sm:h-48 bg-base-300 flex items-center justify-center relative">
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-primary/20 flex items-center justify-center ${profile.photoUrl ? 'hidden' : 'flex'}`}>
                    <span className="text-primary font-semibold text-2xl">
                      {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 
                    className="text-base sm:text-lg font-semibold text-base-content break-words leading-tight"
                    title={`${profile.firstName} ${profile.lastName}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate flex-1">
                        {`${profile.firstName} ${profile.lastName}`}
                      </span>
                      {profile.age && (
                        <span className="text-xs sm:text-sm font-medium text-base-content/70 flex-shrink-0">
                          {profile.age}
                        </span>
                      )}
                    </div>
                  </h2>
                  
                  {profile.gender && (
                    <p className="text-xs sm:text-sm text-base-content/70 mt-1">
                      {profile.gender}
                    </p>
                  )}

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span className={`badge ${getStatusColor(profile.status || 'pending')} text-xs`}>
                      {getStatusText(profile.status || 'pending')}
                    </span>
                  </div>

                  {/* Send Reminder Button */}
                  <div className="mt-auto pt-3">
                    <button
                      onClick={() => handleSendReminder(profile)}
                      disabled={profile.status === 'accepted' || reminderStatuses[profile._id] === true}
                      className={`btn btn-sm w-full ${
                        profile.status === 'accepted' || reminderStatuses[profile._id] === true
                          ? 'btn-disabled opacity-50' 
                          : 'btn-primary'
                      }`}
                    >
                      {profile.status === 'accepted' 
                        ? '✅ Connected' 
                        : reminderStatuses[profile._id] === true 
                          ? '📤 Reminder Sent' 
                          : reminderStatuses[profile._id] === undefined
                            ? '⏳ Loading...'
                            : '💬 Send Reminder'
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Reminder Confirmation Modal */}
      {showReminderModal && selectedProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 text-center">
              <div className="text-2xl mb-1">💬</div>
              <h3 className="text-lg font-bold text-white">Send Reminder</h3>
            </div>

            {/* Content */}
            <div className="p-4 text-center">
              <p className="text-base-content/80 text-sm mb-4">
                Send a friendly reminder to <span className="font-semibold">{selectedProfile.firstName + " "}</span> 
                to review your connection request?
              </p>
              
              <div className="bg-base-200/50 rounded-lg p-3 border border-base-300/30 mb-4">
                <p className="text-xs text-base-content/70">
                  This will send a gentle notification to remind them about your pending request.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowReminderModal(false)}
                  className="btn btn-outline btn-sm flex-1"
                  disabled={isSendingReminder}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReminder}
                  className="btn btn-primary btn-sm flex-1 bg-gradient-to-r from-blue-400 to-blue-600 border-0"
                  disabled={isSendingReminder}
                >
                  {isSendingReminder ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Reminder'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SavedLikedProfiles

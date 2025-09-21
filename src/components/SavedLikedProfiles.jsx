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
  const [requestStatuses, setRequestStatuses] = useState({})
  const [refreshingStatuses, setRefreshingStatuses] = useState({})


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

    // Fetch request status for each profile
  const fetchRequestStatuses = async (profiles) => {
    try {
      // If it's a single profile refresh, update only that profile's status
      if (profiles.length === 1) {
        const profile = profiles[0]
        
        // Set refreshing state for this profile
        setRefreshingStatuses(prev => ({ ...prev, [profile._id]: true }))
        
        try {
          const response = await axios.get(`${BASE_URL}/request/status/${profile._id}`, {
            withCredentials: true
          })
          const newStatus = response.data.data?.status || 'pending'
          
          // Update only this specific profile's status without affecting others
          setRequestStatuses(prev => ({
            ...prev,
            [profile._id]: newStatus
          }))
          
          // Add a brief highlight effect by temporarily adding a class
          setTimeout(() => {
            setRefreshingStatuses(prev => ({ ...prev, [profile._id]: false }))
          }, 1000)
          
        } catch (error) {
          console.error(`Error fetching request status for ${profile._id}:`, error)
          // Update only this profile's status to pending on error
          setRequestStatuses(prev => ({
            ...prev,
            [profile._id]: 'pending'
          }))
          
          // Clear refreshing state on error too
          setTimeout(() => {
            setRefreshingStatuses(prev => ({ ...prev, [profile._id]: false }))
          }, 1000)
        }
        return
      }
      
      // For multiple profiles (initial load), fetch all statuses
      const statuses = {}
      
      // Fetch request status for each profile
      for (const profile of profiles) {
        try {
          const response = await axios.get(`${BASE_URL}/request/status/${profile._id}`, {
            withCredentials: true
          })
          statuses[profile._id] = response.data.data?.status || 'pending'
        } catch (error) {
          console.error(`Error fetching request status for ${profile._id}:`, error)
          // Default to pending if there's an error
          statuses[profile._id] = 'pending'
        }
      }
      
      setRequestStatuses(statuses)
    } catch (error) {
      console.error('Error fetching request statuses:', error)
      // Set all to pending if there's a general error
      const fallbackStatuses = {}
      profiles.forEach(profile => {
        fallbackStatuses[profile._id] = 'pending'
      })
      setRequestStatuses(fallbackStatuses)
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
      fetchRequestStatuses(savedProfiles)
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
      case 'rejected':
        return 'badge-error'
      case 'interested':
      case 'ignored':
      case 'pending':
      default:
        return 'badge-warning'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Request Accepted! 🎉'
      case 'rejected':
        return 'Request Rejected ❌'
      case 'interested':
      case 'ignored':
      case 'pending':
      default:
        return 'Pending Review ⏳'
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
      
      // Call the actual reminder API endpoint
      const response = await axios.post(`${BASE_URL}/request/reminder/${selectedProfile._id}`, {}, {
        withCredentials: true
      })
      
      console.log('Reminder sent successfully:', response.data.message)
      
      // Update the reminder status locally
      setReminderStatuses(prev => ({
        ...prev,
        [selectedProfile._id]: true
      }))
      
      // Close the modal
      setShowReminderModal(false)
      setSelectedProfile(null)
      
      // Show success message (optional)
      // You can add a toast notification here if you have a toast system
      
    } catch (error) {
      console.error('Error sending reminder:', error)
      
      // Handle different types of errors gracefully based on the API
      let errorMessage = 'Failed to send reminder. Please try again.'
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 400) {
          // Handle "Reminder is already sent" case
          if (error.response.data && error.response.data.message === "Reminder is already sent") {
            errorMessage = 'Reminder has already been sent to this user.'
            
            // Update the reminder status locally since it's already sent
            setReminderStatuses(prev => ({
              ...prev,
              [selectedProfile._id]: true
            }))
          } else {
            errorMessage = error.response.data?.message || 'Invalid request. Please try again.'
          }
        } else if (error.response.status === 401) {
          errorMessage = 'You are not authorized to send reminders. Please log in again.'
        } else if (error.response.status === 404) {
          errorMessage = 'Connection request not found. You may need to send a connection request first.'
        } else if (error.response.status === 500) {
          errorMessage = error.response.data?.message || 'Server error. Please try again later.'
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection and try again.'
      }
      
      // Show error message to user
      alert(errorMessage)
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
              Track your special connection requests ({savedProfiles.length}/3)
              {Object.keys(requestStatuses).length === 0 && savedProfiles.length > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-base-content/50 bg-base-content/10 px-2 py-1 rounded-full">
                  <span className="loading loading-spinner loading-xs"></span>
                  Loading statuses...
                </span>
              )}
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
              setRequestStatuses({})
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
                className="rounded-xl shadow-md overflow-visible border flex flex-col h-full transition-all duration-200 bg-base-200 border-white border-base-300"
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
                    {requestStatuses[profile._id] === undefined ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-base-content/10 text-base-content/70 border border-base-content/20">
                        <span className="loading loading-spinner loading-xs"></span>
                        Loading status...
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                            requestStatuses[profile._id] === 'accepted' 
                              ? 'bg-success/10 text-success border border-success/20' 
                              : requestStatuses[profile._id] === 'rejected'
                                ? 'bg-error/10 text-error border border-error/20'
                                : 'bg-warning/10 text-warning border border-warning/20'
                          } ${
                            refreshingStatuses[profile._id] ? 'ring-2 ring-warning/50 shadow-lg scale-105' : ''
                          }`}>
                            {requestStatuses[profile._id] === 'accepted' && (
                              <div className="w-3 h-3 bg-success rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            {requestStatuses[profile._id] === 'rejected' && (
                              <div className="w-3 h-3 bg-error rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                            )}
                            {['interested', 'ignored', 'pending'].includes(requestStatuses[profile._id]) && (
                              <div className="w-3 h-3 bg-warning rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            )}
                            {getStatusText(requestStatuses[profile._id] || 'pending')}
                          </div>
                          
                                                     {/* Retry button for failed status loads */}
                           {['interested', 'ignored', 'pending'].includes(requestStatuses[profile._id]) && (
                             <button
                               onClick={() => fetchRequestStatuses([profile])}
                               disabled={refreshingStatuses[profile._id]}
                               className={`btn btn-lg btn-ghost p-3 min-h-0 h-10 w-10 hover:bg-warning/20 hover:scale-110 transition-all duration-200 ${
                                 refreshingStatuses[profile._id] ? 'animate-pulse bg-warning/30' : ''
                               }`}
                               title={refreshingStatuses[profile._id] ? "Refreshing..." : "Refresh status"}
                             >
                               <svg className={`w-6 h-6 ${refreshingStatuses[profile._id] ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                               </svg>
                             </button>
                           )}
                        </div>
                        
                        {/* Connection Info for Accepted Requests */}
                        {requestStatuses[profile._id] === 'accepted' && (
                          <div className="mt-2">
                            <div className="bg-success/10 border border-success/20 rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-success">
                                  Connection Established
                                </span>
                              </div>
                              <p className="text-xs text-success/80 mt-1">
                                You can now find this user in your connections
                              </p>
                            </div>
                          </div>
                        )}
                        

                      </>
                    )}
                  </div>

                  {/* Send Reminder Button */}
                  <div className="mt-auto pt-3">
                    <div className="relative group overflow-visible">
                      <button
                        onClick={() => handleSendReminder(profile)}
                        disabled={requestStatuses[profile._id] === 'accepted' || requestStatuses[profile._id] === 'rejected' || reminderStatuses[profile._id] === true || requestStatuses[profile._id] === undefined}
                        className={`btn btn-sm w-full ${
                          requestStatuses[profile._id] === 'accepted' || requestStatuses[profile._id] === 'rejected' || reminderStatuses[profile._id] === true || requestStatuses[profile._id] === undefined
                            ? 'btn-disabled opacity-50' 
                            : 'btn-primary'
                        }`}
                      >
                        {requestStatuses[profile._id] === undefined
                          ? '⏳ Loading...'
                          : reminderStatuses[profile._id] === true 
                            ? '📤 Reminder Sent' 
                            : reminderStatuses[profile._id] === undefined
                              ? '⏳ Loading...'
                              : '💬 Send Reminder'
                        }
                      </button>
                      
                      {/* Custom Tooltip - Only show for accepted/rejected */}
                      {(requestStatuses[profile._id] === 'accepted' || requestStatuses[profile._id] === 'rejected') && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[9999] shadow-2xl border border-gray-700">
                          {requestStatuses[profile._id] === 'accepted' 
                            ? 'Cannot send reminder - request already accepted'
                            : 'Cannot send reminder - request already rejected'
                          }
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                        </div>
                      )}
                    </div>
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

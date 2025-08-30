import { useState, useEffect } from 'react'
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

  useEffect(() => {
    fetchSavedProfiles()
    fetchSpecialLikeInfo()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-success'
      case 'pending':
        return 'text-warning'
      case 'rejected':
        return 'text-error'
      default:
        return 'text-base-content/70'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Connection Accepted! 🎉'
      case 'pending':
        return 'Request Pending ⏳'
      case 'rejected':
        return 'Request Declined ❌'
      default:
        return 'Unknown Status'
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
      
      // For now, just close the modal
      // You can implement the actual reminder logic when you have the API endpoint
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Loading your saved profiles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center pb-24">
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

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 pb-56">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">✨</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
            Saved Liked Profiles
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            Track your special connection requests
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 bg-base-100 px-4 py-2 rounded-full border border-base-300">
              <span className="text-sm text-base-content/70">Profiles saved:</span>
              <span className="badge badge-primary badge-sm">{savedProfiles.length}/5</span>
            </div>
            <button 
              onClick={() => {
                setIsLoading(true)
                fetchSavedProfiles()
                fetchSpecialLikeInfo()
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
        </div>

        {/* Profiles Grid */}
        {savedProfiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💫</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">No saved profiles yet</h3>
            <p className="text-base-content/70 mb-6">
              Use the ✨ button when liking profiles to save them here for tracking
            </p>
            <div className="bg-base-100 p-6 rounded-2xl border border-base-300 max-w-md mx-auto">
              <h4 className="font-semibold text-base-content mb-3">How it works:</h4>
              <ul className="text-sm text-base-content/70 space-y-2 text-left">
                <li>• Like profiles with the ✨ button to save them</li>
                <li>• Track connection request status</li>
                <li>• Maximum 5 profiles can be saved</li>
                <li>• Send reminders when needed</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {savedProfiles.map((profile) => (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-base-100 rounded-xl shadow-lg border border-base-300 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left Section - Profile Image & Basic Info */}
                  <div className="lg:w-80 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-r border-base-300">
                    <div className="flex flex-col items-center text-center">
                      {/* Profile Image - Fixed to prevent cutting */}
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                        {profile.photoUrl ? (
                          <img 
                            src={profile.photoUrl} 
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-primary">
                            {profile.firstName?.[0]}{profile.lastName?.[0]}
                          </span>
                        )}
                      </div>
                      
                      {/* Name, Age & Gender */}
                      <h3 className="text-xl font-bold text-base-content mb-1">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <div className="flex items-center gap-3 mb-3 text-sm text-base-content/70">
                        <span>{profile.age} years old</span>
                        {profile.gender && (
                          <>
                            <span className="w-1 h-1 bg-base-content/30 rounded-full"></span>
                            <span>{profile.gender}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`badge badge-lg ${getStatusColor(profile.status || 'pending')} mb-4`}>
                        {getStatusText(profile.status || 'pending')}
                      </div>
                      
                      {/* Action Button */}
                      <button
                        onClick={() => handleSendReminder(profile)}
                        disabled={profile.status === 'accepted'}
                        className="btn btn-primary btn-sm w-full"
                      >
                        💬 Send Reminder
                      </button>
                    </div>
                  </div>

                  {/* Right Section - Detailed Information */}
                  <div className="flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* About */}
                        {profile.about && (
                          <div>
                            <h4 className="text-sm font-semibold text-base-content/70 mb-2 uppercase tracking-wide">
                              About
                            </h4>
                            <p className="text-sm text-base-content/80 leading-relaxed">
                              {profile.about}
                            </p>
                          </div>
                        )}

                        {/* Skills */}
                        {profile.skills && profile.skills.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-base-content/70 mb-2 uppercase tracking-wide">
                              Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interests */}
                        {profile.interests && profile.interests.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-base-content/70 mb-2 uppercase tracking-wide">
                              Interests
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.interests.map((interest, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Hobbies */}
                        {profile.hobbies && profile.hobbies.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-base-content/70 mb-2 uppercase tracking-wide">
                              Hobbies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {profile.hobbies.map((hobby, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium"
                                >
                                  {hobby}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bio */}
                        {profile.bio && (
                          <div>
                            <h4 className="text-sm font-semibold text-base-content/70 mb-2 uppercase tracking-wide">
                              Bio
                            </h4>
                            <p className="text-sm text-base-content/80 leading-relaxed">
                              {profile.bio}
                            </p>
                          </div>
                        )}

                        {/* Profile Created Date */}
                        {profile.createdAt && (
                          <div className="pt-3 border-t border-base-200">
                            <p className="text-xs text-base-content/50">
                              Profile created: {formatDate(profile.createdAt)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
                Send a friendly reminder to <span className="font-semibold">{selectedProfile.firstName}</span> 
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

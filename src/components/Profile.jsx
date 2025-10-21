import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import EditProfile from "./EditProfile"

const Profile = () => {
  const user = useSelector((store) => store.user)
  const [mode, setMode] = useState("view")
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [mode])

  const nextPhoto = () => {
    if (user.photoUrl && user.photoUrl.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % user.photoUrl.length)
    }
  }

  const prevPhoto = () => {
    if (user.photoUrl && user.photoUrl.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + user.photoUrl.length) % user.photoUrl.length)
    }
  }

  const openPhotoModal = (index) => {
    setCurrentPhotoIndex(index)
    setShowPhotoModal(true)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 px-4 pt-24 pb-20">
      <div className="w-full max-w-7xl mx-auto">
        {/* Toggle */}
        <div className="mb-4 flex items-center justify-center">
          <div className="relative bg-base-100 border border-base-300 rounded-2xl p-1 w-full max-w-sm shadow-lg">
            <motion.div
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-primary shadow-sm"
              animate={{ x: mode === "view" ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            />
            <div className="relative grid grid-cols-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode("view")}
                className={`py-2 px-3 z-10 rounded-xl transition-colors ${
                  mode === "view"
                    ? "text-primary-content"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                View Profile
              </button>
              <button
                type="button"
                onClick={() => setMode("edit")}
                className={`py-2 px-3 z-10 rounded-xl transition-colors ${
                  mode === "edit"
                    ? "text-primary-content"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {mode === "view" ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {/* Profile Card */}
              <div className="bg-base-100 rounded-3xl shadow-xl overflow-hidden border border-base-300/50">
                {/* Top Section - Image on left, content on right */}
                <div className="flex flex-col xl:flex-row">
                  {/* Left Side - Photo and Basic Info */}
                  <div className="w-full xl:w-2/5 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 flex flex-col items-center xl:sticky xl:top-0 xl:self-start">
                    <div className="text-center space-y-4 xl:pt-6">
                      {/* Profile Photo */}
                      <div className="mb-3 relative">
                        {user.photoUrl && user.photoUrl.length > 0 ? (
                          <div className="relative">
                            <img
                              src={user.photoUrl[currentPhotoIndex]}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-32 h-32 object-contain rounded-full shadow-lg border-4 border-base-100 bg-base-200 p-1 cursor-pointer"
                              style={{ objectPosition: 'center' }}
                              onClick={() => openPhotoModal(currentPhotoIndex)}
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                              }}
                            />
                            
                            {/* Photo Navigation Controls */}
                            {user.photoUrl.length > 1 && (
                              <>
                                <button
                                  onClick={prevPhoto}
                                  className="absolute -left-8 top-1/2 -translate-y-1/2 bg-base-100 rounded-full p-1.5 shadow-lg border border-base-300 hover:bg-base-200 transition-colors z-10"
                                >
                                  <svg className="w-4 h-4 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={nextPhoto}
                                  className="absolute -right-8 top-1/2 -translate-y-1/2 bg-base-100 rounded-full p-1.5 shadow-lg border border-base-300 hover:bg-base-200 transition-colors z-10"
                                >
                                  <svg className="w-4 h-4 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                
                                {/* Photo Counter */}
                                <div className="absolute -bottom-2 -right-2 bg-base-100 rounded-full px-2 py-1 text-xs font-medium border border-base-300 shadow-lg">
                                  {currentPhotoIndex + 1}/{user.photoUrl.length}
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-base-200 rounded-full border-4 border-base-100 flex items-center justify-center">
                            <svg className="w-16 h-16 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Name and Basic Info */}
                      <h1 className="text-2xl font-bold text-base-content">
                        {user.firstName} {user.lastName}
                      </h1>
                      
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {user.age && (
                          <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                            {user.age} years old
                          </span>
                        )}
                        {user.gender && (
                          <span className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full border border-secondary/20">
                            {user.gender}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Two Content Blocks */}
                  <div className="w-full xl:w-3/5 p-6">
                    <div className="space-y-4">
                      {/* First Content Block - About & Basic Info */}
                      <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                        <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          About & Basic Info
                        </h3>
                        <div className="space-y-3">
                          {user.about && (
                            <div>
                              <p className="text-base-content/80 leading-relaxed text-sm break-words whitespace-pre-wrap">
                                {user.about}
                              </p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3">
                            {user.height && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Height:</span>
                                <span className="text-sm text-base-content/80">{user.height} cm</span>
                              </div>
                            )}
                            {user.weight && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Weight:</span>
                                <span className="text-sm text-base-content/80">{user.weight} kg</span>
                              </div>
                            )}
                            {user.location?.city && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Location:</span>
                                <span className="text-sm text-base-content/80">{user.location.city}</span>
                              </div>
                            )}
                            {user.occupation && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Works as:</span>
                                <span className="text-sm text-base-content/80">{user.occupation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Second Content Block - Professional & Family */}
                      <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                        <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                          </svg>
                          Professional & Family
                        </h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            {user.education && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Education:</span>
                                <span className="text-sm text-base-content/80 capitalize">{user.education}</span>
                              </div>
                            )}
                            {user.hasKids && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Has kids:</span>
                                <span className="text-sm text-base-content/80 font-medium capitalize">{user.hasKids}</span>
                              </div>
                            )}
                            {user.wantsKids && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Wants kids:</span>
                                <span className="text-sm text-base-content/80 font-medium capitalize">{user.wantsKids}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>




                    </div>
                  </div>
                </div>

                {/* Bottom Section - Full Width Content */}
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    {/* Lifestyle Preferences */}
                    {(user.smoking || user.drinking || user.exercise || user.diet) && (
                      <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                        <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Lifestyle Preferences
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {user.smoking && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-base-content/60">Smoking:</span>
                              <span className="text-sm text-base-content/80 font-medium capitalize">{user.smoking}</span>
                            </div>
                          )}
                          {user.drinking && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-base-content/60">Drinking:</span>
                              <span className="text-sm text-base-content/80 font-medium capitalize">{user.drinking}</span>
                            </div>
                          )}
                          {user.exercise && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-base-content/60">Exercise:</span>
                              <span className="text-sm text-base-content/80 font-medium capitalize">{user.exercise}</span>
                            </div>
                          )}
                          {user.diet && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-base-content/60">Diet:</span>
                              <span className="text-sm text-base-content/80 font-medium capitalize">{user.diet}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Interests */}
                    {user.interests && user.interests.length > 0 && (
                      <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                        <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-info/10 text-info text-xs font-medium rounded-full border border-info/20"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hobbies */}
                    {user.hobbies && user.hobbies.length > 0 && (
                      <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                        <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Hobbies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.hobbies.map((hobby, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full border border-secondary/20"
                            >
                              {hobby}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {user.languages && user.languages.length > 0 && (
                      <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                        <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.languages.map((language, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-full border border-success/20"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {user.skills && user.skills.length > 0 && (
                      <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                        <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-warning/10 text-warning text-xs font-medium rounded-full border border-warning/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Empty state if no content */}
                {!user.about && 
                 !user.height && !user.weight && 
                 !user.location?.city && !user.location?.state && !user.location?.country &&
                 !user.occupation && !user.education &&
                 !user.smoking && !user.drinking && !user.exercise && !user.diet &&
                 !user.hasKids && !user.wantsKids &&
                 (!user.interests || user.interests.length === 0) &&
                 (!user.hobbies || user.hobbies.length === 0) &&
                 (!user.languages || user.languages.length === 0) &&
                 (!user.skills || user.skills.length === 0) && (
                  <div className="text-center text-base-content/50 py-6 px-6">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-base">Add some information to make your profile stand out!</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <EditProfile setMode={setMode} defaultPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && user.photoUrl && user.photoUrl.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPhotoModal(false)}>
          <div className="relative max-w-4xl w-full h-[calc(100vh-8rem)] mt-16 mb-16 bg-base-100/5 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="w-full h-full flex items-center justify-center bg-black/30">
              <img
                src={user.photoUrl[currentPhotoIndex]}
                alt={`${user.firstName} ${user.lastName} - Photo ${currentPhotoIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>

            {/* Nav Controls - Only show if multiple photos */}
            {user.photoUrl.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {currentPhotoIndex + 1}/{user.photoUrl.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
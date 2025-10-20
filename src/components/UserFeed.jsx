import { motion } from 'framer-motion'
import { useState } from 'react'

const UserFeed = ({ profile, onLike, onDislike, onSparkleLike, sparkleError }) => {
  const [showSparkleDialog, setShowSparkleDialog] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  
  if (!profile) return null

  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()


  const handleSparkleClick = () => {
    setShowSparkleDialog(true)
  }

  const handleConfirmSparkle = () => {
    setShowSparkleDialog(false)
    onSparkleLike?.(profile)
  }

  const handlePreviousPhoto = () => {
    if (profile.photoUrl && profile.photoUrl.length > 1) {
      setCurrentPhotoIndex(prev => 
        prev === 0 ? profile.photoUrl.length - 1 : prev - 1
      )
    }
  }

  const handleNextPhoto = () => {
    if (profile.photoUrl && profile.photoUrl.length > 1) {
      setCurrentPhotoIndex(prev => 
        prev === profile.photoUrl.length - 1 ? 0 : prev + 1
      )
    }
  }

  return (
    <div className="bg-gradient-to-b from-base-100 to-base-200 px-4 pt-16 pb-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className="bg-base-100 rounded-3xl shadow-xl overflow-hidden border border-base-300/50">
          {/* Top Section - Image on left, content on right */}
          <div className="flex flex-col xl:flex-row">
            {/* Left Side - Photo and Basic Info */}
            <div className="w-full xl:w-2/5 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 flex flex-col items-center xl:sticky xl:top-0 xl:self-start">
              <div className="text-center space-y-4 xl:pt-6">
                {/* Profile Photo */}
                <div className="mb-4 relative">
                  {profile.photoUrl && profile.photoUrl.length > 0 ? (
                    <div className="relative">
                      <img
                        src={profile.photoUrl[currentPhotoIndex]}
                        alt={fullName || 'User photo'}
                        className="w-56 h-48 object-contain rounded-xl shadow-lg border-4 border-base-100 bg-base-200 p-1 cursor-zoom-in"
                        style={{ objectPosition: 'center' }}
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(currentPhotoIndex); setLightboxOpen(true) }}
                      />
                      
                      {/* Photo Navigation Controls */}
                      {profile.photoUrl.length > 1 && (
                        <>
                          <button
                            onClick={handlePreviousPhoto}
                            className="absolute -left-10 top-1/2 -translate-y-1/2 bg-base-100 rounded-full p-2 shadow-lg border border-base-300 hover:bg-base-200 transition-colors z-10"
                          >
                            <svg className="w-5 h-5 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleNextPhoto}
                            className="absolute -right-10 top-1/2 -translate-y-1/2 bg-base-100 rounded-full p-2 shadow-lg border border-base-300 hover:bg-base-200 transition-colors z-10"
                          >
                            <svg className="w-5 h-5 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {/* Photo Counter */}
                          <div className="absolute -bottom-3 -right-3 bg-base-100 rounded-full px-3 py-1.5 text-xs font-medium border border-base-300 shadow-lg">
                            {currentPhotoIndex + 1}/{profile.photoUrl.length}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-56 h-48 bg-base-200 rounded-xl border-4 border-base-100 flex items-center justify-center">
                      <svg className="w-24 h-24 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Name and Basic Info */}
                <h1 className="text-2xl font-bold text-base-content">
                  {fullName || 'Someone new'}
                </h1>
                
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {profile.age && (
                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                      {profile.age} years old
                    </span>
                  )}
                  {profile.gender && (
                    <span className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full border border-secondary/20">
                      {profile.gender}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  {/* Dislike Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDislike?.(profile)}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-lg border-2 border-red-200 flex items-center justify-center hover:bg-gradient-to-br hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:shadow-red-500/20 transition-all duration-200 group"
                    aria-label="Not interested"
                  >
                    <svg className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>

                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onLike?.(profile)}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-600 hover:shadow-pink-500/30 transition-all duration-200 group"
                    aria-label="Interested"
                  >
                    <svg className="w-5 h-5 text-white group-hover:scale-105 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.22 2.44C11.09 5 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </motion.button>

                  {/* Sparkle Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSparkleClick}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg border border-slate-600 flex items-center justify-center hover:bg-gradient-to-br hover:from-slate-600 hover:to-slate-700 hover:border-slate-500 hover:shadow-slate-500/20 transition-all duration-200 group"
                    aria-label="Send special like"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200 text-amber-300 group-hover:text-amber-200">✨</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Right Side - Dynamic Content with Smart Distribution */}
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
                    {profile.about && (
                      <div>
                        <p className="text-base-content/80 leading-relaxed text-sm break-words whitespace-pre-wrap">
                          {profile.about}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {profile.height && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-base-content/60">Height:</span>
                          <span className="text-sm text-base-content/80">{profile.height}</span>
                        </div>
                      )}
                      {profile.weight && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-base-content/60">Weight:</span>
                          <span className="text-sm text-base-content/80">{profile.weight}</span>
                        </div>
                      )}
                      {profile.location?.city && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-base-content/60">Location:</span>
                          <span className="text-sm text-base-content/80">{profile.location.city}{profile.location.state && `, ${profile.location.state}`}</span>
                        </div>
                      )}
                      {profile.occupation && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-base-content/60">Works as:</span>
                          <span className="text-sm text-base-content/80">{profile.occupation}</span>
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
                      {profile.education && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-base-content/60">Education:</span>
                          <span className="text-sm text-base-content/80 capitalize">{profile.education}</span>
                        </div>
                      )}
                      {profile.hasKids && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-base-content/60">Has kids:</span>
                          <span className="text-sm text-base-content/80 font-medium capitalize">{profile.hasKids}</span>
                        </div>
                      )}
                      {profile.wantsKids && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-base-content/60">Wants kids:</span>
                          <span className="text-sm text-base-content/80 font-medium capitalize">{profile.wantsKids}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Try to fit single additional content in right side */}
                {(() => {
                  // Collect all available additional content sections
                  const contentSections = []
                  
                  // Lifestyle Preferences
                  if (profile.smoking || profile.drinking || profile.exercise || profile.diet) {
                    contentSections.push({
                      id: 'lifestyle',
                      component: (
                        <div key="lifestyle" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                          <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Lifestyle Preferences
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {profile.smoking && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Smoking:</span>
                                <span className="text-sm text-base-content/80 font-medium capitalize">{profile.smoking}</span>
                              </div>
                            )}
                            {profile.drinking && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Drinking:</span>
                                <span className="text-sm text-base-content/80 font-medium capitalize">{profile.drinking}</span>
                              </div>
                            )}
                            {profile.exercise && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Exercise:</span>
                                <span className="text-sm text-base-content/80 font-medium capitalize">{profile.exercise}</span>
                              </div>
                            )}
                            {profile.diet && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60">Diet:</span>
                                <span className="text-sm text-base-content/80 font-medium capitalize">{profile.diet}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  }

                  // Interests
                  if (profile.interests && profile.interests.length > 0) {
                    contentSections.push({
                      id: 'interests',
                      component: (
                        <div key="interests" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                          <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Interests
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-info/10 text-info text-xs font-medium rounded-full border border-info/20"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  }

                  // Hobbies
                  if (profile.hobbies && profile.hobbies.length > 0) {
                    contentSections.push({
                      id: 'hobbies',
                      component: (
                        <div key="hobbies" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                          <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Hobbies
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.hobbies.map((hobby, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full border border-secondary/20"
                              >
                                {hobby}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  }

                  // Languages
                  if (profile.languages && profile.languages.length > 0) {
                    contentSections.push({
                      id: 'languages',
                      component: (
                        <div key="languages" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                          <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            Languages
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.languages.map((language, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-full border border-success/20"
                              >
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  }

                  // Skills
                  if (profile.skills && profile.skills.length > 0) {
                    contentSections.push({
                      id: 'skills',
                      component: (
                        <div key="skills" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                          <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-warning/10 text-warning text-xs font-medium rounded-full border border-warning/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  }

                  // If only one section, try to fit it in the right side
                  if (contentSections.length === 1) {
                    return contentSections[0].component
                  }

                  // If multiple sections, don't show here - they'll be handled in bottom section
                  return null
                })()}
              </div>
            </div>
          </div>

          {/* Bottom Section - Only for Multiple Sections */}
          <div className="p-6 pt-0">
            {(() => {
              // Collect all available content sections
              const contentSections = []
              
              // Lifestyle Preferences
              if (profile.smoking || profile.drinking || profile.exercise || profile.diet) {
                contentSections.push({
                  id: 'lifestyle',
                  component: (
                    <div key="lifestyle" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                      <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Lifestyle Preferences
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {profile.smoking && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-base-content/60">Smoking:</span>
                            <span className="text-sm text-base-content/80 font-medium capitalize">{profile.smoking}</span>
                          </div>
                        )}
                        {profile.drinking && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-base-content/60">Drinking:</span>
                            <span className="text-sm text-base-content/80 font-medium capitalize">{profile.drinking}</span>
                          </div>
                        )}
                        {profile.exercise && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-base-content/60">Exercise:</span>
                            <span className="text-sm text-base-content/80 font-medium capitalize">{profile.exercise}</span>
                          </div>
                        )}
                        {profile.diet && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-base-content/60">Diet:</span>
                            <span className="text-sm text-base-content/80 font-medium capitalize">{profile.diet}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              }

              // Interests
              if (profile.interests && profile.interests.length > 0) {
                contentSections.push({
                  id: 'interests',
                  component: (
                    <div key="interests" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                      <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-info/10 text-info text-xs font-medium rounded-full border border-info/20"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })
              }

              // Hobbies
              if (profile.hobbies && profile.hobbies.length > 0) {
                contentSections.push({
                  id: 'hobbies',
                  component: (
                    <div key="hobbies" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                      <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Hobbies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.hobbies.map((hobby, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full border border-secondary/20"
                          >
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })
              }

              // Languages
              if (profile.languages && profile.languages.length > 0) {
                contentSections.push({
                  id: 'languages',
                  component: (
                    <div key="languages" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                      <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-full border border-success/20"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })
              }

              // Skills
              if (profile.skills && profile.skills.length > 0) {
                contentSections.push({
                  id: 'skills',
                  component: (
                    <div key="skills" className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
                      <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-warning/10 text-warning text-xs font-medium rounded-full border border-warning/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })
              }

              // Only show bottom section if there are multiple sections
              if (contentSections.length <= 1) {
                return null
              }

              // If multiple sections, smart distribution based on count
              if (contentSections.length > 1) {
                // If even number of sections, split equally
                if (contentSections.length % 2 === 0) {
                  const leftSections = contentSections.filter((_, index) => index % 2 === 0)
                  const rightSections = contentSections.filter((_, index) => index % 2 === 1)

                  return (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {/* Left Half */}
                      <div className="space-y-4">
                        {leftSections.map(section => section.component)}
                      </div>

                      {/* Right Half */}
                      <div className="space-y-4">
                        {rightSections.map(section => section.component)}
                      </div>
                    </div>
                  )
                } else {
                  // If odd number of sections, split first sections and give last section 100% width
                  const sectionsToSplit = contentSections.slice(0, -1) // All except last
                  const lastSection = contentSections[contentSections.length - 1] // Last section
                  
                  const leftSections = sectionsToSplit.filter((_, index) => index % 2 === 0)
                  const rightSections = sectionsToSplit.filter((_, index) => index % 2 === 1)

                  return (
                    <div className="space-y-6">
                      {/* Split sections */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Left Half */}
                        <div className="space-y-4">
                          {leftSections.map(section => section.component)}
                        </div>

                        {/* Right Half */}
                        <div className="space-y-4">
                          {rightSections.map(section => section.component)}
                        </div>
                      </div>

                      {/* Last section with 100% width */}
                      <div className="w-full">
                        {lastSection.component}
                      </div>
                    </div>
                  )
                }
              }

              return null
            })()}
          </div>

          {/* Error Message Display */}
          {sparkleError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 shadow-lg z-10"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm text-red-700 font-medium">{sparkleError}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox Viewer */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <div className="relative max-w-4xl w-full h-[calc(100vh-8rem)] mt-16 mb-16 bg-base-100/5 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="w-full h-full flex items-center justify-center bg-black/30">
              {Array.isArray(profile.photoUrl) && profile.photoUrl.length > 0 ? (
                <img
                  src={profile.photoUrl[Math.max(0, Math.min(lightboxIndex, profile.photoUrl.length - 1))]}
                  alt="Full size"
                  className="max-w-full max-h-full object-contain"
                />
              ) : null}
            </div>

            {/* Nav Controls */}
            {Array.isArray(profile.photoUrl) && profile.photoUrl.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((idx) => (idx === 0 ? profile.photoUrl.length - 1 : idx - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setLightboxIndex((idx) => (idx === profile.photoUrl.length - 1 ? 0 : idx + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {Math.max(0, Math.min(lightboxIndex, (profile.photoUrl?.length || 1) - 1)) + 1}/{profile.photoUrl?.length || 1}
                </div>
              </>
            )}
          </div>
        </div>
      )}

       {/* Special Like Confirmation Dialog */}
       {showSparkleDialog && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 20 }}
             className="bg-base-100 rounded-xl shadow-2xl border border-base-300 max-w-sm w-full"
           >
                           {/* Header */}
              <div className="p-3 border-b border-base-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-base-content">Send Special Like</h3>
                    <p className="text-xs text-base-content/70">Confirm your special interest</p>
                  </div>
                </div>
              </div>

                           {/* Content */}
              <div className="p-3 space-y-2.5">
                                 {/* Quick Info */}
                 <div className="space-y-2">
                   <div className="flex items-start gap-2">
                     <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                     <div className="text-xs text-base-content/70 leading-relaxed">
                       Profile will be saved to your "Saved Profiles" collection
                     </div>
                   </div>
                   
                   <div className="flex items-start gap-2">
                     <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                     <div className="text-xs text-base-content/70 leading-relaxed">
                       Access saved profiles via your profile photo → Saved Profiles
                     </div>
                   </div>
                   
                   <div className="flex items-start gap-2">
                     <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                     <div className="text-xs text-base-content/70 leading-relaxed">
                       Track real-time status updates of your requests
                     </div>
                   </div>
                   
                   <div className="flex items-start gap-2">
                     <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                     <div className="text-xs text-base-content/70 leading-relaxed">
                       Send one reminder if needed to review your profile
                     </div>
                   </div>
                 </div>

                {/* Important Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <div className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-700">
                      <strong>Limit:</strong> Maximum 3 profiles can be saved in total
                    </p>
                  </div>
                </div>
              </div>

                           {/* Actions */}
              <div className="p-3 border-t border-base-300 flex gap-2">
                <button
                  onClick={() => setShowSparkleDialog(false)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-base-300 bg-base-100 text-base-content hover:bg-base-200 transition-colors duration-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSparkle}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 text-xs font-medium shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <span>✨</span>
                    <span>Send</span>
                  </span>
                </button>
              </div>
           </motion.div>
         </div>
       )}

      {/* Lightbox Viewer */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <div className="relative max-w-4xl w-full h-[calc(100vh-8rem)] mt-16 mb-16 bg-base-100/5 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="w-full h-full flex items-center justify-center bg-black/30">
              {Array.isArray(profile.photoUrl) && profile.photoUrl.length > 0 ? (
                <img
                  src={profile.photoUrl[Math.max(0, Math.min(lightboxIndex, profile.photoUrl.length - 1))]}
                  alt="Full size"
                  className="max-w-full max-h-full object-contain"
                />
              ) : null}
            </div>

            {/* Nav Controls - Only show if multiple photos */}
            {Array.isArray(profile.photoUrl) && profile.photoUrl.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((idx) => (idx === 0 ? profile.photoUrl.length - 1 : idx - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setLightboxIndex((idx) => (idx === profile.photoUrl.length - 1 ? 0 : idx + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {Math.max(0, Math.min(lightboxIndex, (profile.photoUrl?.length || 1) - 1)) + 1}/{profile.photoUrl?.length || 1}
                </div>
              </>
            )}
          </div>
        </div>
      )}
     </div>
   )
 }

export default UserFeed

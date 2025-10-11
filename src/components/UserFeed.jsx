import { motion } from 'framer-motion'
import { useState } from 'react'

const UserFeed = ({ profile, onLike, onDislike, onSparkleLike, sparkleError }) => {
  const [showSparkleDialog, setShowSparkleDialog] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  
  if (!profile) return null

  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()

  // Collect all available sections for balanced distribution
  const getAvailableSections = () => {
    const sections = []
    
    // About section
    if (profile.about && profile.about.trim()) {
      sections.push({
        id: 'about',
        component: (
          <div key="about" className="bg-base-200/30 rounded-xl p-3 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About
            </h3>
            <p className="text-base-content/80 leading-relaxed text-sm break-words whitespace-pre-wrap">
              {profile.about}
            </p>
          </div>
        )
      })
    }

    // Location & Lifestyle section
    if (profile.location?.city || profile.occupation || profile.education) {
      sections.push({
        id: 'location',
        component: (
          <div key="location" className="bg-base-200/30 rounded-xl p-3 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location & Lifestyle
            </h3>
            <div className="space-y-2">
              {profile.location?.city && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60 w-16">Location:</span>
                  <span className="text-sm text-base-content/80">{profile.location.city}{profile.location.state && `, ${profile.location.state}`}</span>
                </div>
              )}
              {profile.occupation && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60 w-16">Works as:</span>
                  <span className="text-sm text-base-content/80">{profile.occupation}</span>
                </div>
              )}
              {profile.education && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60 w-16">Education:</span>
                  <span className="text-sm text-base-content/80">{profile.education}</span>
                </div>
              )}
            </div>
          </div>
        )
      })
    }

    // Lifestyle Preferences section
    if (profile.smoking || profile.drinking || profile.exercise || profile.diet) {
      sections.push({
        id: 'lifestyle',
        component: (
          <div key="lifestyle" className="bg-base-200/30 rounded-xl p-3 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Lifestyle
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {profile.smoking && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60">Smoking:</span>
                  <span className="text-sm text-base-content/80 font-medium">{profile.smoking}</span>
                </div>
              )}
              {profile.drinking && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60">Drinking:</span>
                  <span className="text-sm text-base-content/80 font-medium">{profile.drinking}</span>
                </div>
              )}
              {profile.exercise && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60">Exercise:</span>
                  <span className="text-sm text-base-content/80 font-medium">{profile.exercise}</span>
                </div>
              )}
              {profile.diet && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60">Diet:</span>
                  <span className="text-sm text-base-content/80 font-medium">{profile.diet}</span>
                </div>
              )}
            </div>
          </div>
        )
      })
    }

    // Family & Relationships section
    if (profile.hasKids || profile.wantsKids) {
      sections.push({
        id: 'family',
        component: (
          <div key="family" className="bg-base-200/30 rounded-xl p-3 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Family & Relationships
            </h3>
            <div className="space-y-2">
              {profile.hasKids && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60">Has kids:</span>
                  <span className="text-sm text-base-content/80 font-medium">{profile.hasKids}</span>
                </div>
              )}
              {profile.wantsKids && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60">Wants kids:</span>
                  <span className="text-sm text-base-content/80 font-medium">{profile.wantsKids}</span>
                </div>
              )}
            </div>
          </div>
        )
      })
    }

    // Interests & Hobbies section
    if ((profile.interests && profile.interests.length > 0) || (profile.hobbies && profile.hobbies.length > 0)) {
      sections.push({
        id: 'interests',
        component: (
          <div key="interests" className="bg-base-200/30 rounded-xl p-3 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Interests & Hobbies
            </h3>
            <div className="space-y-3">
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <span className="text-xs text-base-content/60 block mb-2">Interests:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.hobbies && profile.hobbies.length > 0 && (
                <div>
                  <span className="text-xs text-base-content/60 block mb-2">Hobbies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.hobbies.map((hobby, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-full border border-secondary/20"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })
    }

    // Skills section
    if (profile.skills && profile.skills.length > 0) {
      sections.push({
        id: 'skills',
        component: (
          <div key="skills" className="bg-base-200/30 rounded-xl p-3 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full border border-accent/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )
      })
    }

    // Languages section
    if (profile.languages && profile.languages.length > 0) {
      sections.push({
        id: 'languages',
        component: (
          <div key="languages" className="bg-base-200/30 rounded-xl p-3 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Languages
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.languages.map((language, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-info/10 text-info rounded-full border border-info/20"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )
      })
    }

    return sections
  }

  // Distribute sections evenly between columns
  const distributeSections = () => {
    const sections = getAvailableSections()
    const leftColumn = []
    const rightColumn = []
    
    sections.forEach((section, index) => {
      if (index % 2 === 0) {
        leftColumn.push(section.component)
      } else {
        rightColumn.push(section.component)
      }
    })
    
    return { leftColumn, rightColumn }
  }

  const { leftColumn, rightColumn } = distributeSections()

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
    <div className="rounded-2xl shadow-lg bg-base-100 border border-base-300/30 max-w-4xl mx-auto w-full">
      <div className="grid grid-cols-1 gap-6">
        {/* Top: Image Section */}
        <div className="relative bg-base-200 lg:h-[400px] h-64 flex items-center justify-center">
          {profile.photoUrl && profile.photoUrl.length > 0 ? (
            <>
              <img
                src={profile.photoUrl[currentPhotoIndex]}
                alt={fullName || 'User photo'}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              
              {/* Photo Navigation Arrows */}
              {profile.photoUrl.length > 1 && (
                <>
                  {/* Previous Arrow */}
                  <button
                    onClick={handlePreviousPhoto}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10"
                    aria-label="Previous photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Next Arrow */}
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10"
                    aria-label="Next photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Photo Counter */}
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentPhotoIndex + 1} / {profile.photoUrl.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-base-content/40">
              <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm">No photo available</p>
            </div>
          )}

                     {/* Action Buttons */}
           <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 translate-y-1/2">
             {/* Dislike Button */}
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => onDislike?.(profile)}
               className="w-14 h-14 rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-xl border-2 border-red-200 flex items-center justify-center hover:bg-gradient-to-br hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:shadow-red-500/20 transition-all duration-200 group"
               aria-label="Not interested"
             >
               <svg className="w-6 h-6 text-red-500 group-hover:text-red-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </motion.button>

             {/* Like Button */}
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => onLike?.(profile)}
               className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-600 hover:shadow-pink-500/30 transition-all duration-200 group"
               aria-label="Interested"
             >
               <svg className="w-6 h-6 text-white group-hover:scale-105 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.22 2.44C11.09 5 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
             </motion.button>

             {/* Sparkle Button */}
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleSparkleClick}
               className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-xl border border-slate-600 flex items-center justify-center hover:bg-gradient-to-br hover:from-slate-600 hover:to-slate-700 hover:border-slate-500 hover:shadow-slate-500/20 transition-all duration-200 group"
               aria-label="Send special like"
             >
               <span className="text-xl group-hover:scale-110 transition-transform duration-200 text-amber-300 group-hover:text-amber-200">✨</span>
             </motion.button>
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

        {/* Bottom: Details Section - Split into two columns */}
        <div className="p-4 text-base-content">
          {/* Header Info - Always at top */}
          <div className="space-y-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-base-content mb-2 break-words leading-tight">{fullName || 'Someone new'}</h2>
              
              {/* Basic Info Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                {profile.age && (
                  <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
                    🎂 {profile.age} years old
                  </span>
                )}
                {profile.gender && (
                  <span className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-full font-medium">
                    {profile.gender === 'Male' ? '👨‍💼' : profile.gender === 'Female' ? '👩‍💼' : '🧑‍💼'} {profile.gender}
                  </span>
                )}
                {profile.height && (
                  <span className="px-3 py-1.5 bg-accent/10 text-accent rounded-full font-medium">
                    📐 {profile.height}
                  </span>
                )}
                {profile.weight && (
                  <span className="px-3 py-1.5 bg-info/10 text-info rounded-full font-medium">
                    🏋️ {profile.weight}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Content Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {leftColumn}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {rightColumn}
            </div>
          </div>
        </div>
      </div>

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
     </div>
   )
 }

export default UserFeed

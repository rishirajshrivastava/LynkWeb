import { motion } from 'framer-motion'
import { useState } from 'react'

const UserFeed = ({ profile, onLike, onDislike, onSparkleLike, sparkleError }) => {
  const [showSparkleDialog, setShowSparkleDialog] = useState(false)
  
  if (!profile) return null

  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()

  const handleSparkleClick = () => {
    setShowSparkleDialog(true)
  }

  const handleConfirmSparkle = () => {
    setShowSparkleDialog(false)
    onSparkleLike?.(profile)
  }

  return (
    <div className="rounded-2xl shadow-lg bg-base-100 border border-base-300/30 max-w-4xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Image Section */}
        <div className="relative bg-base-200 lg:h-[400px] h-64 flex items-center justify-center">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={fullName || 'User photo'}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
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

        {/* Right: Details Section */}
        <div className="p-3 text-base-content lg:pl-0 flex flex-col h-full">
          {/* Header Info - Fixed at top */}
          <div className="space-y-2 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-base-content mb-1 break-words leading-tight">{fullName || 'Someone new'}</h2>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-base-content/70 mb-2">
                {profile.age && (
                  <span className="px-2 py-1 bg-base-200 rounded text-base-content/80 text-xs whitespace-nowrap">
                    {profile.age} years old
                  </span>
                )}
                {profile.gender && (
                  <span className="px-2 py-1 bg-base-200 rounded text-base-content/80 text-xs whitespace-nowrap">
                    {profile.gender}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Area - Flexible space distribution */}
          <div className="flex-1 flex flex-col space-y-3">
            {/* About Section */}
            {profile.about && profile.about.trim() && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-xs font-medium text-base-content mb-2">About</h3>
                <div className="bg-base-200/50 rounded-lg p-2 border border-base-300/30 flex-1">
                  <p className="text-base-content/80 leading-relaxed text-xs break-words whitespace-pre-wrap h-full">
                    {profile.about}
                  </p>
                </div>
              </div>
            )}

            {/* Skills Section */}
            {(() => {
              const validSkills = (profile.skills ?? []).filter(skill => skill && skill.trim());
              return validSkills.length > 0 ? (
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xs font-medium text-base-content mb-2">Skills & Interests</h3>
                  <div className="flex flex-wrap gap-1.5 flex-1 items-start content-start">
                    {validSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-base-200 text-base-content/80 rounded border border-base-300/50 flex-shrink-0"
                        title={skill}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
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
                      <strong>Limit:</strong> Maximum 5 profiles can be saved in total
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

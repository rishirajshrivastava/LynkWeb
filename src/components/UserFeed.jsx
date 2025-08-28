import { motion } from 'framer-motion'

const UserFeed = ({ profile, onLike, onDislike }) => {
  if (!profile) return null

  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()

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
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
            {/* Dislike Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDislike?.(profile)}
              className="w-16 h-16 rounded-full bg-base-100 shadow-lg border-2 border-base-300 flex items-center justify-center hover:bg-base-200 hover:border-base-400 transition-all duration-200"
              aria-label="Not interested"
            >
              <svg className="w-7 h-7 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLike?.(profile)}
              className="w-16 h-16 rounded-full bg-primary shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all duration-200"
              aria-label="Interested"
            >
              <svg className="w-7 h-7 text-primary-content" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.22 2.44C11.09 5 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </motion.button>
          </div>
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
    </div>
  )
}

export default UserFeed

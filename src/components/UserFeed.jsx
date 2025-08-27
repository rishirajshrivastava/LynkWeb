import { motion } from 'framer-motion'

const UserFeed = ({ profile, onLike, onDislike }) => {
  if (!profile) return null

  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 border border-neutral-700 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image */}
        <div className="relative bg-neutral-800 md:h-[360px] h-64 flex items-center justify-center">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={fullName || 'User photo'}
              className="w-full h-full object-contain bg-neutral-900"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
              No photo
            </div>
          )}

          {/* Like/Dislike Buttons */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-8">
            {/* Dislike */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDislike?.(profile)}
              className="relative group w-14 h-14 rounded-full bg-neutral-900/80 border border-neutral-700 shadow-lg flex items-center justify-center hover:bg-neutral-800 transition-all"
              aria-label="Dislike"
            >
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {/* Tooltip */}
              <span className="absolute bottom-16 scale-0 group-hover:scale-100 transition-all rounded-md bg-black/80 text-xs text-white px-2 py-1">
                Dislike
              </span>
            </motion.button>

            {/* Like */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike?.(profile)}
              className="relative group w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg flex items-center justify-center hover:from-rose-600 hover:to-pink-600 transition-all"
              aria-label="Like"
            >
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.22 2.44C11.09 5 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {/* Tooltip */}
              <span className="absolute bottom-16 scale-0 group-hover:scale-100 transition-all rounded-md bg-black/80 text-xs text-white px-2 py-1">
                Like
              </span>
            </motion.button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="p-6 text-neutral-100 flex flex-col">
          <h2 className="text-2xl font-semibold">{fullName || 'Someone new'}</h2>

          {/* Meta Info */}
          <div className="text-sm text-neutral-400 mb-4 flex gap-4">
            {profile.age && <span>📅 {profile.age} yrs</span>}
            {profile.gender && <span>⚧ {profile.gender}</span>}
          </div>

          {profile.about && (
            <div className="text-neutral-300 leading-relaxed mb-6 max-h-[200px] overflow-y-auto pr-2 custom-scroll">
              {profile.about}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {(profile.skills ?? []).length > 0 ? (
              profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm bg-rose-500/20 text-rose-300 border border-rose-500/30"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-neutral-500 text-sm">No interests added yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserFeed

import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import EditProfile from "./EditProfile"

const Profile = () => {
  const user = useSelector((store) => store.user)
  const [mode, setMode] = useState("view")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [mode])

  if (!user) return null

  return (
    <div className="px-4 pt-24 pb-28 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Toggle */}
        <div className="mb-6 flex items-center justify-center sticky top-16 z-20">
          <div className="relative bg-base-200/90 backdrop-blur border border-base-300 rounded-xl p-1 w-full max-w-xs shadow-sm">
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-lg bg-primary"
              animate={{ x: mode === "view" ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            />
            <div className="relative grid grid-cols-2 text-sm font-medium">
              <button
                type="button"
                onClick={() => setMode("view")}
                className={`py-2 z-10 rounded-lg transition-colors ${
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
                className={`py-2 z-10 rounded-lg transition-colors ${
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="w-full bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-200"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-1/3 bg-base-200 flex items-center justify-center p-4">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full max-h-80 object-contain rounded-xl"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-base-content/50 text-sm">
                      No photo available
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                      <h2 className="text-2xl md:text-3xl font-semibold text-base-content">
                        {user.firstName} {user.lastName}
                        {user.age && (
                          <span className="ml-2 text-lg font-medium text-base-content/70 align-middle">
                            {user.age}
                          </span>
                        )}
                      </h2>
                      {user.gender && (
                        <span className="text-sm md:text-base text-base-content/70">
                          {user.gender}
                        </span>
                      )}
                    </div>

                    {user.about && (
                      <p className="mt-2 text-base-content/80 text-sm md:text-base leading-relaxed">
                        {user.about}
                      </p>
                    )}

                    {user.skills && user.skills.length > 0 && (
                      <div className="mt-5">
                        <h3 className="text-sm font-semibold text-base-content mb-2">
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary/10 text-primary text-xs md:text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <EditProfile setMode={setMode} defaultPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Profile
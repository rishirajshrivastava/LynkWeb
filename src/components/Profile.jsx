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
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 px-4 pt-24 pb-28">
      <div className="w-full max-w-7xl mx-auto">
        {/* Toggle */}
        <div className="mb-6 flex items-center justify-center sticky top-16 z-20">
          <div className="relative bg-base-100 border border-base-300 rounded-2xl p-1.5 w-full max-w-sm shadow-lg">
            <motion.div
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-primary shadow-sm"
              animate={{ x: mode === "view" ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            />
            <div className="relative grid grid-cols-2 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setMode("view")}
                className={`py-3 px-4 z-10 rounded-xl transition-colors ${
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
                className={`py-3 px-4 z-10 rounded-xl transition-colors ${
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
                <div className="flex flex-col xl:flex-row">
                  {/* Left Side - Photo and Basic Info */}
                  <div className="w-full xl:w-2/5 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 flex flex-col items-center justify-center">
                    <div className="text-center space-y-6">
                      {/* Profile Photo */}
                      <div className="mb-4">
                        {user.photoUrl ? (
                          <img
                            src={user.photoUrl}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-base-100"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        ) : (
                          <div className="w-40 h-40 bg-base-200 rounded-full border-4 border-base-100 flex items-center justify-center">
                            <svg className="w-20 h-20 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Name and Basic Info */}
                      <h1 className="text-3xl font-bold text-base-content">
                        {user.firstName} {user.lastName}
                      </h1>
                      
                      <div className="flex items-center gap-3 flex-wrap justify-center">
                        {user.age && (
                          <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                            {user.age} years old
                          </span>
                        )}
                        {user.gender && (
                          <span className="px-4 py-2 bg-secondary/10 text-secondary text-sm font-medium rounded-full border border-secondary/20">
                            {user.gender}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Detailed Info */}
                  <div className="w-full xl:w-3/5 p-8">
                    <div className="h-full flex flex-col justify-center space-y-6">
                      {/* About Section */}
                      {user.about && (
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold text-base-content flex items-center">
                            <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                            About
                          </h3>
                          <div className="bg-base-200/50 rounded-2xl p-5 border border-base-300/30">
                            <p className="text-base-content/80 leading-relaxed text-base">
                              {user.about}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Skills Section */}
                      {user.skills && user.skills.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold text-base-content flex items-center">
                            <div className="w-3 h-3 bg-secondary rounded-full mr-3"></div>
                            Skills & Expertise
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {user.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 bg-base-200 text-base-content text-sm font-medium rounded-xl border border-base-300 hover:bg-base-300 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty state if no content */}
                      {!user.about && (!user.skills || user.skills.length === 0) && (
                        <div className="text-center text-base-content/50 py-8">
                          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-lg">Add some information to make your profile stand out!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
    </div>
  )
}

export default Profile
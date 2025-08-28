import { useSelector, useDispatch } from "react-redux"
import { useState, useMemo, useEffect } from "react"
import ProfilePreview from "./ProfilePreview"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { addUser } from "../utils/userSlice"

const EditProfile = ({ setMode, setIsPreview, defaultPreview = false }) => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "")
  const [about, setAbout] = useState(user?.about || "")
  const [skillsInput, setSkillsInput] = useState((user?.skills || []).join(", "))

  const skills = useMemo(() =>
    skillsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
  , [skillsInput])

  const [preview, setPreview] = useState(defaultPreview)
  useEffect(() => {
    // Scroll to top smoothly when switching preview
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (setIsPreview) setIsPreview(preview)
  }, [preview])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [discardOpen, setDiscardOpen] = useState(false)
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false)

  const handleEditProfile = async () => {
    try {
      setSubmitting(true)
      setError("")
      const payload = {
        firstName,
        lastName,
        photoUrl,
        about,
        skills,
      }

      const res = await axios.patch(`${BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
      })

      const updated = res?.data?.data ?? res?.data?.user ?? res?.data
      if (updated) {
        dispatch(addUser(updated))
        // exit preview if open and go back to view mode
        setPreview(false)
        if (setMode) setMode("view")
      }
    } catch (err) {
      console.log("Error updating profile", err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveClick = () => {
    setSaveConfirmOpen(true)
  }

  return (
    <div className="bg-base-100 rounded-3xl shadow-xl overflow-hidden border border-base-300/50 flex flex-col">
      {/* Main content - side by side layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-8 flex-1">
        {/* Live Preview Panel (Left) */}
        <div className="bg-base-200/50 rounded-2xl border border-base-300/30">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Preview
            </h3>
            <div className="text-sm sm:text-base text-base-content/60 mb-4">
              This is exactly how others will see your profile
            </div>
            
            {/* Profile Preview Component */}
            <div className="bg-base-100 rounded-xl overflow-hidden border border-base-300/30">
              <ProfilePreview
                firstName={firstName}
                lastName={lastName}
                photoUrl={photoUrl}
                about={about}
                skills={skills}
                onUpdate={handleEditProfile}
                onDiscard={() => { if (setMode) setMode('view'); }}
                hideHeader
              />
            </div>
          </div>
        </div>

        {/* Editor Panel (Right) */}
        <div className="bg-base-200/50 rounded-2xl border border-base-300/30">
          <div className="p-8">
            <h3 className="text-xl font-semibold text-base-content mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Your Information
            </h3>
            
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content/80 text-base">First Name</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full h-12 text-base bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content/80 text-base">Last Name</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full h-12 text-base bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* About Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80 text-base">About You</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered w-full h-40 text-base resize-none bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                  value={about} 
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell others about yourself, your interests, or what you're looking for..."
                />
                <div className="mt-2">
                  <span className="text-sm sm:text-base text-base-content/60">Share your story, interests, or what you're looking for</span>
                </div>
              </div>

              {/* Photo URL Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80 text-base">Profile Photo URL</span>
                </label>
                <input 
                  type="url" 
                  className="input input-bordered w-full h-12 text-base bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                  value={photoUrl} 
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                />
                <div className="mt-2">
                  <span className="text-sm sm:text-base text-base-content/60">Paste a direct link to your profile image</span>
                </div>
              </div>

              {/* Skills Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80 text-base">Skills & Interests</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full h-12 text-base bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                  value={skillsInput} 
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g., Photography, Cooking, Travel, Music"
                />
                <div className="mt-2">
                  <span className="text-sm sm:text-base text-base-content/60">Separate multiple skills with commas</span>
                </div>
              </div>

              {/* Action Buttons - Below Skills Section */}
              <div className="pt-4">
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button 
                    onClick={handleSaveClick} 
                    className={`btn btn-primary w-full sm:w-auto text-sm sm:text-base ${submitting ? 'btn-disabled' : ''}`} 
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm sm:text-base">Updating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm sm:text-base">Update Profile</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setDiscardOpen(true)} 
                    className="btn btn-outline btn-error w-full sm:w-auto text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm sm:text-base">Discard Changes</span>
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="alert alert-error mt-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-base">{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Discard Confirmation Modal */}
      {discardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-base-100 text-base-content rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-base-200">
              <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Discard Changes?</h3>
            </div>
            
            {/* Body */}
            <div className="px-6 py-4">
              <p className="text-base-content/80 leading-relaxed">
                All your unsaved changes will be lost. Your profile will remain unchanged.
              </p>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-base-200 flex justify-end gap-3">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setDiscardOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => {
                  setDiscardOpen(false);
                  setPreview(false);
                  if (setMode) setMode("view");
                }}
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {saveConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-base-100 text-base-content rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-base-200">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Update Profile?</h3>
            </div>
            
            {/* Body */}
            <div className="px-6 py-4">
              <p className="text-base-content/80 leading-relaxed">
                Are you sure you want to save these changes to your profile? This will update your public profile information.
              </p>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-base-200 flex justify-end gap-3">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSaveConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSaveConfirmOpen(false);
                  handleEditProfile();
                }}
              >
                Yes, Update Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditProfile

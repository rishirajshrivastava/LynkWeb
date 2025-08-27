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

  return (
    <div className="bg-base-200 rounded-2xl shadow-xl overflow-hidden border border-base-200">
      {/* Edit + Preview side-by-side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
          {/* Editor (left) */}
          <div className="bg-base-100 rounded-xl border border-base-300">
            <div className="p-4 border-b border-base-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <div className="flex gap-2">
                <button onClick={handleEditProfile} className={`btn btn-primary btn-sm ${submitting ? 'btn-disabled' : ''}`} disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update profile'}
                </button>
                <button onClick={() => setDiscardOpen(true)} className="btn btn-error btn-sm">Discard</button>
              </div>
            </div>
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label"><span className="label-text">First Name</span></label>
                  <input type="text" className="input input-bordered w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text">Last Name</span></label>
                  <input type="text" className="input input-bordered w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">About</span></label>
                <textarea className="textarea textarea-bordered w-full h-40 resize-none" value={about} onChange={(e) => setAbout(e.target.value)} />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Photo URL</span></label>
                <input type="url" className="input input-bordered w-full" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Skills (comma separated)</span></label>
                <input type="text" className="input input-bordered w-full" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview (right) */}
          <div className="bg-base-100 rounded-xl border border-base-300">
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

      {/* Discard modal (preview layout) */}
      {preview && discardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3">
          <div className="bg-base-100 text-base-content rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in-0 zoom-in-95">
            
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-base-200">
              <div className="w-7 h-7 rounded-full bg-error/10 text-error flex items-center justify-center text-sm font-bold">
                !
              </div>
              <h3 className="text-base font-semibold">Discard changes?</h3>
            </div>
            
            {/* Body */}
            <div className="px-4 py-3">
              <p className="text-sm opacity-80 leading-relaxed">
                If you discard now, all unsaved edits will be lost and your profile will remain unchanged.
              </p>
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 border-t border-base-200 flex justify-end gap-2">
              <button
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-base-300 hover:bg-base-200 transition"
                onClick={() => setDiscardOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-error text-error-content hover:bg-error/90 transition"
                onClick={() => {
                  setDiscardOpen(false);
                  setPreview(false);
                  if (setMode) setMode("view");
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
        )}
      <div className="flex gap-2 justify-center pb-6">
        <button onClick={handleEditProfile} className={`btn btn-primary btn-sm ${submitting ? 'btn-disabled' : ''}`} disabled={submitting}>
          {submitting ? 'Updating...' : 'Update profile'}
        </button>
        <button onClick={() => setDiscardOpen(true)} className="btn btn-error btn-sm">Discard</button>
      </div>
    </div>
  )
}

export default EditProfile

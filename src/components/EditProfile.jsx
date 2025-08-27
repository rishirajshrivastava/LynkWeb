import { useSelector, useDispatch } from "react-redux"
import { useState, useMemo, useEffect } from "react"
import ProfilePreview from "./ProfilePreview"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { addUser } from "../utils/userSlice"

const EditProfile = ({ setMode, setIsPreview }) => {
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

  const [preview, setPreview] = useState(false)
  useEffect(() => {
    // Scroll to top smoothly when switching preview
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (setIsPreview) setIsPreview(preview)
  }, [preview])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

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
      {/* Preview Mode */}
      {preview && (
        <ProfilePreview
          firstName={firstName}
          lastName={lastName}
          photoUrl={photoUrl}
          about={about}
          skills={skills}
          onBack={() => setPreview(false)}
          onUpdate={handleEditProfile}
          onDiscard={() => { setPreview(false); if (setMode) setMode("view"); }}
        />
      )}
      {/* Header */}
      <div className="p-6 border-b border-base-200">
        <h2 className="text-2xl font-semibold">Edit Profile</h2>
        <p className="text-sm opacity-70 mt-1">Update your information below and click Update Profile to save.</p>
      </div>

      {/* Content: two-row layout */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Row 1: Left (first+last), Right (about) with equal height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col gap-5">
            <div className="form-control w-full">
              <label className="label"><span className="label-text">First Name</span></label>
              <input type="text" className="input input-bordered w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Last Name</span></label>
              <input type="text" className="input input-bordered w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="form-control w-full h-full flex">
            <div className="w-full flex flex-col">
              <label className="label"><span className="label-text">About</span></label>
              <textarea className="textarea textarea-bordered w-full grow min-h-[10rem] resize-none overflow-auto" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Tell others about yourself..." />
            </div>
          </div>
        </div>

        {/* Row 2: full-width Photo URL */}
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Photo URL</span></label>
          <input type="url" className="input input-bordered w-full" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." />
        </div>

        {/* Row 3: full-width Skills */}
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Skills (comma separated)</span></label>
          <input type="text" className="input input-bordered w-full" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="e.g. Cooking, Hiking, Photography" />
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {!preview && (
        <div className="p-6 border-t border-base-200 flex justify-between items-center gap-2">
          <div className="text-error text-sm">{error}</div>
          <div className="flex gap-2">
            <button onClick={() => setPreview(true)} className="btn btn-outline">Preview Profile</button>
            <button onClick={handleEditProfile} className={`btn btn-primary ${submitting ? 'btn-disabled' : ''}`} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditProfile

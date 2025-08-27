import { useState } from "react"

const ProfilePreview = ({ firstName, lastName, photoUrl, about, skills = [], onBack, onUpdate, onDiscard }) => {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="bg-base-100 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-base-200 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Profile Preview</h2>
        <div className="flex gap-2">
          <button onClick={onBack} className="btn btn-outline">Back to edit</button>
          <button onClick={onUpdate} className="btn btn-primary">Update profile</button>
          <button onClick={() => setShowConfirm(true)} className="btn btn-secondary">Discard changes</button>
        </div>
      </div>

      {/* Card body (mirrors Profile.jsx) */}
      <div className="w-full bg-base-100 border-t border-base-200">
        <div className="w-full bg-base-200 flex items-center justify-center">
          <div className="w-full md:w-3/4 aspect-[4/3] flex items-center justify-center bg-base-300">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`${firstName} ${lastName}`}
                className="max-h-full max-w-full object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base-content/50 text-sm">
                No photo available
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-base-content">
              {firstName} {lastName}
            </h2>
          </div>

          {about && (
            <p className="mt-2 text-base-content/80 text-sm md:text-base leading-relaxed">
              {about}
            </p>
          )}

          {skills && skills.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-base-content mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs md:text-sm rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discard confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-base-200 text-base-content rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Discard changes?</h3>
            <p className="text-sm opacity-80 mb-5">If you proceed, your unsaved edits will be lost and no changes will be applied.</p>
            <div className="flex justify-end gap-2">
              <button className="btn" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-error" onClick={() => { setShowConfirm(false); onDiscard && onDiscard(); }}>Discard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePreview



import { useSelector, useDispatch } from "react-redux"
import { useState, useMemo, useEffect } from "react"
import ProfilePreview from "./ProfilePreview"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { addUser } from "../utils/userSlice"

const EditProfile = ({ setMode, setIsPreview, defaultPreview = false }) => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()

  // Define allowed edit fields
  const allowedEditFields = ['firstName', 'lastName', 'about', 'weight', 'occupation', 'education', 'smoking', 'drinking', 'exercise', 'diet','relationshipStatus', 'hasKids','wantKids','hobbies', 'languages']
  
  // Define mandatory fields that cannot be empty
  const mandatoryFields = {
    firstName: 'First Name',
    weight: 'Weight',
    occupation: 'Occupation',
    education: 'Education',
    smoking: 'Smoking',
    drinking: 'Drinking',
    exercise: 'Exercise',
    diet: 'Diet',
    relationshipStatus: 'Relationship Status',
    hasKids: 'Has Kids',
    wantKids: 'Wants Kids'
  }

  // State for all editable fields
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [about, setAbout] = useState(user?.about || "")
  const [weight, setWeight] = useState(user?.weight || "")
  const [occupation, setOccupation] = useState(user?.occupation || "")
  const [education, setEducation] = useState(user?.education || "none")
  const [smoking, setSmoking] = useState(user?.smoking || "never")
  const [drinking, setDrinking] = useState(user?.drinking || "never")
  const [exercise, setExercise] = useState(user?.exercise || "never")
  const [diet, setDiet] = useState(user?.diet || "omnivore")
  const [relationshipStatus, setRelationshipStatus] = useState(user?.relationshipStatus || "single")
  const [hasKids, setHasKids] = useState(user?.hasKids || "no")
  const [wantKids, setWantKids] = useState(user?.wantKids || "no")
  const [hobbiesInput, setHobbiesInput] = useState((user?.hobbies || []).join(", "))
  const [languagesInput, setLanguagesInput] = useState((user?.languages || []).join(", "))


  const hobbies = useMemo(() =>
    hobbiesInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
  , [hobbiesInput])

  const languages = useMemo(() =>
    languagesInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
  , [languagesInput])

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
  const [validationErrors, setValidationErrors] = useState({})

  // Store original values for comparison
  const originalValues = useMemo(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    about: user?.about || "",
    weight: user?.weight || "",
    occupation: user?.occupation || "",
    education: user?.education || "none",
    smoking: user?.smoking || "never",
    drinking: user?.drinking || "never",
    exercise: user?.exercise || "never",
    diet: user?.diet || "omnivore",
    relationshipStatus: user?.relationshipStatus || "single",
    hasKids: user?.hasKids || "no",
    wantKids: user?.wantKids || "no",
    hobbies: (user?.hobbies || []).join(", "),
    languages: (user?.languages || []).join(", ")
  }), [user])

  // Check if there are any changes
  const hasChanges = useMemo(() => {
    return (
      firstName !== originalValues.firstName ||
      lastName !== originalValues.lastName ||
      about !== originalValues.about ||
      weight !== originalValues.weight ||
      occupation !== originalValues.occupation ||
      education !== originalValues.education ||
      smoking !== originalValues.smoking ||
      drinking !== originalValues.drinking ||
      exercise !== originalValues.exercise ||
      diet !== originalValues.diet ||
      relationshipStatus !== originalValues.relationshipStatus ||
      hasKids !== originalValues.hasKids ||
      wantKids !== originalValues.wantKids ||
      hobbiesInput !== originalValues.hobbies ||
      languagesInput !== originalValues.languages
    )
  }, [
    firstName, lastName, about, weight, occupation, education,
    smoking, drinking, exercise, diet, relationshipStatus,
    hasKids, wantKids, hobbiesInput, languagesInput, originalValues
  ])

  // Validation function
  const validateFields = () => {
    const errors = {}
    
    // Create a mapping of field names to their actual values
    const fieldValues = {
      firstName,
      weight,
      occupation,
      education,
      smoking,
      drinking,
      exercise,
      diet,
      relationshipStatus,
      hasKids,
      wantKids
    }
    
    Object.keys(mandatoryFields).forEach(field => {
      const value = fieldValues[field]
      // Handle different data types properly
      if (value === null || value === undefined || 
          (typeof value === 'string' && value.trim() === '') ||
          (typeof value === 'number' && isNaN(value))) {
        errors[field] = `${mandatoryFields[field]} is required`
      }
    })
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Clear validation error for a specific field
  const clearFieldError = (field) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleEditProfile = async () => {
    try {
      setSubmitting(true)
      setError("")
      
      // Validate mandatory fields
      if (!validateFields()) {
        setSubmitting(false)
        return
      }
      
      const payload = {
        firstName,
        lastName,
        about,
        weight,
        occupation,
        education,
        smoking,
        drinking,
        exercise,
        diet,
        relationshipStatus,
        hasKids,
        wantKids,
        hobbies,
        languages,
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
    <div className="bg-base-100 rounded-3xl shadow-xl overflow-hidden border border-base-300/50">
      {/* Top Section - Image on left, content on right */}
      <div className="flex flex-col xl:flex-row">
        {/* Left Side - Photo and Basic Info */}
        <div className="w-full xl:w-2/5 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 flex flex-col items-center xl:sticky xl:top-0 xl:self-start">
          <div className="text-center space-y-4 xl:pt-6">
            {/* Profile Photo */}
            <div className="mb-3 relative">
              {user.photoUrl && user.photoUrl.length > 0 ? (
                <div className="relative">
                  <img
                    src={Array.isArray(user.photoUrl) ? user.photoUrl[0] : user.photoUrl}
                    alt={`${firstName} ${lastName}`}
                    className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-base-100 bg-base-200"
                    style={{ objectPosition: 'center' }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-base-200 rounded-full border-4 border-base-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Name and Basic Info */}
            <div className="space-y-2">
              <input 
                type="text" 
                className={`input input-bordered w-full h-8 text-sm bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 text-center font-bold text-lg ${validationErrors.firstName ? 'input-error' : ''}`}
                value={firstName} 
                onChange={(e) => {
                  setFirstName(e.target.value)
                  clearFieldError('firstName')
                }}
                placeholder="First Name"
              />
              <input 
                type="text" 
                className="input input-bordered w-full h-8 text-sm bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 text-center font-bold text-lg" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {user.age && (
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                  {user.age} years old
                </span>
              )}
              {user.gender && (
                <span className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full border border-secondary/20">
                  {user.gender}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Two Content Blocks */}
        <div className="w-full xl:w-3/5 p-6">
          <div className="space-y-4">
            {/* First Content Block - About & Basic Info */}
            <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
              <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
                About & Basic Info
            </h3>
              <div className="space-y-3">
                {/* About Field */}
                <div>
                  <textarea 
                    className="textarea textarea-bordered w-full h-20 text-sm resize-none bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Tell others about yourself, your interests, or what you're looking for..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/60">Weight:</span>
                    <input 
                      type="number" 
                      className={`input input-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.weight ? 'input-error' : ''}`}
                      value={weight} 
                      onChange={(e) => {
                        setWeight(e.target.value)
                        clearFieldError('weight')
                      }}
                      placeholder="kg"
                    />
              </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/60">Works as:</span>
                    <input 
                      type="text" 
                      className={`input input-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.occupation ? 'input-error' : ''}`}
                      value={occupation} 
                      onChange={(e) => {
                        setOccupation(e.target.value)
                        clearFieldError('occupation')
                      }}
                      placeholder="Occupation"
                    />
                  </div>
                </div>
                </div>
              </div>

            {/* Second Content Block - Professional & Family */}
            <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
              <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Professional & Family
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/60">Education:</span>
                    <select 
                      className={`select select-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.education ? 'select-error' : ''}`}
                      value={education} 
                      onChange={(e) => {
                        setEducation(e.target.value)
                        clearFieldError('education')
                      }}
                    >
                      <option value="none">No formal education</option>
                      <option value="school">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="postgraduate">Postgraduate</option>
                      <option value="doctorate">Doctorate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/60">Has kids:</span>
                    <select 
                      className={`select select-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.hasKids ? 'select-error' : ''}`}
                      value={hasKids} 
                      onChange={(e) => {
                        setHasKids(e.target.value)
                        clearFieldError('hasKids')
                      }}
                    >
                      <option value="no">No</option>
                      <option value="yes-living-with-me">Yes, living with me</option>
                      <option value="yes-not-living-with-me">Yes, not living with me</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/60">Wants kids:</span>
                    <select 
                      className={`select select-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.wantKids ? 'select-error' : ''}`}
                      value={wantKids} 
                      onChange={(e) => {
                        setWantKids(e.target.value)
                        clearFieldError('wantKids')
                      }}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                      <option value="maybe">Maybe</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/60">Relationship:</span>
                    <select 
                      className={`select select-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.relationshipStatus ? 'select-error' : ''}`}
                      value={relationshipStatus} 
                      onChange={(e) => {
                        setRelationshipStatus(e.target.value)
                        clearFieldError('relationshipStatus')
                      }}
                    >
                      <option value="single">Single</option>
                      <option value="dating">Dating</option>
                      <option value="in-a-relationship">In a relationship</option>
                      <option value="engaged">Engaged</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="separated">Separated</option>
                      <option value="widowed">Widowed</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Full Width Content */}
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {/* Lifestyle Preferences */}
          <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Lifestyle Preferences
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/60">Smoking:</span>
                <select 
                  className={`select select-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.smoking ? 'select-error' : ''}`}
                  value={smoking} 
                  onChange={(e) => {
                    setSmoking(e.target.value)
                    clearFieldError('smoking')
                  }}
                >
                  <option value="never">Never</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="regularly">Regularly</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/60">Drinking:</span>
                <select 
                  className={`select select-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.drinking ? 'select-error' : ''}`}
                  value={drinking} 
                  onChange={(e) => {
                    setDrinking(e.target.value)
                    clearFieldError('drinking')
                  }}
                >
                  <option value="never">Never</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="regularly">Regularly</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/60">Exercise:</span>
                <select 
                  className={`select select-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.exercise ? 'select-error' : ''}`}
                  value={exercise} 
                  onChange={(e) => {
                    setExercise(e.target.value)
                    clearFieldError('exercise')
                  }}
                >
                  <option value="never">Never</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="regularly">Regularly</option>
                  <option value="daily">Daily</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/60">Diet:</span>
                <select 
                  className={`select select-bordered w-full h-6 text-xs bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 ${validationErrors.diet ? 'select-error' : ''}`}
                  value={diet} 
                  onChange={(e) => {
                    setDiet(e.target.value)
                    clearFieldError('diet')
                  }}
                >
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hobbies */}
          <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Hobbies
            </h3>
            <div className="flex flex-wrap gap-2">
              <input 
                type="text" 
                className="input input-bordered w-full h-8 text-sm bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                value={hobbiesInput} 
                onChange={(e) => setHobbiesInput(e.target.value)}
                placeholder="e.g., Reading, Hiking, Gaming, Cooking (separate with commas)"
              />
                </div>
              </div>

          {/* Languages */}
          <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/20">
            <h3 className="text-sm font-semibold text-base-content mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
                <input 
                  type="text" 
                className="input input-bordered w-full h-8 text-sm bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                value={languagesInput} 
                onChange={(e) => setLanguagesInput(e.target.value)}
                placeholder="e.g., English, Spanish, French (separate with commas)"
              />
            </div>
          </div>

                </div>
              </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0">
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <button 
                    onClick={handleSaveClick} 
                    className={`btn btn-primary btn-sm w-full sm:w-auto ${submitting || !hasChanges ? 'btn-disabled' : ''}`} 
                    disabled={submitting || !hasChanges}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm">Updating...</span>
                      </>
                    ) : !hasChanges ? (
                      <>
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">No Changes</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">Update Profile</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setDiscardOpen(true)} 
                    className={`btn btn-outline btn-error btn-sm w-full sm:w-auto ${!hasChanges ? 'btn-disabled' : ''}`}
                    disabled={!hasChanges}
                  >
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm">Discard Changes</span>
                  </button>
              </div>

              {/* Validation Errors Display */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="alert alert-warning mt-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-sm">Please fill in all required fields:</div>
                    <ul className="text-xs mt-1 space-y-1">
                      {Object.entries(validationErrors).map(([field, message]) => (
                        <li key={field}>• {message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="alert alert-error mt-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}
      </div>

      {/* Discard Confirmation Modal */}
      {discardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-base-100 text-base-content rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border-b border-base-200">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-semibold">Discard Changes?</h3>
            </div>
            
            {/* Body */}
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
                All your unsaved changes will be lost. Your profile will remain unchanged.
              </p>
            </div>
            
            {/* Footer */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-base-200 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                className="btn btn-outline btn-xs sm:btn-sm w-full sm:w-auto"
                onClick={() => setDiscardOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error btn-xs sm:btn-sm w-full sm:w-auto"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-base-100 text-base-content rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border-b border-base-200">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-semibold">Update Profile?</h3>
            </div>
            
            {/* Body */}
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
                Are you sure you want to save these changes to your profile? This will update your public profile information.
              </p>
            </div>
            
            {/* Footer */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-base-200 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                className="btn btn-outline btn-xs sm:btn-sm w-full sm:w-auto"
                onClick={() => setSaveConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-xs sm:btn-sm w-full sm:w-auto"
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

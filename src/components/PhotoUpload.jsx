import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"

const PhotoUpload = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    setError("")
    setSuccess("")

    // Check total count including existing files
    const totalFiles = selectedFiles.length + files.length
    if (totalFiles > 6) {
      setError(`Maximum 6 photos allowed. You already have ${selectedFiles.length} photos selected.`)
      return
    }

    // Validate file types and sizes
    const validFiles = []
    const invalidFiles = []

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} is not an image`)
      } else if (file.size > 5 * 1024 * 1024) { // 5MB limit
        invalidFiles.push(`${file.name} is too large (max 5MB)`)
      } else {
        validFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      setError(invalidFiles.join(', '))
    }

    if (validFiles.length > 0) {
      // Append new files to existing ones
      const updatedFiles = [...selectedFiles, ...validFiles]
      setSelectedFiles(updatedFiles)
      
      // Create preview URLs for new files and append to existing ones
      const newUrls = validFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newUrls])
    }

    // Clear the input so the same files can be selected again if needed
    event.target.value = ''
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one photo")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      
      // Add files to FormData
      selectedFiles.forEach(file => {
        formData.append('photos', file)
      })

      const response = await axios.post(
        `${BASE_URL}/user/upload-photos`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setSuccess("Photos uploaded successfully! 🎉")
      
      // Update user data in Redux with new photos
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = {
        ...userData,
        photoUrl: response.data.results?.map(result => result.photoUrl) || []
      }
      dispatch(addUser(updatedUser))

      // Redirect to selfie capture page after successful upload
      setTimeout(() => {
        navigate("/selfie-capture", { replace: true })
      }, 2000)

    } catch (err) {
      console.log("Upload error:", err)
      setError(err.response?.data?.message || "Failed to upload photos. Please try again.")
    } finally {
      setUploading(false)
    }
  }


  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    
    setSelectedFiles(newFiles)
    setPreviewUrls(newUrls)
    setError("")
  }

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      dispatch(addUser(null));
      setShowLogoutConfirm(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 sm:px-6 lg:px-8 pt-16 pb-8 sm:pt-20 sm:pb-12">
      <div className="flex justify-center items-start min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        <div className="card bg-base-100 w-full max-w-3xl shadow-xl rounded-2xl border border-base-300">
          <div className="card-body p-4 sm:p-5">
          {/* Header */}
          <div className="text-center mb-3">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold text-base-content mb-1">
              📸 Upload Your Photos
            </h2>
            <p className="text-sm text-base-content/70">
              Add up to 6 photos to complete your profile
            </p>
          </div>

          {/* Information Cards - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-base-content text-xs">Visible to Others</h3>
                  <p className="text-xs text-base-content/60">Seen by other users</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-base-content text-xs">First Impressions</h3>
                  <p className="text-xs text-base-content/60">Great photos help connect</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-base-content text-xs">Build Trust</h3>
                  <p className="text-xs text-base-content/60">Authentic photos create matches</p>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mb-3">
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                selectedFiles.length >= 6 
                  ? 'border-gray-300 cursor-not-allowed opacity-50' 
                  : 'border-primary/30 cursor-pointer hover:border-primary/60 hover:bg-primary/5'
              }`}
              onClick={() => selectedFiles.length < 6 && fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-base-content mb-1">
                  {selectedFiles.length >= 6 
                    ? '✅ Maximum Photos Reached' 
                    : selectedFiles.length > 0 
                      ? '📷 Add More Photos' 
                      : '📷 Click to Upload Photos'
                  }
                </h3>
                <p className="text-sm text-base-content/70 mb-2">
                  {selectedFiles.length >= 6 
                    ? 'You have reached the maximum of 6 photos'
                    : 'PNG, JPG up to 5MB each (max 6 photos)'
                  }
                  {selectedFiles.length > 0 && selectedFiles.length < 6 && (
                    <span className="block text-primary font-medium">
                      {selectedFiles.length}/6 photos selected
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap justify-center gap-1 text-xs text-base-content/50">
                  <span className="px-2 py-1 bg-base-200 rounded-full">PNG, JPG</span>
                  <span className="px-2 py-1 bg-base-200 rounded-full">Max 5MB</span>
                  <span className="px-2 py-1 bg-base-200 rounded-full">Up to 6</span>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Preview Grid */}
          {previewUrls.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-base-content">
                  📸 Selected Photos
                </h3>
                <span className="text-sm text-base-content/60 bg-base-200 px-2 py-1 rounded-full">
                  {selectedFiles.length}/6 photos
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-xl border-2 border-base-300">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm text-center">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mb-3">
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="btn btn-primary w-full rounded-lg text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </div>
              ) : (
                `Upload ${selectedFiles.length} Photo${selectedFiles.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>

          {/* Tips Section - Compact */}
          <div className="p-3 bg-gradient-to-r from-primary/5 to-warning/5 border border-primary/20 rounded-xl">
            <h4 className="font-semibold text-base-content mb-2 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              💡 Photo Tips
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-1">
                <span className="text-primary font-bold">•</span>
                <span className="text-base-content/70">Use clear, well-lit photos that show your face</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-primary font-bold">•</span>
                <span className="text-base-content/70">Include photos of you doing activities you love</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-primary font-bold">•</span>
                <span className="text-base-content/70">Smile naturally - it makes you more approachable</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-primary font-bold">•</span>
                <span className="text-base-content/70">Avoid group photos as your main profile picture</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-4">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="btn btn-ghost w-full text-base-content/70 text-xs btn-sm"
            >
              Logout
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 pointer-events-auto p-2 sm:p-4">
          <div className="bg-base-200 text-base-content rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-3 sm:p-5 text-center animate-fade-in">
            <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Confirm Logout</h2>
            <p className="text-xs sm:text-sm opacity-80 mb-3 sm:mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
              <button
                onClick={handleLogout}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-sm hover:from-red-600 hover:to-red-700 transition-all text-xs sm:text-sm"
              >
                Yes, Log out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700 transition-all text-xs sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoUpload

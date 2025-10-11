import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"

const SelfieCapture = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cameraPermission, setCameraPermission] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraStarted, setCameraStarted] = useState(false)

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      console.log("Component unmounting, cleaning up camera...")
      if (stream) {
        stream.getTracks().forEach(track => {
          console.log("Stopping track on unmount:", track)
          track.stop()
        })
      }
      // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [stream])

  // Handle video element updates when stream changes
  useEffect(() => {
    if (videoRef.current && stream && cameraActive) {
      console.log("Setting video srcObject to new stream")
      videoRef.current.srcObject = stream
      videoRef.current.load()
      videoRef.current.play().catch(err => {
        console.log("Video play error:", err)
      })
    }
  }, [stream, cameraActive])

  const startCamera = async () => {
    try {
      console.log("Starting camera...")
      setError("")
      setCameraPermission("requesting")
      setCameraStarted(true)
      
      // Ensure any existing stream is stopped first
      if (stream) {
        console.log("Stopping existing stream before restart")
        stream.getTracks().forEach(track => track.stop())
      }
      
      console.log("Requesting camera access...")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front camera for selfies
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      })
      
      console.log("Camera access granted, setting up stream:", mediaStream)
      setStream(mediaStream)
      setCameraPermission("granted")
      setCameraActive(true)
      
      if (videoRef.current) {
        console.log("Setting video srcObject and playing...")
        videoRef.current.srcObject = mediaStream
        // Force video to load and play
        videoRef.current.load()
        videoRef.current.play().catch(err => {
          console.log("Video play error:", err)
        })
      } else {
        console.log("Video ref not available")
      }
    } catch (err) {
      console.log("Camera error:", err)
      setCameraPermission("denied")
      setCameraActive(false)
      setCameraStarted(false)
      if (err.name === 'NotAllowedError') {
        setError("Camera permission denied. Please allow camera access to take a selfie.")
      } else if (err.name === 'NotFoundError') {
        setError("No camera found on this device.")
      } else {
        setError("Failed to access camera. Please try again.")
      }
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    setIsCapturing(true)
    setError("")
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
        setCapturedImage(file)
        setIsCapturing(false)
        
        // Immediately stop camera to save resources after capturing
        console.log("Photo captured, stopping camera immediately...")
        if (stream) {
          stream.getTracks().forEach(track => {
            console.log("Force stopping track after capture:", track)
            track.stop()
          })
          setStream(null)
          setCameraActive(false)
          
          // Clear video element immediately
          if (videoRef.current) {
            videoRef.current.srcObject = null
            videoRef.current.load()
          }
        }
      } else {
        setError("Failed to capture photo. Please try again.")
        setIsCapturing(false)
      }
    }, 'image/jpeg', 0.8)
  }

  const stopCamera = () => {
    console.log("Stopping camera, current stream:", stream)
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log("Stopping track:", track)
        track.stop()
      })
      setStream(null)
      setCameraActive(false)
      
      // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null
        videoRef.current.load()
      }
      
      console.log("Camera stopped successfully")
    } else {
      console.log("No stream to stop")
    }
  }

  const retakePhoto = async () => {
    console.log("Retake photo clicked")
    setCapturedImage(null)
    setError("")
    
    // Stop current camera completely
    stopCamera()
    console.log("Camera stopped, restarting in 200ms...")
    
    // Wait a moment then restart camera
    setTimeout(() => {
      console.log("Restarting camera...")
      startCamera()
    }, 200)
  }

  const handleUpload = async () => {
    if (!capturedImage) {
      setError("Please capture a selfie photo first")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      formData.append('selfie', capturedImage)

      // Upload selfie
      const uploadResponse = await axios.post(
        `${BASE_URL}/user/upload-selfie`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      // Update verification in progress status
      await axios.put(
        `${BASE_URL}/user-verification-in-progress`,
        { verificationInProgress: true },
        { withCredentials: true }
      )

      setSuccess("Selfie uploaded successfully! Verification is now in progress.")

      // Update user data in Redux
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = {
        ...userData,
        clickedPhoto: uploadResponse.data.selfieUrl,
        verificationStatus: {
          ...userData.verificationStatus,
          verificationInProgress: true
        }
      }
      dispatch(addUser(updatedUser))

      // Redirect to verification required page after successful upload
      setTimeout(() => {
        navigate("/verification-required", { replace: true })
      }, 2000)

    } catch (err) {
      console.log("Upload error:", err)
      setError(err.response?.data?.message || "Failed to upload selfie. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const retryCamera = () => {
    setCameraPermission(null)
    setCameraActive(false)
    setCameraStarted(false)
    setError("")
    stopCamera()
    setTimeout(() => {
      startCamera()
    }, 100)
  }

  return (
    <div className="min-h-screen bg-base-200 px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)]">
        <div className="card bg-base-100 w-full max-w-2xl shadow-xl rounded-2xl border border-base-300">
          <div className="card-body p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-primary/10">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-base-content mb-2">
                📸 Take a Selfie for Verification
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70">
                Please take a clear selfie to complete your verification
              </p>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-base-content text-sm">Identity Verification</h3>
                    <p className="text-xs text-base-content/60">Confirm your identity</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-base-content text-sm">Quick Process</h3>
                    <p className="text-xs text-base-content/60">Takes just a few seconds</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Area */}
            <div className="mb-4">
              {!cameraStarted && (
                <div className="aspect-video bg-base-200 rounded-xl border-2 border-base-300 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-base-content mb-2">
                      📸 Ready to Take Your Selfie?
                    </h3>
                    <p className="text-sm text-base-content/70 mb-4">
                      Click the button below to start your camera and take a selfie for verification
                    </p>
                    <button
                      onClick={startCamera}
                      className="btn btn-primary"
                    >
                      Start Camera
                    </button>
                  </div>
                </div>
              )}

              {cameraPermission === "granted" && !capturedImage && cameraActive && (
                <div className="relative">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden border-2 border-base-300">
                    <video
                      key={stream ? 'active' : 'inactive'}
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {isCapturing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <p className="text-sm">Capturing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={capturePhoto}
                      disabled={isCapturing}
                      className="btn btn-primary rounded-full w-16 h-16 flex items-center justify-center disabled:opacity-50"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {cameraPermission === "requesting" && (
                <div className="aspect-video bg-base-200 rounded-xl border-2 border-base-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-base-content/70">Requesting camera permission...</p>
                  </div>
                </div>
              )}

              {cameraPermission === "denied" && (
                <div className="aspect-video bg-red-50 rounded-xl border-2 border-red-200 flex items-center justify-center">
                  <div className="text-center p-4">
                    <svg className="w-12 h-12 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-sm text-red-700 mb-3">Camera access denied</p>
                    <button
                      onClick={retryCamera}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Show loading when retaking */}
              {cameraPermission === "granted" && !capturedImage && !cameraActive && (
                <div className="aspect-video bg-base-200 rounded-xl border-2 border-base-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-base-content/70">Restarting camera...</p>
                  </div>
                </div>
              )}

              {/* Hidden canvas for capturing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Captured Photo Preview */}
            {capturedImage && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-base-content">
                    📸 Captured Selfie
                  </h3>
                  <button
                    onClick={retakePhoto}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Retake
                  </button>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 overflow-hidden rounded-xl border-2 border-base-300">
                      <img
                        src={URL.createObjectURL(capturedImage)}
                        alt="Captured Selfie"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="mb-4">
              <button
                onClick={handleUpload}
                disabled={!capturedImage || uploading}
                className="btn btn-primary w-full rounded-lg text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </div>
                ) : (
                  "Submit Selfie for Verification"
                )}
              </button>
            </div>

            {/* Tips Section */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-warning/5 border border-primary/20 rounded-xl">
              <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                💡 Selfie Tips for Better Verification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-base-content/70">Make sure your face is clearly visible</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-base-content/70">Use good lighting - avoid shadows on your face</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-base-content/70">Look directly at the camera</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-base-content/70">Remove sunglasses or hats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelfieCapture

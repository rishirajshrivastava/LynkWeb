import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from '../utils/constants';
import BasicInfoStep from './signupSteps/BasicInfoStep';
import PhysicalAttributesStep from './signupSteps/PhysicalAttributesStep';
import PersonalDetailsStep from './signupSteps/PersonalDetailsStep';
import LocationLifestyleStep from './signupSteps/LocationLifestyleStep';
import RelationshipDatingStep from './signupSteps/RelationshipDatingStep';
import ProfileContentStep from './signupSteps/ProfileContentStep';

const MultiStepSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    interestedIn: ["everyone"],
    
    // Step 2: Physical Attributes
    height: "",
    weight: "",
    bodyType: "",
    ethnicity: "",
    
    // Step 3: Personal Details
    religion: "",
    politicalViews: "",
    phoneNumber: "",
    zodiacSign: "",
    
    // Step 4: Location & Lifestyle
    location: {
      city: "",
      state: "",
      country: ""
    },
    occupation: "",
    education: "",
    income: "",
    smoking: "",
    drinking: "",
    exercise: "",
    diet: "",
    
    // Step 5: Relationship & Dating
    relationshipStatus: "",
    lookingFor: [],
    hasKids: "",
    wantsKids: "",
    
    // Step 6: Profile Content
    about: "",
    interests: [],
    hobbies: [],
    languages: [],
    photoUrl: []
  });

  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAgeConfirmation, setShowAgeConfirmation] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState(null);
  const [errorStep, setErrorStep] = useState(null); // Track which step has the error
  const [showErrorFlash, setShowErrorFlash] = useState(false); // Track error flash visibility
  const navigate = useNavigate();

  const totalSteps = 6;

  // Clear error when navigating away from the error step
  useEffect(() => {
    if (errorStep && currentStep !== errorStep) {
      setError("");
      setErrorDetails("");
      setErrorStep(null);
      setShowErrorFlash(false);
    }
  }, [currentStep, errorStep]);

  // Show error flash when error occurs
  useEffect(() => {
    if (error) {
      setShowErrorFlash(true);
      // Auto-hide flash after 5 seconds
      const timer = setTimeout(() => {
        setShowErrorFlash(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Map error types to specific steps
  const getErrorStep = (errorMessage) => {
    if (errorMessage.includes('email') || errorMessage.includes('Email')) {
      return 1; // Basic Info Step (email field)
    }
    if (errorMessage.includes('phone') || errorMessage.includes('Phone')) {
      return 3; // Personal Details Step (phone field)
    }
    // Default to step 1 for most errors
    return 1;
  };

  // Check if all required fields are filled for quick signup
  const isFormComplete = () => {
    return (
      formData.firstName.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword &&
      formData.gender &&
      formData.dateOfBirth &&
      formData.interestedIn.length > 0 &&
      formData.height &&
      formData.weight &&
      formData.phoneNumber &&
      formData.location.city &&
      formData.location.state &&
      formData.location.country &&
      formData.occupation &&
      formData.education &&
      formData.smoking &&
      formData.drinking &&
      formData.exercise &&
      formData.diet &&
      formData.relationshipStatus &&
      formData.lookingFor.length > 0 &&
      formData.hasKids &&
      formData.wantsKids
    );
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    return monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      const fieldName = name.replace('[]', '');
      setFormData(prev => ({
        ...prev,
        [fieldName]: checked 
          ? [...(prev[fieldName] || []), value]
          : (prev[fieldName] || []).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateStep = (step) => {
    setError("");
    setErrorDetails("");

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          setError("First name is required");
          return false;
        }
        if (!formData.email.trim()) {
          setError("Email is required");
          return false;
        }
        if (!formData.password) {
          setError("Password is required");
          return false;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (!formData.gender) {
          setError("Gender is required");
          return false;
        }
        if (!formData.dateOfBirth) {
          setError("Date of birth is required");
          return false;
        }
        // Validate age from date of birth
        if (formData.dateOfBirth) {
          const today = new Date();
          const birthDate = new Date(formData.dateOfBirth);
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
          
          if (actualAge < 18) {
            setError("You must be at least 18 years old");
            return false;
          }
          if (actualAge > 100) {
            setError("Please enter a valid date of birth");
            return false;
          }
        }
        if (!formData.interestedIn || formData.interestedIn.length === 0) {
          setError("Please select who you're interested in");
          return false;
        }
        return true;
      
      case 2:
        if (!formData.height) {
          setError("Height is required");
          return false;
        }
        if (!formData.weight) {
          setError("Weight is required");
          return false;
        }
        return true;
      
      case 3:
        if (!formData.phoneNumber) {
          setError("Phone number is required");
          return false;
        }
        return true;
      
      case 4:
        if (!formData.location.city) {
          setError("City is required");
          return false;
        }
        if (!formData.location.state) {
          setError("State/Province is required");
          return false;
        }
        if (!formData.location.country) {
          setError("Country is required");
          return false;
        }
        if (!formData.occupation) {
          setError("Occupation is required");
          return false;
        }
        if (!formData.education) {
          setError("Education level is required");
          return false;
        }
        if (!formData.smoking) {
          setError("Please select your smoking preference");
          return false;
        }
        if (!formData.drinking) {
          setError("Please select your drinking preference");
          return false;
        }
        if (!formData.exercise) {
          setError("Please select your exercise frequency");
          return false;
        }
        if (!formData.diet) {
          setError("Please select your diet preference");
          return false;
        }
        return true;
      
      case 5:
        if (!formData.relationshipStatus) {
          setError("Relationship status is required");
          return false;
        }
        if (!formData.lookingFor || formData.lookingFor.length === 0) {
          setError("Please select what you're looking for");
          return false;
        }
        if (!formData.hasKids) {
          setError("Please select if you have kids");
          return false;
        }
        if (!formData.wantsKids) {
          setError("Please select if you want kids");
          return false;
        }
        return true;
      
      case 6:
        // Profile content is optional, so always return true
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Show age confirmation popup for step 1 (Basic Information)
      if (currentStep === 1 && formData.dateOfBirth) {
        const age = calculateAge(formData.dateOfBirth);
        setCalculatedAge(age);
        setShowAgeConfirmation(true);
      } else {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        // Only scroll to top if the next step is empty (step 6 is optional)
        const nextStepNum = Math.min(currentStep + 1, totalSteps);
        if (nextStepNum === 6) {
          // Step 6 is optional, so don't scroll to top
          return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const confirmAgeAndProceed = () => {
    setShowAgeConfirmation(false);
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    // Only scroll to top if the next step is not empty (step 6 is optional)
    const nextStepNum = Math.min(currentStep + 1, totalSteps);
    if (nextStepNum !== 6) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cancelAgeConfirmation = () => {
    setShowAgeConfirmation(false);
    setCalculatedAge(null);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    // Don't scroll to top when going to previous step
  };

  const handleSignup = async () => {
    try {
      if (!validateStep(currentStep)) return;
      
      setError("");
      setErrorDetails("");
      setLoading(true);
      
      // Calculate age from date of birth
      let age = undefined;
      if (formData.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(formData.dateOfBirth);
        const ageCalc = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        age = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? ageCalc - 1 : ageCalc;
      }

      // Prepare data for API
      const signupData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        age: age,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender,
        interestedIn: formData.interestedIn,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
        bodyType: formData.bodyType || undefined,
        ethnicity: formData.ethnicity || undefined,
        religion: formData.religion || undefined,
        politicalViews: formData.politicalViews || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        zodiacSign: formData.zodiacSign || undefined,
        location: Object.values(formData.location).some(val => val.trim()) ? formData.location : undefined,
        occupation: formData.occupation || undefined,
        education: formData.education || undefined,
        income: formData.income || undefined,
        smoking: formData.smoking || undefined,
        drinking: formData.drinking || undefined,
        exercise: formData.exercise || undefined,
        diet: formData.diet || undefined,
        relationshipStatus: formData.relationshipStatus || undefined,
        lookingFor: formData.lookingFor.length > 0 ? formData.lookingFor : undefined,
        hasKids: formData.hasKids || undefined,
        wantsKids: formData.wantsKids || undefined,
        about: formData.about || undefined,
        interests: formData.interests.length > 0 ? formData.interests : undefined,
        hobbies: formData.hobbies.length > 0 ? formData.hobbies : undefined,
        languages: formData.languages.length > 0 ? formData.languages : undefined,
        photoUrl: formData.photoUrl.length > 0 ? formData.photoUrl : []
      };

      const res = await axios.post(
        BASE_URL + "/signup",
        signupData,
        { withCredentials: true }
      );
      
      navigate("/login", { 
        state: { message: "Account created successfully! Please sign in." }
      });
    } catch (err) {
      console.log("An error occurred while signing up: ", err.response?.data);
      
      if (err.response?.data?.error) {
        const errorMessage = err.response.data.error;
        
        if (errorMessage.includes('E11000 duplicate key error')) {
          const fieldMatch = errorMessage.match(/index: (\w+)_\d+ dup key: \{ (\w+): "([^"]+)" \}/);
          if (fieldMatch) {
            const [, indexName, fieldName, fieldValue] = fieldMatch;
            const fieldDisplayName = fieldName === 'email' ? 'Email' : 
                                   fieldName === 'phone' ? 'Phone' : 
                                   fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            
            setError(`${fieldDisplayName} already exists`);
            setErrorDetails(`The ${fieldDisplayName.toLowerCase()} is already registered. Please use a different ${fieldDisplayName.toLowerCase()} or sign in.`);
            
            // Redirect to the appropriate step based on the error
            const stepToRedirect = getErrorStep(fieldDisplayName);
            setErrorStep(stepToRedirect);
            setCurrentStep(stepToRedirect);
          } else {
            setError("Duplicate entry found");
            setErrorDetails("This information already exists in our system. Please use different details.");
            setErrorStep(1);
            setCurrentStep(1);
          }
        } else {
          setError(errorMessage);
          setErrorDetails(err.response.data.details || "");
          
          // Redirect to appropriate step based on error message
          const stepToRedirect = getErrorStep(errorMessage);
          setErrorStep(stepToRedirect);
          setCurrentStep(stepToRedirect);
        }
      } else {
        setError("Something went wrong. Please try again.");
        setErrorDetails("");
        setErrorStep(1);
        setCurrentStep(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep 
          formData={formData} 
          handleInputChange={handleInputChange} 
          showPassword={showPassword} 
          setShowPassword={setShowPassword} 
          showConfirmPassword={showConfirmPassword} 
          setShowConfirmPassword={setShowConfirmPassword}
          error={error}
          errorDetails={errorDetails}
        />;
      case 2:
        return <PhysicalAttributesStep formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <PersonalDetailsStep formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <LocationLifestyleStep formData={formData} handleInputChange={handleInputChange} />;
      case 5:
        return <RelationshipDatingStep formData={formData} handleInputChange={handleInputChange} />;
      case 6:
        return <ProfileContentStep formData={formData} handleInputChange={handleInputChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-3 sm:px-4 pt-20 pb-24">
      <div className="card bg-base-100 w-full max-w-2xl shadow-xl rounded-2xl">
        <div className="card-body p-5 sm:p-6">
          
          {/* Error Flash Notification */}
          {showErrorFlash && error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                  {errorDetails && (
                    <div className="text-red-600 text-xs mt-1">{errorDetails}</div>
                  )}
                </div>
                <button
                  onClick={() => setShowErrorFlash(false)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-3xl font-extrabold text-primary">Lynk 💕🔗</span>
            <p className="text-sm text-base-content/70 mt-2">Create your account - Step {currentStep} of {totalSteps}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-base-300 rounded-full h-2 mt-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === totalSteps) {
                handleSignup();
              } else {
                nextStep();
              }
            }}
          >
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {/* Quick Signup Button - Show when form is complete and not on last step */}
                {isFormComplete() && currentStep < totalSteps && (
                  <button
                    type="button"
                    onClick={handleSignup}
                    disabled={loading}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Sign Up Now"}
                  </button>
                )}
                
                <button
                  type="submit"
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : currentStep === totalSteps ? "Create Account" : "Next"}
                </button>
              </div>
            </div>
          </form>

          {/* Error Message - Only show for steps other than step 1 */}
          {error && !loading && currentStep !== 1 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
                {errorDetails && (
                  <div className="ml-6 text-red-600 text-xs">{errorDetails}</div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-base-content/70 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Age Confirmation Modal */}
      {showAgeConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg p-4 max-w-sm w-full shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 mb-3">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-base-content mb-2">
                Confirm Your Age
              </h3>
              <p className="text-sm text-base-content/70 mb-3">
                You are <strong className="text-primary">{calculatedAge} years old</strong>.
              </p>
              <p className="text-xs text-base-content/60 mb-4">
                Must be 18+ to continue.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={cancelAgeConfirmation}
                  className="btn btn-sm btn-outline flex-1"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmAgeAndProceed}
                  className="btn btn-sm btn-primary flex-1"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepSignup;

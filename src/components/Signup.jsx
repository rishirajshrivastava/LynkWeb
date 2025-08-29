import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from '../utils/constants';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    about: "",
    skills: ""
  });
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showFullSkills, setShowFullSkills] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      setErrorDetails("");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      setErrorDetails("");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      setErrorDetails("");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      setErrorDetails("");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setErrorDetails("");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setErrorDetails("");
      return false;
    }
    if (formData.age && (formData.age < 18 || formData.age > 100)) {
      setError("You must be atleast 18 or older to register");
      setErrorDetails("");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    try {
      if (!validateForm()) return;
      
      setError("");
      setErrorDetails("");
      setLoading(true);
      
      const signupData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        about: formData.about.trim() || undefined,
        skills: formData.skills.trim() ? formData.skills.split(',').map(s => s.trim()) : undefined
      };

      const res = await axios.post(
        BASE_URL + "/signup",
        signupData,
        { withCredentials: true }
      );
      
      // Redirect to login page after successful signup
      navigate("/login", { 
        state: { message: "Account created successfully! Please sign in." }
      });
         } catch (err) {
       console.log("An error occurred while signing up: ", err.response?.data);
       
                         // Check if it's a validation error from the API
         if (err.response?.data?.error) {
           const errorMessage = err.response.data.error;
           
           // Handle MongoDB duplicate key errors elegantly
           if (errorMessage.includes('E11000 duplicate key error')) {
             const fieldMatch = errorMessage.match(/index: (\w+)_\d+ dup key: \{ (\w+): "([^"]+)" \}/);
             if (fieldMatch) {
               const [, indexName, fieldName, fieldValue] = fieldMatch;
               const fieldDisplayName = fieldName === 'email' ? 'Email' : 
                                      fieldName === 'phone' ? 'Phone' : 
                                      fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
               
               setError(`${fieldDisplayName} already exists`);
               setErrorDetails(`The ${fieldDisplayName.toLowerCase()}  is already registered. Please use a different ${fieldDisplayName.toLowerCase()} or sign in.`);
             } else {
               setError("Duplicate entry found");
               setErrorDetails("This information already exists in our system. Please use different details.");
             }
           } else {
             setError(errorMessage);
             setErrorDetails(err.response.data.details || "");
           }
         }
         else {
           setError("Something went wrong. Please try again.");
           setErrorDetails("");
         }
     } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-3 sm:px-4 pt-20 pb-24">
      <div className="card bg-base-100 w-full max-w-md sm:max-w-lg shadow-xl rounded-2xl">
        <div className="card-body p-5 sm:p-6">
          {/* Logo / App Name */}
          <div className="text-center mb-6">
            <span className="text-3xl font-extrabold text-primary">Lynk 💕🔗</span>
            <p className="text-sm text-base-content/70 mt-2">Create your account to get started</p>
          </div>

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label pb-1.5" htmlFor="firstName">
                  <span className="label-text font-medium text-sm">First Name *</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  placeholder="John"
                  className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label pb-1.5" htmlFor="lastName">
                  <span className="label-text font-medium text-sm">Last Name *</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  placeholder="Doe"
                  className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label pb-1.5" htmlFor="email">
                <span className="label-text font-medium text-sm">Email *</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label pb-1.5" htmlFor="password">
                  <span className="label-text font-medium text-sm">Password *</span>
                </label>
                <div className="relative">
                                     <input
                     id="password"
                     name="password"
                     type={showPassword ? "text" : "password"}
                     value={formData.password}
                     placeholder="••••••••"
                     className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm pr-12"
                     onChange={handleInputChange}
                     required
                     autoComplete="new-password"
                     spellCheck="false"
                   />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.842-4.42M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.129.995-.356 1.414M15.88 15.88A3 3 0 0112 15c-1.657 0-3-1.343-3-3 0-.512.129-.995.356-1.414M3 3l18 18" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label pb-1.5" htmlFor="confirmPassword">
                  <span className="label-text font-medium text-sm">Confirm Password *</span>
                </label>
                <div className="relative">
                                     <input
                     id="confirmPassword"
                     name="confirmPassword"
                     type={showConfirmPassword ? "text" : "password"}
                     value={formData.confirmPassword}
                     placeholder="••••••••"
                     className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm pr-12"
                     onChange={handleInputChange}
                     required
                     autoComplete="new-password"
                     spellCheck="false"
                   />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showConfirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.842-4.42M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.129.995-.356 1.414M15.88 15.88A3 3 0 0112 15c-1.657 0-3-1.343-3-3 0-.512.129-.995.356-1.414M3 3l18 18" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label pb-1.5" htmlFor="age">
                  <span className="label-text font-medium text-sm">Age</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  placeholder="25"
                  className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                  onChange={handleInputChange}
                />
                <label className="label pt-1">
                  <span className="label-text-alt text-base-content/60 text-xs">⚠️ Age cannot be changed after account creation</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label pb-1.5" htmlFor="gender">
                  <span className="label-text font-medium text-sm">Gender</span>
                </label>
                                 <select
                   id="gender"
                   name="gender"
                   value={formData.gender}
                   className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
                   onChange={handleInputChange}
                 >
                   <option value="" className="bg-base-100 text-base-content">Select gender</option>
                   <option value="male" className="bg-base-100 text-base-content">Male</option>
                   <option value="female" className="bg-base-100 text-base-content">Female</option>
                   <option value="other" className="bg-base-100 text-base-content">Other</option>
                   <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
                 </select>
              </div>
            </div>

            {/* About */}
            <div className="form-control">
              <label className="label pb-1.5" htmlFor="about">
                <span className="label-text font-medium text-sm">About Me</span>
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                placeholder="Tell us a bit about yourself..."
                rows="2"
                className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm resize-none"
                onChange={handleInputChange}
              />
              {formData.about && formData.about.length > 100 && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowFullAbout(!showFullAbout)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    {showFullAbout ? "Show less" : "Show more"}
                  </button>
                  <div className={`mt-1 text-xs text-base-content/60 ${showFullAbout ? '' : 'line-clamp-2'}`}>
                    {formData.about}
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="form-control">
              <label className="label pb-1.5" htmlFor="skills">
                <span className="label-text font-medium text-sm">Skills & Interests</span>
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                placeholder="e.g., Reading, Travel, Music, Cooking"
                className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
                onChange={handleInputChange}
              />
              <label className="label pt-1">
                <span className="label-text-alt text-base-content/60 text-xs">Separate multiple skills with commas</span>
              </label>
              {formData.skills && formData.skills.length > 80 && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowFullSkills(!showFullSkills)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    {showFullSkills ? "Show less" : "Show more"}
                  </button>
                  <div className={`mt-1 text-xs text-base-content/60 ${showFullSkills ? '' : 'line-clamp-1'}`}>
                    {formData.skills}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6 py-2.5 text-sm font-medium"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Loading OR Error Message */}
          {loading && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-pulse">
              <div className="flex items-center space-x-2 text-blue-700 text-sm font-medium">
                <svg
                  className="w-4 h-4 animate-spin text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Creating your account...</span>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
                {errorDetails && (
                  <div className="ml-6 text-red-600 text-xs">
                    {errorDetails}
                  </div>
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
    </div>
  );
};

export default Signup;

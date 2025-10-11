import DatePicker from './DatePicker';

const BasicInfoStep = ({ 
  formData, 
  handleInputChange, 
  showPassword, 
  setShowPassword, 
  showConfirmPassword, 
  setShowConfirmPassword,
  error,
  errorDetails
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">Basic Information</h2>
      
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
            <span className="label-text font-medium text-sm">Last Name</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            placeholder="Doe"
            className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
            onChange={handleInputChange}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Date of Birth and Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="form-control">
          <label className="label pb-1.5" htmlFor="dateOfBirth">
            <span className="label-text font-medium text-sm">Date of Birth *</span>
          </label>
          <DatePicker
            value={formData.dateOfBirth}
            onChange={(value) => handleInputChange({ target: { name: 'dateOfBirth', value } })}
            placeholder="Select your date of birth"
          />
          <label className="label pt-1">
            <span className="label-text-alt text-base-content/60 text-xs">⚠️ Date of birth cannot be changed after account creation</span>
          </label>
        </div>

        <div className="form-control">
          <label className="label pb-1.5" htmlFor="gender">
            <span className="label-text font-medium text-sm">Gender *</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
            onChange={handleInputChange}
            required
          >
            <option value="" className="bg-base-100 text-base-content">Select gender</option>
            <option value="male" className="bg-base-100 text-base-content">Male</option>
            <option value="female" className="bg-base-100 text-base-content">Female</option>
            <option value="non-binary" className="bg-base-100 text-base-content">Non-binary</option>
            <option value="other" className="bg-base-100 text-base-content">Other</option>
            <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
          </select>
        </div>
      </div>


      {/* Interested In */}
      <div className="form-control">
        <label className="label pb-1.5">
          <span className="label-text font-medium text-sm">Interested In *</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {["male", "female", "non-binary", "other", "everyone"].map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="interestedIn[]"
                value={option}
                checked={formData.interestedIn.includes(option)}
                onChange={handleInputChange}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="text-sm capitalize">{option}</span>
            </label>
          ))}
        </div>
      </div>


      {/* Error Display */}
      {error && (
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
    </div>
  );
};

export default BasicInfoStep;

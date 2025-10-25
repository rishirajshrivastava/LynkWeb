import { useState, useEffect } from 'react';

const LocationLifestyleStep = ({ formData, handleInputChange }) => {
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [locationDetected, setLocationDetected] = useState(false);

  // Function to get location from coordinates
  const getLocationFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      if (data.city && data.principalSubdivision && data.countryName) {
        return {
          city: data.city,
          state: data.principalSubdivision,
          country: data.countryName
        };
      }
      throw new Error('Unable to get location details');
    } catch (error) {
      console.error('Error getting location details:', error);
      throw error;
    }
  };

  // Function to detect user location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData = await getLocationFromCoords(latitude, longitude);
          
          // Update form data with detected location
          handleInputChange({
            target: {
              name: 'location.city',
              value: locationData.city
            }
          });
          handleInputChange({
            target: {
              name: 'location.state',
              value: locationData.state
            }
          });
          handleInputChange({
            target: {
              name: 'location.country',
              value: locationData.country
            }
          });
          
          setLocationDetected(true);
          setLocationError('');
        } catch (error) {
          setLocationError('Failed to get location details. Please enter manually.');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Location access denied. Please enter manually.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access or enter manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please enter manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please enter manually.';
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Auto-detect location on component mount
  useEffect(() => {
    if (!formData.location.city && !formData.location.state && !formData.location.country) {
      detectLocation();
    } else {
      setLocationDetected(true);
    }
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">Location & Lifestyle</h2>
      
      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-base-content">Location</h3>
          {!locationDetected && (
            <button
              type="button"
              onClick={detectLocation}
              disabled={locationLoading}
              className="btn btn-sm btn-outline btn-primary"
            >
              {locationLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Detecting...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Detect Location
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Location Success Message */}
        {locationDetected && !locationError && (
          <div className="alert alert-success">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Location detected successfully! Your location has been automatically filled.</span>
          </div>
        )}
        
        {/* Location Error Message */}
        {locationError && (
          <div className="alert alert-warning">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm">{locationError}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="form-control">
            <label className="label pb-1.5" htmlFor="location.city">
              <span className="label-text font-medium text-sm">City *</span>
              {locationDetected && (
                <span className="label-text-alt text-success text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Auto-detected
                </span>
              )}
            </label>
            <input
              id="location.city"
              name="location.city"
              type="text"
              value={formData.location.city}
              placeholder="New York"
              className={`w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm ${
                locationDetected ? 'bg-success/10 border-success/30' : ''
              }`}
              onChange={handleInputChange}
              disabled={locationDetected}
            />
          </div>

          <div className="form-control">
            <label className="label pb-1.5" htmlFor="location.state">
              <span className="label-text font-medium text-sm">State/Province *</span>
              {locationDetected && (
                <span className="label-text-alt text-success text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Auto-detected
                </span>
              )}
            </label>
            <input
              id="location.state"
              name="location.state"
              type="text"
              value={formData.location.state}
              placeholder="NY"
              className={`w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm ${
                locationDetected ? 'bg-success/10 border-success/30' : ''
              }`}
              onChange={handleInputChange}
              disabled={locationDetected}
            />
          </div>

          <div className="form-control">
            <label className="label pb-1.5" htmlFor="location.country">
              <span className="label-text font-medium text-sm">Country *</span>
              {locationDetected && (
                <span className="label-text-alt text-success text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Auto-detected
                </span>
              )}
            </label>
            <input
              id="location.country"
              name="location.country"
              type="text"
              value={formData.location.country}
              placeholder="United States"
              className={`w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm ${
                locationDetected ? 'bg-success/10 border-success/30' : ''
              }`}
              onChange={handleInputChange}
              disabled={locationDetected}
            />
          </div>
        </div>
      </div>

      {/* Occupation and Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="form-control">
          <label className="label pb-1.5" htmlFor="occupation">
            <span className="label-text font-medium text-sm">Occupation *</span>
          </label>
          <input
            id="occupation"
            name="occupation"
            type="text"
            value={formData.occupation}
            placeholder="Software Engineer"
            className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
            onChange={handleInputChange}
          />
        </div>

        <div className="form-control">
          <label className="label pb-1.5" htmlFor="education">
            <span className="label-text font-medium text-sm">Education *</span>
          </label>
          <select
            id="education"
            name="education"
            value={formData.education}
            className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
            onChange={handleInputChange}
          >
            <option value="" className="bg-base-100 text-base-content">Select education level</option>
            <option value="none" className="bg-base-100 text-base-content">No formal education</option>
            <option value="school" className="bg-base-100 text-base-content">High School</option>
            <option value="undergraduate" className="bg-base-100 text-base-content">Undergraduate</option>
            <option value="postgraduate" className="bg-base-100 text-base-content">Postgraduate</option>
            <option value="doctorate" className="bg-base-100 text-base-content">Doctorate</option>
            <option value="other" className="bg-base-100 text-base-content">Other</option>
          </select>
        </div>
      </div>

      {/* Income */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="income">
          <span className="label-text font-medium text-sm">Annual Income</span>
        </label>
        <select
          id="income"
          name="income"
          value={formData.income}
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
          onChange={handleInputChange}
        >
          <option value="" className="bg-base-100 text-base-content">Select income range</option>
          <option value="under-30k" className="bg-base-100 text-base-content">Under ₹30,000</option>
          <option value="30k-50k" className="bg-base-100 text-base-content">₹30,000 - ₹50,000</option>
          <option value="50k-75k" className="bg-base-100 text-base-content">₹50,000 - ₹75,000</option>
          <option value="75k-100k" className="bg-base-100 text-base-content">₹75,000 - ₹100,000</option>
          <option value="above-100k" className="bg-base-100 text-base-content">Above ₹100,000</option>
          <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
        </select>
      </div>

      {/* Lifestyle Habits */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-base-content">Lifestyle Habits</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label pb-1.5" htmlFor="smoking">
              <span className="label-text font-medium text-sm">Smoking *</span>
            </label>
            <select
              id="smoking"
              name="smoking"
              value={formData.smoking}
              className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
              onChange={handleInputChange}
            >
              <option value="" className="bg-base-100 text-base-content">Select smoking preference</option>
              <option value="never" className="bg-base-100 text-base-content">Never</option>
              <option value="occasionally" className="bg-base-100 text-base-content">Occasionally</option>
              <option value="regularly" className="bg-base-100 text-base-content">Regularly</option>
              <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label pb-1.5" htmlFor="drinking">
              <span className="label-text font-medium text-sm">Drinking *</span>
            </label>
            <select
              id="drinking"
              name="drinking"
              value={formData.drinking}
              className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
              onChange={handleInputChange}
            >
              <option value="" className="bg-base-100 text-base-content">Select drinking preference</option>
              <option value="never" className="bg-base-100 text-base-content">Never</option>
              <option value="occasionally" className="bg-base-100 text-base-content">Occasionally</option>
              <option value="regularly" className="bg-base-100 text-base-content">Regularly</option>
              <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label pb-1.5" htmlFor="exercise">
              <span className="label-text font-medium text-sm">Exercise *</span>
            </label>
            <select
              id="exercise"
              name="exercise"
              value={formData.exercise}
              className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
              onChange={handleInputChange}
            >
              <option value="" className="bg-base-100 text-base-content">Select exercise frequency</option>
              <option value="never" className="bg-base-100 text-base-content">Never</option>
              <option value="occasionally" className="bg-base-100 text-base-content">Occasionally</option>
              <option value="regularly" className="bg-base-100 text-base-content">Regularly</option>
              <option value="daily" className="bg-base-100 text-base-content">Daily</option>
              <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label pb-1.5" htmlFor="diet">
              <span className="label-text font-medium text-sm">Diet *</span>
            </label>
            <select
              id="diet"
              name="diet"
              value={formData.diet}
              className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
              onChange={handleInputChange}
            >
              <option value="" className="bg-base-100 text-base-content">Select diet preference</option>
              <option value="omnivore" className="bg-base-100 text-base-content">Non-Vegetarian</option>
              <option value="vegetarian" className="bg-base-100 text-base-content">Vegetarian</option>
              <option value="vegan" className="bg-base-100 text-base-content">Vegan</option>
              <option value="pescatarian" className="bg-base-100 text-base-content">Eggetarian</option>
              <option value="other" className="bg-base-100 text-base-content">Other</option>
              <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-base-content/60 mt-4">
        <p>💡 Lifestyle information helps match you with people who share similar values and habits.</p>
      </div>
    </div>
  );
};

export default LocationLifestyleStep;

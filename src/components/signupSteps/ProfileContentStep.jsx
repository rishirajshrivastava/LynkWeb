import { useState } from 'react';

const ProfileContentStep = ({ formData, handleInputChange, onHobbiesValidationChange }) => {
  const [hobbiesInput, setHobbiesInput] = useState(formData.hobbies.join(', '));
  const [languagesInput, setLanguagesInput] = useState(formData.languages.join(', '));
  const [hobbiesError, setHobbiesError] = useState('');
  const [languagesError, setLanguagesError] = useState('');
  const handleArrayInput = (name, value) => {
    // Process the array immediately
    let items;
    if (name === 'languages') {
      // For languages, split by both comma and space, then flatten
      const commaSplit = value.split(',').map(item => item.trim());
      items = commaSplit.flatMap(item => item.split(' ')).map(item => item.trim()).filter(item => item);
    } else {
      // For hobbies, use comma separator
      items = value.split(',').map(item => item.trim()).filter(item => item);
    }
    
    // Validate array length based on field
    const maxItems = name === 'hobbies' ? 8 : 20; // Removed languages limit
    if (items.length > maxItems) {
      if (name === 'hobbies') {
        setHobbiesError(`Maximum ${maxItems} hobbies allowed`);
        // Notify parent component about validation state
        if (onHobbiesValidationChange) {
          onHobbiesValidationChange(false);
        }
      } else if (name === 'languages') {
        setLanguagesError(`Maximum ${maxItems} languages allowed`);
      }
      return;
    }
    
    // Clear error if validation passes
    if (name === 'hobbies') {
      setHobbiesError('');
      // Notify parent component about validation state
      if (onHobbiesValidationChange) {
        onHobbiesValidationChange(true);
      }
    } else if (name === 'languages') {
      setLanguagesError('');
    }
    
    handleInputChange({
      target: {
        name,
        value: items
      }
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">Profile Content</h2>
      
      {/* About Me */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="about">
          <span className="label-text font-medium text-sm">About Me</span>
        </label>
        <textarea
          id="about"
          name="about"
          value={formData.about}
          placeholder="Tell us a bit about yourself, your interests, what you're looking for in a partner..."
          rows="4"
          maxLength="500"
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm resize-none"
          onChange={handleInputChange}
        />
        <label className="label pt-1">
          <span className="label-text-alt text-base-content/60 text-xs">
            {formData.about.length}/500 characters
          </span>
        </label>
      </div>

      {/* Hobbies */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="hobbies">
          <span className="label-text font-medium text-sm">Hobbies</span>
          <span className="label-text-alt text-primary text-xs">
            {formData.hobbies.length}/8
          </span>
        </label>
        <input
          id="hobbies"
          name="hobbies"
          type="text"
          value={hobbiesInput}
          placeholder="e.g., Playing guitar, Painting, Yoga, Gaming"
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
          onChange={(e) => {
            setHobbiesInput(e.target.value);
            handleArrayInput('hobbies', e.target.value);
          }}
        />
        <label className="label pt-1">
          <span className="label-text-alt text-base-content/60 text-xs">
            💡 Separate multiple hobbies with commas (max 8, e.g., "Guitar, Painting, Yoga")
          </span>
        </label>
        
        {/* Error Message */}
        {hobbiesError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-700 text-sm">{hobbiesError}</span>
            </div>
          </div>
        )}
        
        {formData.hobbies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {formData.hobbies.map((hobby, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
              >
                {hobby}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="languages">
          <span className="label-text font-medium text-sm">Languages</span>
        </label>
        <input
          id="languages"
          name="languages"
          type="text"
          value={languagesInput}
          placeholder="e.g., English, Spanish, French, Mandarin"
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
          onChange={(e) => {
            setLanguagesInput(e.target.value);
            handleArrayInput('languages', e.target.value);
          }}
        />
        <label className="label pt-1">
          <span className="label-text-alt text-base-content/60 text-xs">
            💡 Separate multiple languages with commas or spaces (e.g., "English, Spanish, French" or "English Spanish French")
          </span>
        </label>
        
        {/* Error Message */}
        {languagesError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-700 text-sm">{languagesError}</span>
            </div>
          </div>
        )}
        
        {formData.languages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {formData.languages.map((language, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs"
              >
                {language}
              </span>
            ))}
          </div>
        )}
      </div>      

      <div className="text-sm text-base-content/60 mt-4">
        <p>💡 A complete profile with photos and detailed information gets 3x more matches!</p>
      </div>
    </div>
  );
};

export default ProfileContentStep;

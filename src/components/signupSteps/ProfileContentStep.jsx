const ProfileContentStep = ({ formData, handleInputChange }) => {
  const handleArrayInput = (name, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
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

      {/* Interests */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="interests">
          <span className="label-text font-medium text-sm">Interests</span>
        </label>
        <input
          id="interests"
          name="interests"
          type="text"
          value={formData.interests.join(', ')}
          placeholder="e.g., Photography, Hiking, Cooking, Reading, Travel"
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
          onChange={(e) => handleArrayInput('interests', e.target.value)}
        />
        <label className="label pt-1">
          <span className="label-text-alt text-base-content/60 text-xs">
            Separate multiple interests with commas (max 20)
          </span>
        </label>
      </div>

      {/* Hobbies */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="hobbies">
          <span className="label-text font-medium text-sm">Hobbies</span>
        </label>
        <input
          id="hobbies"
          name="hobbies"
          type="text"
          value={formData.hobbies.join(', ')}
          placeholder="e.g., Playing guitar, Painting, Yoga, Gaming"
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
          onChange={(e) => handleArrayInput('hobbies', e.target.value)}
        />
        <label className="label pt-1">
          <span className="label-text-alt text-base-content/60 text-xs">
            Separate multiple hobbies with commas (max 15)
          </span>
        </label>
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
          value={formData.languages.join(', ')}
          placeholder="e.g., English, Spanish, French, Mandarin"
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
          onChange={(e) => handleArrayInput('languages', e.target.value)}
        />
        <label className="label pt-1">
          <span className="label-text-alt text-base-content/60 text-xs">
            Separate multiple languages with commas (max 10)
          </span>
        </label>
      </div>


      {/* Summary */}
      <div className="bg-base-200 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-medium text-base-content mb-2">Profile Summary</h3>
        <div className="text-sm text-base-content/70 space-y-1">
          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
          <p><strong>Age:</strong> {formData.age || 'Not specified'}</p>
          <p><strong>Gender:</strong> {formData.gender || 'Not specified'}</p>
          <p><strong>Location:</strong> {formData.location.city ? `${formData.location.city}, ${formData.location.state || formData.location.country}` : 'Not specified'}</p>
          <p><strong>Interests:</strong> {formData.interests.length > 0 ? formData.interests.join(', ') : 'None specified'}</p>
        </div>
      </div>

      <div className="text-sm text-base-content/60 mt-4">
        <p>💡 A complete profile with photos and detailed information gets 3x more matches!</p>
      </div>
    </div>
  );
};

export default ProfileContentStep;

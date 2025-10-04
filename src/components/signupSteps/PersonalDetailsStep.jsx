const PersonalDetailsStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">Personal Details</h2>
      
      {/* Phone Number */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="phoneNumber">
          <span className="label-text font-medium text-sm">Phone Number *</span>
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          placeholder="+1 (555) 123-4567"
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
          onChange={handleInputChange}
        />
        <label className="label pt-1">
          <span className="label-text-alt text-base-content/60 text-xs">Used for account verification and security</span>
        </label>
      </div>

      {/* Religion */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="religion">
          <span className="label-text font-medium text-sm">Religion</span>
        </label>
        <select
          id="religion"
          name="religion"
          value={formData.religion}
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
          onChange={handleInputChange}
        >
          <option value="" className="bg-base-100 text-base-content">Select religion</option>
          <option value="christian" className="bg-base-100 text-base-content">Christian</option>
          <option value="muslim" className="bg-base-100 text-base-content">Muslim</option>
          <option value="hindu" className="bg-base-100 text-base-content">Hindu</option>
          <option value="buddhist" className="bg-base-100 text-base-content">Buddhist</option>
          <option value="jewish" className="bg-base-100 text-base-content">Jewish</option>
          <option value="sikh" className="bg-base-100 text-base-content">Sikh</option>
          <option value="atheist" className="bg-base-100 text-base-content">Atheist</option>
          <option value="agnostic" className="bg-base-100 text-base-content">Agnostic</option>
          <option value="spiritual" className="bg-base-100 text-base-content">Spiritual</option>
          <option value="other" className="bg-base-100 text-base-content">Other</option>
          <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
        </select>
      </div>

      {/* Political Views */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="politicalViews">
          <span className="label-text font-medium text-sm">Political Views</span>
        </label>
        <select
          id="politicalViews"
          name="politicalViews"
          value={formData.politicalViews}
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
          onChange={handleInputChange}
        >
          <option value="" className="bg-base-100 text-base-content">Select political views</option>
          <option value="very-liberal" className="bg-base-100 text-base-content">Very Liberal</option>
          <option value="liberal" className="bg-base-100 text-base-content">Liberal</option>
          <option value="moderate" className="bg-base-100 text-base-content">Moderate</option>
          <option value="conservative" className="bg-base-100 text-base-content">Conservative</option>
          <option value="very-conservative" className="bg-base-100 text-base-content">Very Conservative</option>
          <option value="other" className="bg-base-100 text-base-content">Other</option>
          <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
        </select>
      </div>

      {/* Zodiac Sign */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="zodiacSign">
          <span className="label-text font-medium text-sm">Zodiac Sign</span>
        </label>
        <select
          id="zodiacSign"
          name="zodiacSign"
          value={formData.zodiacSign}
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
          onChange={handleInputChange}
        >
          <option value="" className="bg-base-100 text-base-content">Select zodiac sign</option>
          <option value="aries" className="bg-base-100 text-base-content">Aries</option>
          <option value="taurus" className="bg-base-100 text-base-content">Taurus</option>
          <option value="gemini" className="bg-base-100 text-base-content">Gemini</option>
          <option value="cancer" className="bg-base-100 text-base-content">Cancer</option>
          <option value="leo" className="bg-base-100 text-base-content">Leo</option>
          <option value="virgo" className="bg-base-100 text-base-content">Virgo</option>
          <option value="libra" className="bg-base-100 text-base-content">Libra</option>
          <option value="scorpio" className="bg-base-100 text-base-content">Scorpio</option>
          <option value="sagittarius" className="bg-base-100 text-base-content">Sagittarius</option>
          <option value="capricorn" className="bg-base-100 text-base-content">Capricorn</option>
          <option value="aquarius" className="bg-base-100 text-base-content">Aquarius</option>
          <option value="pisces" className="bg-base-100 text-base-content">Pisces</option>
          <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
        </select>
      </div>

      <div className="text-sm text-base-content/60 mt-4">
        <p>💡 Personal details help others understand you better and find compatible matches.</p>
      </div>
    </div>
  );
};

export default PersonalDetailsStep;

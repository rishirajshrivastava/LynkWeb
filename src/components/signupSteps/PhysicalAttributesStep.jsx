const PhysicalAttributesStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">Physical Attributes</h2>
      
      {/* Height and Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="form-control">
          <label className="label pb-1.5" htmlFor="height">
            <span className="label-text font-medium text-sm">Height (cm) *</span>
          </label>
          <input
            id="height"
            name="height"
            type="number"
            value={formData.height}
            placeholder="175"
            min="100"
            max="250"
            className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
            onChange={handleInputChange}
          />
        </div>

        <div className="form-control">
          <label className="label pb-1.5" htmlFor="weight">
            <span className="label-text font-medium text-sm">Weight (kg) *</span>
          </label>
          <input
            id="weight"
            name="weight"
            type="number"
            value={formData.weight}
            placeholder="70"
            min="30"
            max="200"
            className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Body Type */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="bodyType">
          <span className="label-text font-medium text-sm">Body Type</span>
        </label>
        <select
          id="bodyType"
          name="bodyType"
          value={formData.bodyType}
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
          onChange={handleInputChange}
        >
          <option value="" className="bg-base-100 text-base-content">Select body type</option>
          <option value="slim" className="bg-base-100 text-base-content">Slim</option>
          <option value="athletic" className="bg-base-100 text-base-content">Athletic</option>
          <option value="average" className="bg-base-100 text-base-content">Average</option>
          <option value="curvy" className="bg-base-100 text-base-content">Curvy</option>
          <option value="plus-size" className="bg-base-100 text-base-content">Plus-size</option>
          <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
        </select>
      </div>

      {/* Ethnicity */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="ethnicity">
          <span className="label-text font-medium text-sm">Ethnicity</span>
        </label>
        <select
          id="ethnicity"
          name="ethnicity"
          value={formData.ethnicity}
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
          onChange={handleInputChange}
        >
          <option value="" className="bg-base-100 text-base-content">Select ethnicity</option>
          <option value="asian" className="bg-base-100 text-base-content">Asian</option>
          <option value="black" className="bg-base-100 text-base-content">Black</option>
          <option value="hispanic" className="bg-base-100 text-base-content">Hispanic</option>
          <option value="middle-eastern" className="bg-base-100 text-base-content">Middle Eastern</option>
          <option value="native-american" className="bg-base-100 text-base-content">Native American</option>
          <option value="pacific-islander" className="bg-base-100 text-base-content">Pacific Islander</option>
          <option value="white" className="bg-base-100 text-base-content">White</option>
          <option value="mixed-race" className="bg-base-100 text-base-content">Mixed Race</option>
          <option value="other" className="bg-base-100 text-base-content">Other</option>
          <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
        </select>
      </div>

      <div className="text-sm text-base-content/60 mt-4">
        <p>💡 All physical attributes are optional and can be updated later in your profile settings.</p>
      </div>
    </div>
  );
};

export default PhysicalAttributesStep;

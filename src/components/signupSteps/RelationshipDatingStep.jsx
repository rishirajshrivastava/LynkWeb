const RelationshipDatingStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">Relationship & Dating</h2>
      
      {/* Relationship Status */}
      <div className="form-control">
        <label className="label pb-1.5" htmlFor="relationshipStatus">
          <span className="label-text font-medium text-sm">Relationship Status *</span>
        </label>
        <select
          id="relationshipStatus"
          name="relationshipStatus"
          value={formData.relationshipStatus}
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
          onChange={handleInputChange}
        >
          <option value="" className="bg-base-100 text-base-content">Select relationship status</option>
          <option value="single" className="bg-base-100 text-base-content">Single</option>
          <option value="dating" className="bg-base-100 text-base-content">Dating</option>
          <option value="in-a-relationship" className="bg-base-100 text-base-content">In a relationship</option>
          <option value="engaged" className="bg-base-100 text-base-content">Engaged</option>
          <option value="married" className="bg-base-100 text-base-content">Married</option>
          <option value="divorced" className="bg-base-100 text-base-content">Divorced</option>
          <option value="separated" className="bg-base-100 text-base-content">Separated</option>
          <option value="widowed" className="bg-base-100 text-base-content">Widowed</option>
          <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
        </select>
      </div>

      {/* Looking For */}
      <div className="form-control">
        <label className="label pb-1.5">
          <span className="label-text font-medium text-sm">What are you looking for? *</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { value: "casual-dating", label: "Casual Dating" },
            { value: "serious-relationship", label: "Serious Relationship" },
            { value: "marriage", label: "Marriage" },
            { value: "friendship", label: "Friendship" },
            { value: "hookup", label: "Hook-up" },
            { value: "not-sure", label: "Not Sure" }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="lookingFor[]"
                value={option.value}
                checked={formData.lookingFor.includes(option.value)}
                onChange={handleInputChange}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Kids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="form-control">
          <label className="label pb-1.5" htmlFor="hasKids">
            <span className="label-text font-medium text-sm">Do you have kids? *</span>
          </label>
          <select
            id="hasKids"
            name="hasKids"
            value={formData.hasKids}
            className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
            onChange={handleInputChange}
          >
            <option value="" className="bg-base-100 text-base-content">Select option</option>
            <option value="no" className="bg-base-100 text-base-content">No</option>
            <option value="yes-living-with-me" className="bg-base-100 text-base-content">Yes, living with me</option>
            <option value="yes-not-living-with-me" className="bg-base-100 text-base-content">Yes, not living with me</option>
            <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label pb-1.5" htmlFor="wantsKids">
            <span className="label-text font-medium text-sm">Do you want kids? *</span>
          </label>
          <select
            id="wantsKids"
            name="wantsKids"
            value={formData.wantsKids}
            className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm bg-transparent text-base-content"
            onChange={handleInputChange}
          >
            <option value="" className="bg-base-100 text-base-content">Select option</option>
            <option value="no" className="bg-base-100 text-base-content">No</option>
            <option value="yes" className="bg-base-100 text-base-content">Yes</option>
            <option value="maybe" className="bg-base-100 text-base-content">Maybe</option>
            <option value="prefer-not-to-say" className="bg-base-100 text-base-content">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-base-content/60 mt-4">
        <p>💡 This information helps us match you with people who have compatible relationship goals.</p>
      </div>
    </div>
  );
};

export default RelationshipDatingStep;

const LocationLifestyleStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">Location & Lifestyle</h2>
      
      {/* Location */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-base-content">Location</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="form-control">
            <label className="label pb-1.5" htmlFor="location.city">
              <span className="label-text font-medium text-sm">City *</span>
            </label>
            <input
              id="location.city"
              name="location.city"
              type="text"
              value={formData.location.city}
              placeholder="New York"
              className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control">
            <label className="label pb-1.5" htmlFor="location.state">
              <span className="label-text font-medium text-sm">State/Province *</span>
            </label>
            <input
              id="location.state"
              name="location.state"
              type="text"
              value={formData.location.state}
              placeholder="NY"
              className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control">
            <label className="label pb-1.5" htmlFor="location.country">
              <span className="label-text font-medium text-sm">Country *</span>
            </label>
            <input
              id="location.country"
              name="location.country"
              type="text"
              value={formData.location.country}
              placeholder="United States"
              className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm"
              onChange={handleInputChange}
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
          <option value="under-30k" className="bg-base-100 text-base-content">Under $30,000</option>
          <option value="30k-50k" className="bg-base-100 text-base-content">$30,000 - $50,000</option>
          <option value="50k-75k" className="bg-base-100 text-base-content">$50,000 - $75,000</option>
          <option value="75k-100k" className="bg-base-100 text-base-content">$75,000 - $100,000</option>
          <option value="above-100k" className="bg-base-100 text-base-content">Above $100,000</option>
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
              <option value="omnivore" className="bg-base-100 text-base-content">Omnivore</option>
              <option value="vegetarian" className="bg-base-100 text-base-content">Vegetarian</option>
              <option value="vegan" className="bg-base-100 text-base-content">Vegan</option>
              <option value="pescatarian" className="bg-base-100 text-base-content">Pescatarian</option>
              <option value="keto" className="bg-base-100 text-base-content">Keto</option>
              <option value="paleo" className="bg-base-100 text-base-content">Paleo</option>
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

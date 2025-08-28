import { useNavigate } from "react-router-dom";

const NoRequests = () => {
  const navigate = useNavigate();

  const handleExploreUsers = () => {
    navigate('/feed');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="pt-24 pb-28 px-4 flex justify-center">
      <div className="w-full max-w-2xl mx-auto">
        {/* Ultra Compact Empty State Container */}
        <div className="bg-base-200 rounded-xl shadow-md border border-base-300/50 overflow-hidden">
          {/* Header Section - Ultra Compact */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-4 py-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-base-content mb-1">
              No Pending Requests
            </h1>
            <p className="text-xs sm:text-sm text-base-content/70 max-w-md mx-auto">
              You're all caught up! No connection requests waiting for review.
            </p>
          </div>

          {/* Content Section - Ultra Compact */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* What This Means - Ultra Compact */}
              <div className="bg-base-100 rounded-lg p-3 border border-base-300/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-base-content">What This Means</h3>
                </div>
                <p className="text-base-content/80 text-xs leading-relaxed">
                  You've reviewed all incoming requests. New ones will appear here when users want to connect.
                </p>
              </div>

              {/* What Happens Next - Ultra Compact */}
              <div className="bg-base-100 rounded-lg p-3 border border-base-300/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-info/10 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-base-content">What Happens Next</h3>
                </div>
                <p className="text-base-content/80 text-xs leading-relaxed">
                  When new requests arrive, you'll review profiles and decide to accept or decline.
                </p>
              </div>
            </div>

            {/* Action Section - Ultra Compact */}
            <div className="text-center">
              <div className="bg-base-100 rounded-lg p-3 border border-base-300/20">
                <h3 className="text-sm font-semibold text-base-content mb-1">
                  While You Wait
                </h3>
                <p className="text-base-content/70 text-xs mb-3">
                  Explore users, update your profile, or discover new connections.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button 
                    onClick={handleExploreUsers}
                    className="btn btn-primary btn-xs sm:btn-sm"
                  >
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explore Users
                  </button>
                                     <button 
                     onClick={handleViewProfile}
                     className="btn btn-secondary btn-xs sm:btn-sm"
                   >
                     <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                     Edit My Profile
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoRequests;

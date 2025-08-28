import { Link } from "react-router-dom";

const NoMoreUsers = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="pt-24 pb-28 px-4 flex justify-center">
      <div className="w-full max-w-2xl mx-auto">
        {/* Sober Empty State Container */}
        <div className="bg-base-200 rounded-xl shadow-md border border-base-300/50 overflow-hidden">
          {/* Header Section - Clean and Simple */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-4 py-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-base-content mb-1">
              You're all caught up! ✨
            </h1>
            <p className="text-xs sm:text-sm text-base-content/70 max-w-md mx-auto">
              Great job! You've seen all the available profiles. Check back later for new matches.
            </p>
          </div>

          {/* Content Section - Clean and Organized */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* What This Means - Clean */}
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
                  You've explored all available profiles. New ones will appear here when users join the platform.
                </p>
              </div>

              {/* What Happens Next - Clean */}
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
                  When new profiles arrive, you'll be able to discover and connect with them.
                </p>
              </div>
            </div>

            {/* Action Section - Clean and Simple */}
            <div className="text-center">
              <div className="bg-base-100 rounded-lg p-3 border border-base-300/20">
                <h3 className="text-sm font-semibold text-base-content mb-1">
                  While You Wait
                </h3>
                <p className="text-base-content/70 text-xs mb-3">
                  Take this time to perfect your profile or discover new connections.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link 
                    to="/profile"
                    className="btn btn-primary btn-xs sm:btn-sm"
                  >
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Edit My Profile
                  </Link>
                  <button 
                    onClick={handleRefresh}
                    className="btn btn-secondary btn-xs sm:btn-sm"
                  >
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Feed
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

export default NoMoreUsers;

import { useNavigate } from "react-router-dom";

const NoConnections = () => {
  const navigate = useNavigate();

  const handleExploreFeed = () => {
    navigate('/feed');
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="pt-24 pb-28 px-4 flex justify-center">
      <div className="w-full max-w-2xl mx-auto">
        {/* Beautiful Empty State Container */}
        <div className="bg-base-200 rounded-xl shadow-md border border-base-300/50 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-4 py-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-base-content mb-1">
              No Connections Yet
            </h1>
            <p className="text-xs sm:text-sm text-base-content/70 max-w-md mx-auto">
              You haven't made any connections yet. Start building your network!
            </p>
          </div>

          {/* Content Section */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* How to Connect */}
              <div className="bg-base-100 rounded-lg p-3 border border-base-300/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-base-content">How to Connect</h3>
                </div>
                <p className="text-base-content/80 text-xs leading-relaxed">
                  Browse profiles in the feed and send connection requests to people you're interested in.
                </p>
              </div>

              {/* What Happens Next */}
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
                  When someone accepts your request, they'll appear here as a connection.
                </p>
              </div>
            </div>

            {/* Action Section */}
            <div className="text-center">
              <div className="bg-base-100 rounded-lg p-3 border border-base-300/20">
                <h3 className="text-sm font-semibold text-base-content mb-1">
                  Ready to Start?
                </h3>
                <p className="text-base-content/70 text-xs mb-3">
                  Explore profiles and start building meaningful connections.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button 
                    onClick={handleExploreFeed}
                    className="btn btn-primary btn-xs sm:btn-sm"
                  >
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explore Feed
                  </button>
                  <button 
                    onClick={handleEditProfile}
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

export default NoConnections;

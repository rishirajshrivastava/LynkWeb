import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Check, X } from "lucide-react";

// Custom scrollbar styles
const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const Notifications = ({ onNotificationDismiss, isDropdown = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Reset current profile index when notifications change
  useEffect(() => {
    setCurrentProfileIndex(0);
  }, [notifications]);

  // Inject custom scrollbar styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = scrollbarStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/reminders/pending`, {
        withCredentials: true
      });
      
      if (response.data.data && response.data.data.length > 0) {
        setNotifications(response.data.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      // Here you can add logic to mark notification as reviewed
      // For now, just remove it from the list
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      // Notify parent component to refresh notifications
      if (onNotificationDismiss) {
        onNotificationDismiss();
      }
    } catch (err) {
      console.error("Error handling notification:", err);
    }
  };

  if (loading) {
    return (
      <div className={`${isDropdown ? 'p-4' : 'p-4 pt-16'} text-center`}>
        <div className={`${isDropdown ? 'loading-md' : 'loading-lg'} loading loading-spinner text-primary`}></div>
        <h2 className={`${isDropdown ? 'text-base' : 'text-lg'} font-semibold mt-3 mb-2`}>
          {isDropdown ? 'Loading...' : 'Loading Notifications'}
        </h2>
        <p className={`${isDropdown ? 'text-sm' : 'text-sm'} text-base-content/70`}>
          {isDropdown ? 'Loading notifications...' : 'Fetching your pending reminders and notifications...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isDropdown ? 'p-4' : 'p-4 pt-16'} text-center`}>
        <div className={`${isDropdown ? 'text-4xl' : 'text-5xl'} mb-3 text-error/60`}>⚠️</div>
        <h2 className={`${isDropdown ? 'text-base' : 'text-lg'} font-semibold text-error mb-2`}>
          {isDropdown ? 'Error' : 'Failed to Load Notifications'}
        </h2>
        <p className={`${isDropdown ? 'text-sm' : 'text-sm'} text-base-content/70 mb-3`}>
          {error}
        </p>
        <button 
          onClick={fetchNotifications}
          className={`${isDropdown ? 'btn-sm' : 'btn-xs'} btn btn-error btn-outline`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={`${isDropdown ? 'p-4' : 'p-4 pt-16'} text-center`}>
        <div className={`${isDropdown ? 'text-4xl' : 'text-5xl'} mb-3 text-primary/60`}>🔔</div>
        <h2 className={`${isDropdown ? 'text-lg' : 'text-xl'} font-bold text-base-content mb-2`}>
          {isDropdown ? 'No New Notifications' : 'All Caught Up!'}
        </h2>
        <p className={`${isDropdown ? 'text-sm' : 'text-sm'} text-base-content/70 mb-3`}>
          {isDropdown ? 'You\'re all caught up!' : 'You have no pending reminders or notifications at the moment.'}
        </p>
        
        {!isDropdown && (
          <>
            <div className="max-w-sm mx-auto mb-4 p-3 bg-base-200/50 rounded-lg border border-base-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-xs">💡</span>
                </div>
                <span className="font-medium text-xs">What happens here?</span>
              </div>
              <p className="text-xs text-base-content/70 text-left">
                When you have pending connection requests that need your review, they'll appear here as notifications. 
                You can review profiles and decide whether to accept or decline connection requests.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link 
                to="/feed" 
                className="btn btn-primary btn-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Browse Feed
              </Link>
              <Link 
                to="/connections" 
                className="btn btn-outline btn-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View Connections
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  // Sort notifications by updated time (most recent first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    const dateA = new Date(a.updatedAt || 0);
    const dateB = new Date(b.updatedAt || 0);
    return dateB - dateA;
  });

  // For standalone page, show one profile at a time
  const currentProfile = sortedNotifications[currentProfileIndex];

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Here you can add logic to mark notification as read
      // For now, just remove it from the list
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      // Notify parent component to refresh notifications
      if (onNotificationDismiss) {
        onNotificationDismiss();
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleNextProfile = () => {
    if (currentProfileIndex < sortedNotifications.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    }
  };

  const handlePreviousProfile = () => {
    if (currentProfileIndex > 0) {
      setCurrentProfileIndex(currentProfileIndex - 1);
    }
  };

  if (isDropdown) {
    // Dropdown mode - show compact list
    return (
      <div className="w-80 max-h-96 overflow-y-auto">
        <div className="p-3 border-b border-base-300">
          <h3 className="text-base font-semibold">Pending Reminders</h3>
          <p className="text-xs text-base-content/70">
            {notifications.length} pending reminder{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="divide-y divide-base-200">
          {sortedNotifications.map((notification) => (
            <div 
              key={notification._id}
              className="p-3 hover:bg-base-200/50 cursor-pointer transition-colors"
              onClick={() => handleNotificationClick(notification._id)}
            >
              <div className="flex items-start gap-3">
                <div className="avatar flex-shrink-0">
                  <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                    {notification.photoUrl ? (
                      <img 
                        src={notification.photoUrl} 
                        alt={`${notification.firstName} ${notification.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {notification.firstName ? notification.firstName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {notification.firstName} {notification.lastName}
                    </span>
                    <span className="text-xs text-base-content/50">
                      {notification.age} • {notification.gender}
                    </span>
                  </div>
                  
                  {notification.about && (
                    <p className="text-xs text-base-content/70 line-clamp-2 mb-2">
                      {notification.about}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-base-content/50">
                      Reminder pending
                    </span>
                    <span className="text-xs text-base-content/50">
                      {new Date(notification.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-base-300 text-center">
            <Link 
              to="/requestReview" 
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              View all requests →
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Standalone page mode - show one profile at a time
  return (
    <div className="w-full max-w-4xl mx-auto p-4 pt-16">
      {/* Header - Only show when no notifications */}
      {notifications.length === 0 && (
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-primary mb-2">🔔 Notifications</h1>
          <p className="text-sm text-base-content/70 mb-3">
            Manage your pending reminders and connection requests
          </p>
        </div>
      )}

      {/* Show count when there are notifications */}
      {notifications.length > 0 && (
        <div className="text-center mb-4">
          <div className="bg-base-200/50 rounded-lg p-3 border border-base-300">
            <h2 className="text-lg font-semibold mb-1">Pending Reminders</h2>
            <p className="text-sm text-base-content/70">
              You have <span className="font-bold text-primary">{notifications.length}</span> pending reminder{notifications.length !== 1 ? 's' : ''} to review
            </p>
          </div>
        </div>
      )}

      {/* Profile Container */}
      {currentProfile ? (
        <div className="bg-base-300 rounded-xl shadow-lg border border-base-200 p-4">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">
              Profile {currentProfileIndex + 1} of {sortedNotifications.length}
            </h3>
            <span className="text-xs text-base-content/70">
              Review Requested on: {new Date(currentProfile.updatedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>

          {/* Profile Card */}
          <div className="w-full bg-base-200 rounded-lg shadow-md border border-base-300 flex flex-col sm:flex-row">
            {/* Profile Photo */}
            <div className="w-full sm:w-1/3 h-28 sm:h-32 flex items-center justify-center bg-base-300 rounded-l-lg sm:rounded-l-lg sm:rounded-r-none">
              {currentProfile.photoUrl ? (
                <img
                  src={currentProfile.photoUrl}
                  alt={`${currentProfile.firstName} ${currentProfile.lastName}`}
                  className="w-full h-full object-cover rounded-l-lg sm:rounded-l-lg sm:rounded-r-none"
                  style={{ objectPosition: 'center' }}
                />
              ) : (
                <span className="text-xs text-base-content/50">
                  No photo
                </span>
              )}
            </div>

            {/* Profile Details */}
            <div className="w-full sm:w-2/3 p-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-base-content">
                  {currentProfile.firstName} {currentProfile.lastName}
                  {currentProfile.age && (
                    <span className="ml-2 text-xs font-medium text-base-content/70">
                      {currentProfile.age}
                    </span>
                  )}
                </h2>
                {currentProfile.gender && (
                  <p className="text-xs text-base-content/70">
                    {currentProfile.gender}
                  </p>
                )}

                {currentProfile.about && (
                  <div>
                    <h3 className="text-xs font-medium text-success mb-1">
                      About
                    </h3>
                    <div className="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
                      <p className="text-xs text-base-content/80 break-words whitespace-pre-wrap leading-relaxed pr-2">
                        {currentProfile.about}
                      </p>
                    </div>
                  </div>
                )}

                {currentProfile.skills && currentProfile.skills.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-info mb-1">
                      Skills
                    </h3>
                    <div className="max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
                      <div className="flex flex-wrap gap-1 pr-2">
                        {currentProfile.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-base-300 text-base-content/80 text-xs rounded-md whitespace-nowrap"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex flex-wrap gap-1.5 justify-end">
                <button
                  onClick={() => handleMarkAsRead(currentProfile._id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/80 text-white text-xs font-medium shadow-sm hover:bg-blue-500 hover:ring-2 hover:ring-blue-400 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark as Read
                </button>
                <button
                  onClick={() => handleNotificationClick(currentProfile._id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-600/80 text-white text-xs font-medium shadow-sm hover:bg-green-500 hover:ring-2 hover:ring-green-400 transition-all duration-200"
                >
                  <Check size={12} />
                  Accept
                </button>
                <button
                  onClick={() => handleNotificationClick(currentProfile._id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/80 text-white text-xs font-medium shadow-sm hover:bg-red-500 hover:ring-2 hover:ring-red-400 transition-all duration-200"
                >
                  <X size={12} />
                  Reject
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousProfile}
              disabled={currentProfileIndex === 0}
              className={`btn btn-outline btn-xs ${currentProfileIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <span className="text-xs text-base-content/70">
              {currentProfileIndex + 1} of {sortedNotifications.length}
            </span>

            <button
              onClick={handleNextProfile}
              disabled={currentProfileIndex === sortedNotifications.length - 1}
              className={`btn btn-outline btn-xs ${currentProfileIndex === sortedNotifications.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-base-content/70">No profiles to display</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;

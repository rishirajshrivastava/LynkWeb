import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { addRequests } from "../utils/requestsSlice";
import {BASE_URL} from '../utils/constants'
import Notifications from "./Notifications";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch notifications and requests
  useEffect(() => {
    if (user && user.verificationStatus?.isVerified) {
      fetchNotifications();
      fetchRequests();
    }
  }, [user]);

  // Refetch notifications and requests when user navigates to different pages
  useEffect(() => {
    if (user && user.verificationStatus?.isVerified) {
      fetchNotifications();
      fetchRequests();
    }
  }, [location.pathname, user]);

  // Listen for notification and request updates from other components
  useEffect(() => {
    const handleNotificationUpdate = () => {
      if (user && user.verificationStatus?.isVerified) {
        fetchNotifications();
        fetchRequests();
      }
    };

    // Listen for custom event when notifications are updated
    window.addEventListener('notificationUpdated', handleNotificationUpdate);
    
    return () => {
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reminders/pending`, {
        withCredentials: true
      });
      
      if (response.data.data && response.data.data.length > 0) {
        setNotifications(response.data.data);
        setHasNotifications(true);
      } else {
        setNotifications([]);
        setHasNotifications(false);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
      setHasNotifications(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/requests/recieved`, {
        withCredentials: true,
      });
      dispatch(addRequests(response.data.data));
    } catch (error) {
      console.log("Error fetching requests:", error);
    }
  };

  const handleNotificationDismiss = () => {
    // Refresh notifications after one is dismissed
    fetchNotifications();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-toggle-btn')) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      dispatch(removeFeed());
      setShowLogoutConfirm(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.log("An error occurred while logging out: ", err);
      // Ensure client-side logout UX even if server request fails
      dispatch(removeUser());
      dispatch(removeFeed());
      setShowLogoutConfirm(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <div className={`navbar bg-base-300/95 backdrop-blur-sm shadow-lg border-b border-base-200/50 fixed top-0 z-10 w-full ${showLogoutConfirm ? 'blur-sm pointer-events-none' : ''}`}>
        {/* Left: Brand + Mobile toggle */}
        <div className="flex-1">
          <div className="flex items-center">
            <button
              className="mobile-toggle-btn btn btn-ghost btn-square sm:hidden ml-1 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="mx-2 sm:mx-4 whitespace-nowrap flex-shrink-0">
              <div className="flex items-center cursor-pointer group">
                <span className="text-xl sm:text-2xl font-bold text-primary tracking-wide group-hover:text-primary/80 transition-colors duration-300">
                  Lynk
                </span>
                <span className="ml-2 flex items-center gap-1">
                  <span className="text-lg sm:text-xl"></span>
                  <span className="text-lg sm:text-xl">🔗</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center navigation links (desktop) */}
        {user && user.verificationStatus?.isVerified && (
          <div className="hidden sm:flex items-center gap-1 lg:gap-2">
            <Link 
              to={"/feed"} 
              className={`btn btn-ghost btn-sm normal-case text-base-content hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 rounded-lg px-2 sm:px-3 lg:px-4 py-2 transition-all duration-200 ${
                location.pathname === "/feed" ? "bg-primary/10 text-primary border-primary/20" : ""
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="hidden xl:inline">Feed</span>
              <span className="hidden lg:inline xl:hidden">Feed</span>
              <span className="lg:hidden">Feed</span>
            </Link>
            <Link 
              to={"/connections"} 
              className={`btn btn-ghost btn-sm normal-case text-base-content hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 rounded-lg px-2 sm:px-3 lg:px-4 py-2 transition-all duration-200 ${
                location.pathname === "/connections" ? "bg-primary/10 text-primary border-primary/20" : ""
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden xl:inline">My Connections</span>
              <span className="xl:hidden">Connections</span>
            </Link>
            <Link 
              to={"/requestReview"} 
              className={`btn btn-ghost btn-sm normal-case text-base-content hover:bg-secondary/10 hover:text-secondary border border-transparent hover:border-secondary/20 rounded-lg px-2 sm:px-3 lg:px-4 py-2 transition-all duration-200 relative ${
                location.pathname === "/requestReview" ? "bg-secondary/10 text-secondary border-secondary/20" : ""
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden xl:inline">Pending Requests</span>
              <span className="hidden lg:inline xl:hidden">Requests</span>
              <span className="lg:hidden">Requests</span>
              {/* Pending requests badge - only show when there are requests */}
              {requests && Array.isArray(requests) && requests.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {requests.length> 99 ? '99+' : requests.length}
                </div>
              )}
            </Link>

          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 mr-1 sm:mr-2 lg:mr-4">
          {/* Theme toggle - always visible */}
          <button
            className="btn btn-ghost btn-sm normal-case px-2 sm:px-3 lg:px-3 py-2 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 rounded-lg transition-all duration-200 items-center gap-1 sm:gap-2"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {/* Theme toggle for small screens when user is logged out */}
          {false && (
            <button
              className="md:hidden btn btn-ghost btn-sm normal-case px-2 py-2 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 rounded-lg transition-all duration-200"
              aria-label="Toggle dark mode"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
          
          {/* Alerts Icon - Always visible on navbar like theme icon */}
          {user && user.verificationStatus?.isVerified && (
            <Link
              to="/notifications"
              className={`btn btn-ghost btn-sm normal-case px-2 sm:px-3 py-2 hover:bg-secondary/10 hover:text-secondary border border-transparent hover:border-secondary/20 rounded-lg transition-all duration-200 relative ${
                location.pathname === "/notifications" ? "bg-secondary/10 text-secondary border-secondary/20" : ""
              }`}
              title="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification badge - only show when there are notifications */}
              {hasNotifications && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </Link>
          )}
          
            {/* User Profile Dropdown */}
           {user && user.verificationStatus?.isVerified && (
             <div className="dropdown dropdown-end">
               <div
                 tabIndex={0}
                 role="button"
                 className="flex items-center cursor-pointer bg-base-200 hover:bg-base-100 rounded-lg px-2 sm:px-3 py-2 transition-all duration-200 border border-base-300 hover:border-primary/30 active:scale-95"
               >
                {/* Avatar only - no username */}
                <div className="avatar flex-shrink-0">
                  <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-200 overflow-hidden">
                    {user.photoUrl ? (
                      <img 
                        src={user.photoUrl[0]} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-primary/20 rounded-full flex items-center justify-center ${user.photoUrl ? 'hidden' : 'flex'}`}>
                      <span className="text-primary font-semibold text-sm">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 w-52 p-2 shadow-xl bg-base-100 rounded-box border border-base-300 z-50 min-w-max"
              >

                 {/* Saved Profiles - Hidden on small screens */}
                 <li className="hidden sm:block">
                  <Link 
                    to={"/savedLikedProfiles"} 
                    className={`justify-between ${location.pathname === "/savedLikedProfiles" ? "active" : ""}`} 
                    onClick={() => document.activeElement && document.activeElement.blur()}
                  >
                    <div className="flex items-center gap-2">
                      <span>Saved Profiles</span>
                      <span>✨</span>
                    </div>
                  </Link>
                </li>
                

                
                <li>
                  <Link 
                    to={"/profile"} 
                    className={`justify-between ${location.pathname === "/profile" ? "active" : ""}`} 
                    onClick={() => document.activeElement && document.activeElement.blur()}
                  >
                    My Profile
                  </Link>
                </li>
                
                
                <li>
                  <button
                    onClick={() => {
                      document.activeElement && document.activeElement.blur();
                      setShowLogoutConfirm(true);
                    }}
                  >
                    Logout
                  </button>
                </li>

                {/* <li>
                  <Link 
                    to={"/settings"} 
                    className={`justify-between ${location.pathname === "/settings" ? "active" : ""}`} 
                    onClick={() => document.activeElement && document.activeElement.blur()}
                  >
                    <div className="flex items-center gap-2">
                      <span>Settings ⚙️</span>
                    </div>
                  </Link>
                </li> */}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {user && user.verificationStatus?.isVerified && (
        <div className={`mobile-menu-container sm:hidden fixed top-16 left-0 z-50 transition-all duration-300 ease-in-out ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
          <div className="ml-1 sm:ml-2">
            <div className="w-56 xs:w-64 sm:w-72 rounded-xl shadow-2xl border border-base-300/50 bg-base-100 overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto">
              <nav className="flex flex-col bg-base-100">
                <Link onClick={() => setMobileOpen(false)} to={"/feed"} className={`px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border-l-4 border-l-transparent hover:border-l-primary transition-all bg-base-100/95 flex items-center ${
                  location.pathname === "/feed" ? "bg-primary/10 text-primary border-l-primary" : ""
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="truncate">Feed</span>
                </Link>
                <Link onClick={() => setMobileOpen(false)} to={"/connections"} className={`px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border-l-4 border-l-transparent hover:border-l-primary transition-all bg-base-100/95 flex items-center ${
                  location.pathname === "/connections" ? "bg-primary/10 text-primary border-l-primary" : ""
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="truncate">My Connections</span>
                </Link>
                <Link onClick={() => setMobileOpen(false)} to={"/requestReview"} className={`px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hover:bg-secondary/10 hover:text-secondary border-l-4 border-l-transparent hover:border-l-secondary transition-all bg-base-100/95 flex items-center relative ${
                  location.pathname === "/requestReview" ? "bg-secondary/10 text-secondary border-l-secondary" : ""
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate">Pending Requests</span>
                  {/* Pending requests badge - only show when there are requests */}
                  {requests && Array.isArray(requests) && requests.length > 0 && (
                    <div className="ml-auto w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {requests.length}
                    </div>
                  )}
                </Link>

                {/* Saved Profiles - Only visible on small screens */}
                <Link onClick={() => setMobileOpen(false)} to={"/savedLikedProfiles"} className={`px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary border-l-4 border-l-transparent hover:border-l-primary transition-all bg-base-100/95 flex items-center ${
                  location.pathname === "/savedLikedProfiles" ? "bg-primary/10 text-primary border-l-primary" : ""
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="truncate">Saved Profiles ✨</span>
                </Link>

              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 pointer-events-auto p-2 sm:p-4">
          <div className="bg-base-200 text-base-content rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-3 sm:p-5 text-center animate-fade-in">
            <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Confirm Logout</h2>
            <p className="text-xs sm:text-sm opacity-80 mb-3 sm:mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
              <button
                onClick={handleLogout}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-sm hover:from-red-600 hover:to-red-700 transition-all text-xs sm:text-sm"
              >
                Yes, Log out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700 transition-all text-xs sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

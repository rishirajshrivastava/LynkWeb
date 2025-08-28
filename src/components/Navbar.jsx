import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import {BASE_URL} from '../utils/constants'

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    console.log("Logging out user...");
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
      <div className="navbar bg-base-300 shadow-sm fixed top-0 z-10 w-full">
        {/* Left: Brand + Mobile toggle */}
        <div className="flex-1">
          <div className="flex items-center">
            <button
              className="btn btn-ghost btn-square sm:hidden ml-1"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to={"/feed"} className="text-xl font-bold mx-4 text-primary hover:text-primary-focus transition-colors">
              Lynk 💕🔗
            </Link>
          </div>
        </div>

        {/* Center navigation links (desktop) */}
        {user && (
          <div className="hidden sm:flex items-center gap-2">
            <Link 
              to={"/connections"} 
              className="btn btn-ghost btn-sm normal-case text-base-content hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 rounded-lg px-3 sm:px-4 py-2 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden lg:inline">My Connections</span>
              <span className="lg:hidden">Connections</span>
            </Link>
            <Link 
              to={"/requestReview"} 
              className="btn btn-ghost btn-sm normal-case text-base-content hover:bg-secondary/10 hover:text-secondary border border-transparent hover:border-secondary/20 rounded-lg px-3 sm:px-4 py-2 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden lg:inline">Pending Requests</span>
              <span className="lg:hidden">Requests</span>
            </Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3 mr-2 sm:mr-4">
          {user && (
            <div className="dropdown dropdown-end">
              {/* Username + Avatar */}
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 sm:gap-3 cursor-pointer bg-base-200 hover:bg-base-100 rounded-lg px-2 sm:px-3 py-2 transition-all duration-200 border border-base-300 hover:border-primary/30"
              >
                <span className="hidden sm:block text-sm font-medium text-base-content/80">
                  Welcome,
                  <span className="ml-1 text-base-content font-semibold">{user.firstName}</span>
                </span>

                <div className="avatar">
                  <div className="w-8 sm:w-9 md:w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user.photoUrl} alt="User Avatar" />
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 w-52 p-2 shadow bg-base-100 rounded-box border border-base-300"
              >
                <li>
                  <Link to={"/profile"} className="justify-between" onClick={() => document.activeElement && document.activeElement.blur()}>
                    Profile
                  </Link>
                </li>
                {/* Theme toggle inside user menu */}
                <li>
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-sm">Dark mode</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm"
                      checked={theme === "dark"}
                      onClick={() => document.activeElement && document.activeElement.blur()}
                      onChange={(e) => {
                        const next = e.target.checked ? "dark" : "light";
                        setTheme(next);
                      }}
                    />
                  </div>
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
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {user && (
        <div className={`sm:hidden fixed top-14 left-0 right-0 z-[9] transition-all ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="mx-3 rounded-xl shadow-lg border border-base-300 bg-base-100 overflow-hidden">
            <nav className="flex flex-col">
              <Link onClick={() => setMobileOpen(false)} to={"/connections"} className="px-4 py-3 text-sm hover:bg-primary/10 hover:text-primary border-l-4 border-l-transparent hover:border-l-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                My Connections
              </Link>
              <Link onClick={() => setMobileOpen(false)} to={"/requestReview"} className="px-4 py-3 text-sm hover:bg-secondary/10 hover:text-secondary border-l-4 border-l-transparent hover:border-l-secondary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Pending Requests
              </Link>
              <Link onClick={() => setMobileOpen(false)} to={"/profile"} className="px-4 py-3 text-sm hover:bg-base-200 border-l-4 border-l-transparent hover:border-l-base-content/30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              <div className="px-4 py-3 flex items-center justify-between border-t border-base-200">
                <span className="text-sm">Dark mode</span>
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={theme === "dark"}
                  onChange={(e) => {
                    setTheme(e.target.checked ? "dark" : "light");
                    setMobileOpen(false);
                  }}
                />
              </div>
              <button onClick={() => { setMobileOpen(false); setShowLogoutConfirm(true); }} className="px-4 py-3 text-left text-sm hover:bg-error/10 hover:text-error border-l-4 border-l-transparent hover:border-l-error transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-base-200 text-base-content rounded-xl shadow-xl w-80 p-5 text-center animate-fade-in">
            <h2 className="text-lg font-semibold mb-3">Confirm Logout</h2>
            <p className="text-sm opacity-80 mb-5">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-sm hover:from-red-600 hover:to-red-700 transition-all"
              >
                Yes, Log out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700 transition-all"
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

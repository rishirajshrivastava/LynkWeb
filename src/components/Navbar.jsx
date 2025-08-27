import { useState } from "react";
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
      if (
        res.data.message === "User logged out successfully" &&
        res.status === 200
      ) {
        setShowLogoutConfirm(false);
        navigate("/login");
      }
    } catch (err) {
      console.log("An error occurred while logging out: ", err);
    }
  };

  return (
    <>
      <div className="navbar bg-base-300 shadow-sm fixed top-0 z-10 w-full">
        {/* App Logo */}
        <div className="flex-1">
          <Link to={"/feed"} className="text-xl font-bold mx-4">
            Lynk 💕🔗
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 mr-4">
          {user && (
            <div className="dropdown dropdown-end">
              {/* Username + Avatar */}
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="hidden sm:block text-sm font-medium">
                  Welcome,
                  <span className="mr-2 ml-1">{user.firstName}</span>
                </span>

                <div className="avatar">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user.photoUrl} alt="User Avatar" />
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 w-52 p-2 shadow bg-base-100 rounded-box"
              >
                <li>
                  <Link to={"/profile"} className="justify-between" onClick={() => document.activeElement && document.activeElement.blur()}>
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <a onClick={() => document.activeElement && document.activeElement.blur()}>Settings</a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      // close dropdown by removing focus first
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

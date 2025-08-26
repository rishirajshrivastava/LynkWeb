import axios from "axios";
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleLogout = async() =>{
  console.log("Logging out user...");
    try {
      const res = await axios.post(
      "http://localhost:3000/logout",
      {},
      { withCredentials: true }
      );
      console.log("res" , res.status);
      if(res.data.message === "User logged out successfully" && res.status === 200){
        navigate("/login");
      }
    } catch (err) {
      console.log("An error occured while logging out: ", err);
    }
  }

  return (
    <>
      <div className="navbar bg-base-300 shadow-sm fixed top-0 z-10">
        {/* App Logo */}
        <div className="flex-1">
          <Link to={"/feed"} className="text-xl font-bold mx-4">Lynk 💕🔗</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 mr-4">
          {user && (
            <div className="dropdown dropdown-end">
              {/* Username + Avatar */}
              <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer">
                <span className="hidden sm:block text-sm font-medium">
                    Welcome,
                    <span className="mr-2 ml-1" >{user.firstName}</span>
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
                  <Link to={"/profile"} className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li><a>Settings</a></li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar

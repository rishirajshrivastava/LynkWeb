function App() {
  return (
    <>
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <a className="text-xl mx-4">Lynk 💕🔗</a>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end mx-5">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://media.licdn.com/dms/image/v2/D4D03AQHaI_6uAY-Bow/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1675358757547?e=2147483647&v=beta&t=VX9A6jEjn9CsYzvXlJeDCiqml29FiVMwY2-F8kY23sA" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

import { useState, useEffect } from "react";
import LoginBtn from "../components/LoginBtn";
import RegisterBtn from "./RegisterBtn";
import UserProfile from "./UserProfile";
import { useAuthContext } from "../context/AuthContext"

const Navbar = () => {
  const { user } = useAuthContext();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown

  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  const navmenu = {
    ROLE_ADMIN: [
      { name: "Home", link: "/" },
      {
        name: (
          <span className="flex items-center space-x-5 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Add a locations Store
          </span>
        ),
        link: "/add",
      },
    ],
    ROLE_MODERATOR: [
      { name: "Home", link: "/" },
      {
        name: (
          <span className="flex items-center space-x-5 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Add a locations Store
          </span>
        ),
        link: "/add",
      },
    ],
    ROLE_USER: [{ name: "Home", link: "/" }],
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

return(
<div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          <span className="text-base-100 font-bold text-purple-600 text-3xl font-thin">
            Zone Checker
          </span>{" "}
        </a>
      </div>

      {/* Menu for larger screens */}
      <div className="hidden md:flex md:flex-row md:items-center md:justify-center sm:flex sm:flex-col">
        <ul className="menu menu-horizontal px-1">
          {user &&
            navmenu[user.roles[0]].map((menuItem) => (
              <li key={menuItem.name}>
                <a href={menuItem.link} className="text-base hover:text-emerald-800">
                  {menuItem.name}
                </a>
              </li>
            ))}
        </ul>
      </div>

      {/* Dropdown for "Add a locations Store" */}
      {user &&
        user.roles.includes("ROLE_ADMIN") &&(
          <div className="relative md:hidden">
        <button onClick={toggleDropdown} className="btn btn-ghost">
          Add a locations Store
        </button>
        <div className={`dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50 ${isDropdownOpen ? 'block' : 'hidden'}`}>
          <ul className="menu p-2">
            <li>
              <a href="/add" className="text-base hover:text-emerald-800">
                Go to Add Locations
              </a>
            </li>
          </ul>
        </div>
      </div>
        )}
      

      {/* User Profile or Auth Buttons */}
      <div className="hidden md:flex items-center space-x-6">
        {user ? (
          <>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-800">Welcome,</span>
              <span className="text-lg font-bold text-blue-600">{user.username}</span>
              {user.roles?.length > 0 && (
                <div className="flex space-x-2">
                  {user.roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-medium rounded-full shadow-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Button */}
            <UserProfile />
          </>
        ) : (
          <div className="flex space-x-4 ">
            {/* Register and Login Buttons */}
            <RegisterBtn />
            <LoginBtn />
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden relative z-50">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50"
          >
            {user ? (
              <>
                <li>
                  <a>Welcome, {user.username}</a>
                </li>
                {user.roles.map((role, index) => (
                  <li key={index}>
                    <a>{role}</a>
                  </li>
                ))}
                <li>
                  <UserProfile />
                </li>
                {/* Include mobile menu items here */}
                {navmenu[user.roles[0]].map((menuItem) => (
                  <li key={menuItem.name}>
                    <a href={menuItem.link} className="text-base hover:text-emerald-800">
                      {menuItem.name}
                    </a>
                  </li>
                ))}
              </>
            ) : (
              <>
                <li className="mb-2">
                  <RegisterBtn />
                </li>
                <li>
                  <LoginBtn />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Theme controller */}
      <label className="grid cursor-pointer place-items-center ml-2">
        <input
          type="checkbox"
          value="synthwave"
          onChange={handleToggle}
          checked={theme === "dark" ? true : false}
          className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
        />
        <svg
          className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
        <svg
          className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12h2m14-10v2m-2 0h2m2 2h2m-2 2h2m-2 2h2m-2 2h2m-2 2h2m2 2h2m-14 0v-2m2 0h-2m-2-2h-2m2 0h-2m2-2h-2m2-2h-2m-2-2h-2m2-2h-2M1 6h2M21 6h2M1 18h2M21 18h2M1 12h2m2-2h2M1 12h2" />
        </svg>
      </label>
    </div>
  );
};

export default Navbar;

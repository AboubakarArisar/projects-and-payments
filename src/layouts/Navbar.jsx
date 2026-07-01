import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/action";

const Navbar = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleNavLinkClick = (to) => {
    setActiveLink(to);
  };

  const navLinks = [
    { to: "/Dashboard", label: "Dashboard" },
    { to: "/Teams", label: "Team" },
    { to: "/Projects", label: "Projects" },
    { to: "/Tasks", label: "Tasks" },
   
  ];

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    setMenuOpen(false);
  };

  const handleSidebarLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="relative">
      <header className="antialiased">
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center">
            <div className="lg:hidden">
              <button
                onClick={toggleSidebar}
                className="flex-shrink-0 p-1 text-gray-600 rounded-full hover:text-gray-900 focus:outline-none focus:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {isSidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path d="M6 18 18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
            <div className="flex justify-start items-center">
              <Link to="/Dashboard" className="flex mr-4 focus:outline-none">
                <img
                  src="android-chrome-512x512.png"
                  className="mr-3 h-8"
                  alt="ProjectProTrack Logo"
                />
                <span className="self-center xsm:text-xl md:text-2xl font-semibold whitespace-nowrap dark:text-white">
                  ProjectProTrack
                </span>
              </Link>
            </div>
            <div className="hidden lg:flex items-center lg:order-2">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className={`mr-4 text-gray-600 dark:text-gray-400 dark:hover:text-white focus:outline-none focus: ${
                    activeLink === link.to
                      ? "relative px-4 py-2 bg-gray-700 text-white rounded-md"
                      : ""
                  }`}
                  onClick={() => handleNavLinkClick(link.to)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="relative xsm:left-[45%] xsm:top-2 md:left-0  md:top-0">
              <button
                onClick={toggleMenu}
                className="flex-shrink-0 p-1 text-gray-600 rounded-full hover:text-gray-900 focus:outline-none focus:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <motion.img
                  className="w-12 h-12 rounded-full"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKmDfyODAvFJIypLg9tJFf8TiwDCY9_VlieFhW8pq8Y25nr8aBsAsuseAdinpbFPkJ-xo&usqp=CAU"
                  alt="Profile"
                  whileHover={{ scale: 1.1 }}
                />
              </button>
              <AnimatePresence key={"desktop"}>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-md bg-gray-800 border border-gray-700 ring-1 ring-gray-700 ring-opacity-5 focus:outline-none z-10"
                  >
                    <Link
                      to="#"
                      className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300 ease-in-out"
                    >
                      Profile
                    </Link>
                    <Link
                      to="#"
                      className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300 ease-in-out"
                    >
                      Settings
                    </Link>
                    <div
                      onClick={() => {
                        dispatch(logoutUser());
                      }}
                      to="#"
                      className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition duration-300 ease-in-out"
                    >
                      Logout
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </header>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="lg:hidden w-48 bg-gray-800 h-screen fixed top-14 left-0 z-50 overflow-y-auto rounded-r-lg"
          >
            <div className="p-4">
              <ul>
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="block py-2 text-gray-300 hover:text-white"
                      onClick={handleSidebarLinkClick}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;

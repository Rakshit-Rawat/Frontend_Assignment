import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

const Header = ({ user, logout, rows }) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  const handleMenuAction = (action) => {
    setIsUserMenuOpen(false);
    if (action === "logout") {
      logout();
    } else if (action === "settings") {
      navigate("/settings");
    } else if (action === "help") {
      navigate("/help");
    } else if (action === "upload") {
      navigate("/upload");
    }
  };
  
  // Only show upload button if there are rows
  const showUploadButton = rows && rows.length > 0;

  return (
    <header className="bg-gray-800 shadow-sm border-b border-gray-700 ">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-100">
          Data Analytics Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          {/* Upload Data Button - Only show if there are rows */}
          {showUploadButton && (
            <motion.button
              onClick={() => handleMenuAction("upload")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Upload Data
            </motion.button>
          )}
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={toggleUserMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center focus:outline-none"
              aria-label="User menu"
            >
              <img
                src={user?.photoURL}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-600 object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.button>
            
            {/* User Dropdown Menu */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-700"
                  >
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-gray-200">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <motion.button
                        onClick={() => handleMenuAction("settings")}
                        whileHover={{ backgroundColor: "#374151" }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          Settings
                        </div>
                      </motion.button>
                      <motion.button
                        onClick={() => handleMenuAction("help")}
                        whileHover={{ backgroundColor: "#374151" }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          Help & Support
                        </div>
                      </motion.button>
                      <div className="border-t border-gray-700 my-1"></div>
                      <motion.button
                        onClick={() => handleMenuAction("logout")}
                        whileHover={{ backgroundColor: "#374151" }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                          </svg>
                          Sign out
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  {/* Backdrop to close dropdown when clicking outside */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
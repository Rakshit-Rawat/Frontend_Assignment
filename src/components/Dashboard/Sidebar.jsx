import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Amazon from "../../assets/amazon.svg";
import Shopify from "../../assets/shopify.svg";
import Chat from "../../assets/chat.svg";
import Bank from "../../assets/bank.svg";

const items = [
  { key: "Chatbot", label: "Chatbot", icon: Chat },
  { key: "Profit", label: "Profit", icon: Bank },
  { key: "Amazon", label: "Amazon Integration", icon: Amazon },
  { key: "Shopify", label: "Shopify Integration", icon: Shopify },
];

// Mobile slide-in animation
const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  closed: {
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

// Nav item animation
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

export default function Sidebar({ tab, setTab }) {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle with "b" key for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "b") {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  
  return (
    <>
      {/* Mobile toggle button */}
      <motion.button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </motion.button>

      {/* Desktop sidebar (resizable via react-resizable-panels in Dashboard) */}
      <div className="hidden md:flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-r border-gray-700">
        <div className="text-center py-[14px] border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-100 font-[Inter, sans-serif] tracking-wide">
            Dashboard
          </h2>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-2">
          {items.map(({ key, label, icon }, index) => (
            <motion.button
              key={key}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              onClick={() => setTab(key)}
              className={`group flex items-center px-4 py-3 w-full text-sm font-medium rounded-lg transition-all duration-200 ${
                tab === key
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={icon}
                alt={label}
                className={`w-6 h-6 mr-3 transition-opacity ${
                  tab === key
                    ? "filter brightness-0 invert"
                    : "opacity-80 group-hover:opacity-100"
                }`}
              />
              {/* Show label normally (Dashboard panel controls width) */}
              {label}
            </motion.button>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-700 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} Your Company</span>
        </div>
      </div>

      {/* Mobile slide-in sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.aside
              className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-r border-gray-700 z-40 flex flex-col"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
            >
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-gray-100 font-[Inter, sans-serif] tracking-wide">
                  Dashboard
                </h2>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-2">
                {items.map(({ key, label, icon }, index) => (
                  <motion.button
                    key={key}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    onClick={() => {
                      setTab(key);
                      setIsOpen(false);
                    }}
                    className={`group flex items-center px-4 py-3 w-full text-sm font-medium rounded-lg transition-all duration-200 ${
                      tab === key
                        ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={icon}
                      alt={label}
                      className={`w-6 h-6 mr-3 transition-opacity ${
                        tab === key
                          ? "filter brightness-0 invert"
                          : "opacity-80 group-hover:opacity-100"
                      }`}
                    />
                    {label}
                  </motion.button>
                ))}
              </nav>
              <div className="px-6 py-4 border-t border-gray-700 text-xs text-gray-400">
                <span>© {new Date().getFullYear()} Your Company</span>
              </div>
            </motion.aside>

            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Dashboard/Sidebar";
import ProfitView from "../components/Dashboard/ProfitView";
import AmazonIntegration from "../components/Dashboard/AmazonIntegration";
import ShopifyIntegration from "../components/Dashboard/ShopifyIntegration";
import ChatbotPanel from "../components/Dashboard/ChatbotPanel";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user, googleLogout: logout } = useAuth();
  const { rows } = useData();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Profit");
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  const handleTabChange = (newTab) => {
    setIsLoading(true);
    console.log("Switching to tab:", newTab);
    setTimeout(() => {
      setTab(newTab);
      setIsLoading(false);
    }, 500);
  };

  if (!rows?.length) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-900 flex flex-col"
      >
        <header className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-medium text-gray-100">Data Analytics Dashboard</h1>
            <div className="flex items-center space-x-4">
              <img
                src={user?.photoURL}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-600"
              />
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Sign out"
              >
                Sign out
              </motion.button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-100 mb-2">No Data Available</h2>
            <p className="text-gray-400 mb-6">Please upload a spreadsheet to view your data here.</p>
            <motion.button
              onClick={() => navigate("/upload")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Upload data"
            >
              Upload Data
            </motion.button>
          </motion.div>
        </main>
      </motion.div>
    );
  }

  const headers = Object.keys(rows[0] || {});
  const N = (v) => (v === "" || v == null ? 0 : Number(v));

  const totals = useMemo(() => {
    let totalSales = 0, totalProfit = 0, totalExpenses = 0;
    for (const r of rows) {
      totalSales += N(r["Sales"]);
      totalProfit += N(r["Profit"]);
      totalExpenses += N(r["TE"]) + N(r["Credit"]) + N(r["Amazon Fee"]);
    }
    return { totalSales, totalProfit, totalExpenses };
  }, [rows]);

  const pieData = [
    { name: "Profit", value: totals.totalProfit },
    { name: "Expenses", value: totals.totalExpenses },
  ];

  const barData = rows.map((r) => ({
    name: r["Product Name"],
    Sales: N(r["Sales"]),
    Profit: N(r["Profit"]),
    Expenses: N(r["TE"]) + N(r["Credit"]) + N(r["Amazon Fee"]),
  }));

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-900 flex"
    >
      <Sidebar tab={tab} setTab={handleTabChange} />

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-medium text-gray-100">Data Analytics Dashboard</h1>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate("/upload")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Upload new data"
              >
                Upload New Data
              </motion.button>
              <img
                src={user?.photoURL}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-600"
              />
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Sign out"
              >
                Sign out
              </motion.button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {isLoading ? (
            <Loader text="Loading view..." />
          ) : (
            <div className="max-w-7xl mx-auto space-y-6">
              <AnimatePresence mode="wait">
                {tab === "Profit" && (
                  <motion.div
                    key="profit"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProfitView totals={totals} barData={barData} pieData={pieData} />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
                    >
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-900">
                            <tr>
                              {headers.map((h, i) => (
                                <th
                                  key={i}
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {rows.map((row, rowIndex) => (
                              <motion.tr
                                key={rowIndex}
                                custom={rowIndex}
                                initial="hidden"
                                animate="visible"
                                variants={rowVariants}
                                whileHover={{ backgroundColor: "#1E3A8A", transition: { duration: 0.2 } }}
                                className="cursor-pointer transition-colors"
                                onClick={() => navigate(`/product/${rowIndex}`)}
                                title="Open product details"
                              >
                                {headers.map((h, j) => (
                                  <td
                                    key={j}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-200"
                                  >
                                    {String(row[h] ?? "")}
                                  </td>
                                ))}
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-gray-900 px-6 py-3 flex items-center justify-between border-t border-gray-700">
                        <div className="text-sm text-gray-400">
                          Showing <span className="font-medium">{rows.length}</span> rows
                        </div>
                        <div className="text-sm text-gray-500">
                          Last updated: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
                {tab === "Chatbot" && (
                  <motion.div
                    key="chatbot"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatbotPanel rows={rows} />
                  </motion.div>
                )}
                {tab === "Amazon" && (
                  <motion.div
                    key="amazon"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AmazonIntegration onConnect={(v) => console.log("Amazon connect", v)} />
                  </motion.div>
                )}
                {tab === "Shopify" && (
                  <motion.div
                    key="shopify"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ShopifyIntegration onConnect={(v) => console.log("Shopify connect", v)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
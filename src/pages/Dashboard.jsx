import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Sidebar from "../components/Dashboard/Sidebar";
import ProfitView from "../components/Dashboard/ProfitView";
import AmazonIntegration from "../components/Dashboard/AmazonIntegration";
import ShopifyIntegration from "../components/Dashboard/ShopifyIntegration";
import ChatbotPanel from "../components/Dashboard/ChatbotPanel";
import Header from "../components/Dashboard/Header";
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
    setTimeout(() => {
      setTab(newTab);
      setIsLoading(false);
    }, 500);
  };

  const N = (v) => (v === "" || v == null ? 0 : Number(v));

  const totals = useMemo(() => {
    let totalSales = 0,
      totalProfit = 0,
      totalExpenses = 0;
    for (const r of rows || []) {
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

  const barData = (rows || []).map((r) => ({
    name: r["Product Name"],
    Sales: N(r["Sales"]),
    Profit: N(r["Profit"]),
    Expenses: N(r["TE"]) + N(r["Credit"]) + N(r["Amazon Fee"]),
  }));

  // if no data uploaded yet
  if (!rows?.length) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-900 flex flex-col"
      >
        <Header user={user} logout={logout} rows={rows}/>
        <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              No Data Available
            </h2>
            <p className="text-gray-400 mb-6">
              Please upload a spreadsheet to view your data here.
            </p>
            <motion.button
              onClick={() => navigate("/upload")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload Data
            </motion.button>
          </motion.div>
        </main>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-screen bg-gray-900"
    >
      <PanelGroup direction="horizontal" className="h-full">
        {/* Sidebar resizable*/}
        <Panel defaultSize={20} minSize={16} maxSize={40} >
          <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700">
            <Sidebar tab={tab} setTab={handleTabChange} />
          </div>
        </Panel>

        {/* Drag handle */}
        <PanelResizeHandle className="w-1 bg-gray-700/50 hover:bg-blue-500/60 cursor-col-resize" />

        {/* Main content fills the rest */}
        <Panel>
          <div className="flex flex-col h-full">
                    <Header user={user} logout={logout} rows={rows}/>


            <main className="flex-1 overflow-auto min-h-0 ">
              {isLoading ? (
                <Loader text="Loading view..." />
              ) : (
                <div className="max-w-7xl mx-auto py-2 px-2 h-full flex flex-col min-h-0">
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
                        {/* your table here */}
                      </motion.div>
                    )}

                    {tab === "Chatbot" && (
                      <motion.div
                        key="chatbot"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <ChatbotPanel rows={rows} />
                      </motion.div>
                    )}

                    {tab === "Amazon" && <AmazonIntegration onConnect={(v) => console.log("Amazon connect", v)} />}

                    {tab === "Shopify" && <ShopifyIntegration onConnect={(v) => console.log("Shopify connect", v)} />}
                  </AnimatePresence>
                </div>
              )}
            </main>
          </div>
        </Panel>
      </PanelGroup>
    </motion.div>
  );
}

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

import Sidebar from "../components/Dashboard/Sidebar";
import ProfitView from "../components/Dashboard/ProfitView";
import AmazonIntegration from "../components/Dashboard/AmazonIntegration";
import ShopifyIntegration from "../components/Dashboard/ShopifyIntegration";
import ChatbotPanel from "../components/Dashboard/ChatbotPanel";

export default function Dashboard() {
  const { user, googleLogout: logout } = useAuth();
  const { rows } = useData();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Profit");

  if (!rows?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-medium text-gray-800">Data Analytics Dashboard</h1>
            <div className="flex items-center space-x-4">
              <img src={user?.photoURL} alt="avatar" className="w-10 h-10 rounded-full border-2 border-gray-200" />
              <button onClick={logout} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6">Please upload a spreadsheet to view your data here.</p>
            <button onClick={() => navigate("/upload")} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Upload Data
            </button>
          </div>
        </main>
      </div>
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

  const barData = rows.map(r => ({
    name: r["Product Name"],
    Sales: N(r["Sales"]),
    Profit: N(r["Profit"]),
    Expenses: N(r["TE"]) + N(r["Credit"]) + N(r["Amazon Fee"]),
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar tab={tab} setTab={setTab} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-medium text-gray-800">Data Analytics Dashboard</h1>
            <div className="flex items-center space-x-4">
              <img src={user?.photoURL} alt="avatar" className="w-10 h-10 rounded-full border-2 border-gray-200" />
              <button onClick={logout} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {tab === "Profit"  && <ProfitView totals={totals} barData={barData} pieData={pieData} />}
            {tab === "Chatbot" && <ChatbotPanel rows={rows} />}
            {tab === "Amazon"  && <AmazonIntegration onConnect={(v) => console.log("Amazon connect", v)} />}
            {tab === "Shopify" && <ShopifyIntegration onConnect={(v) => console.log("Shopify connect", v)} />}

            {/* Data table shown on all tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/product/${rowIndex}`)}
                        title="Open product details"
                      >
                        {headers.map((h, j) => (
                          <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {String(row[h] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">Showing <span className="font-medium">{rows.length}</span> rows</div>
                <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}



import React from "react";
import { useNavigate } from "react-router";

export default function EmptyState() {
  const navigate = useNavigate();
  return (
    <main className="flex-grow flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
        <p className="text-gray-600 mb-6">Please upload a spreadsheet to view your data here.</p>
        <button
          onClick={() => navigate("/upload")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Upload Data
        </button>
      </div>
    </main>
  );
}

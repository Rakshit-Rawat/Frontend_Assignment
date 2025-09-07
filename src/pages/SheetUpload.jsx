import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useData } from "../context/DataContext";
import { motion, AnimatePresence } from "framer-motion";

const REQUIRED = [
  "Product Name",
  "Sales",
  "Profit",
  "TE",
  "Credit",
  "Amazon Fee",
  "Profit Percentage",
];

const normalize = (s) => String(s || "").trim().toLowerCase();

function validateHeaders(headers) {
  const norm = headers.map(normalize);
  const missing = REQUIRED.filter((col) => !norm.includes(normalize(col)));
  return { ok: missing.length === 0, missing };
}

export default function SheetUpload() {
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const { setRows } = useData();
  const navigate = useNavigate();

  const handleFile = useCallback(
    (file) => {
      if (!file) return;

      setError("");
      setFileName(file.name);

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError("File size exceeds 10MB limit. Please upload a smaller file.");
        return;
      }

      const ext = file.name.split(".").pop().toLowerCase();
      if (!["csv", "xlsx", "xls"].includes(ext)) {
        setError("Unsupported file type. Please upload CSV or Excel (.xlsx/.xls) files only.");
        return;
      }

      if (file.size === 0) {
        setError("File is empty. Please upload a valid file with data.");
        return;
      }

      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            try {
              if (!result.data || result.data.length === 0) {
                setError("No data found in the CSV file. Please check the file contents.");
                return;
              }

              const headers = result.meta.fields || [];
              const { ok, missing } = validateHeaders(headers);
              if (!ok) {
                setError(`Missing required columns: ${missing.join(", ")}`);
                return;
              }

              const invalidRows = result.data.filter((row) =>
                Object.values(row).some((val) => val === undefined || val === null || val === "")
              );

              if (invalidRows.length > result.data.length * 0.5) {
                setError("Too many empty or invalid rows detected. Please check your data.");
                return;
              }

              setRows(result.data);
              navigate("/dashboard", { replace: true });
            } catch (err) {
              setError(`Failed to process CSV file: ${err.message}`);
            }
          },
          error: (err) => setError(`CSV parsing error: ${err.message}`),
        });
      } else if (ext === "xlsx" || ext === "xls") {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const wb = XLSX.read(data, { type: "array" });

            if (!wb.SheetNames || wb.SheetNames.length === 0) {
              setError("Excel file contains no worksheets. Please upload a valid Excel file.");
              return;
            }

            const ws = wb.Sheets[wb.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

            if (!json || json.length === 0) {
              setError("Excel worksheet is empty. Please check the file contents.");
              return;
            }

            const [headerRow, ...rows] = json;

            if (!headerRow || headerRow.length === 0) {
              setError("No headers found in the Excel file. Please check the file structure.");
              return;
            }

            const { ok, missing } = validateHeaders(headerRow || []);
            if (!ok) {
              setError(`Missing required columns: ${missing.join(", ")}`);
              return;
            }

            const validRows = rows.filter((r) =>
              r && r.some((cell) => cell !== undefined && cell !== "" && cell !== null)
            );

            if (validRows.length === 0) {
              setError("No valid data rows found in the Excel file. Please check the file contents.");
              return;
            }

            const headers = headerRow;
            const objRows = validRows.map((r) =>
              Object.fromEntries(headers.map((h, i) => [h, r[i] || ""]))
            );

            setRows(objRows);
            navigate("/dashboard", { replace: true });
          } catch (err) {
            setError(`Failed to process Excel file: ${err.message || "Unknown error occurred"}`);
          }
        };

        reader.onerror = () => setError("Could not read file. Please try again.");
        reader.readAsArrayBuffer(file);
      }
    },
    [navigate, setRows]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const uploadAreaVariants = {
    idle: { scale: 1, borderColor: "#4B5563" },
    dragging: { scale: 1.02, borderColor: "#3B82F6", backgroundColor: "#1E3A8A" },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col p-4"
    >
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-gray-100">Upload Your Data</h1>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Upload Area */}
        <motion.div
          className={`w-full max-w-lg border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 bg-gray-800 border-gray-600`}
          animate={isDragging ? "dragging" : "idle"}
          variants={uploadAreaVariants}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file").click()}
        >
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-full p-4 mb-6"
              whileHover={{ scale: 1.1 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              {isDragging ? "Drop your file here" : "Drag & drop your file"}
            </h3>
            <p className="text-gray-400 mb-4">or click to browse files</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Select File
            </motion.button>
          </div>
          <input
            id="file"
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className="hidden"
            onChange={handleFileInput}
          />
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {fileName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 w-full max-w-lg p-3 bg-green-900/50 rounded-lg border border-green-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-green-300 text-sm font-medium">File Selected</p>
                <p className="text-green-400 text-xs">{fileName}</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 w-full max-w-lg p-3 bg-red-900/50 rounded-lg border border-red-700 flex items-start"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Required Columns Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4"
      >
        <div className="max-w-lg mx-auto">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">Required Columns</h2>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              {REQUIRED.map((col, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-300 text-sm">{col}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-center text-xs text-gray-400">
            Supported formats: CSV, Excel (.xlsx/.xls) • Max file size: 10MB
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
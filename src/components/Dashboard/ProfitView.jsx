import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import SummaryCards from "../Dashboard/SummaryCards";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function ProfitView({ totals, barData, pieData }) {
  const COLORS = ["#60A5FA", "#F87171"];


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Export data as CSV
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(barData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProfitData");
    const csv = XLSX.write(wb, { bookType: "csv" });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "profit_data.csv");
  };

  // Calculate additional metrics
  const profitMargin = totals.totalSales
    ? ((totals.totalProfit / totals.totalSales) * 100).toFixed(1)
    : 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <SummaryCards totals={totals} profitMargin={profitMargin} />

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Export to CSV
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
        >
          <h3 className="text-lg font-medium text-gray-100 mb-4">Overall Profit vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Amount"]}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #4B5563",
                    color: "#E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend wrapperStyle={{ color: "#E5E7EB" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
        >
          <h3 className="text-lg font-medium text-gray-100 mb-4">Sales / Profit / Expenses by Product</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="#4B5563" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#E5E7EB" />
                <YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString()}`} stroke="#E5E7EB" />
                <Tooltip
                  formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Amount"]}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #4B5563",
                    color: "#E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend wrapperStyle={{ color: "#E5E7EB" }} />
                <Bar dataKey="Sales" fill="#60A5FA" name="Sales" />
                <Bar dataKey="Profit" fill="#34D399" name="Profit" />
                <Bar dataKey="Expenses" fill="#F87171" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
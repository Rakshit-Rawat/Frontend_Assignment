import { useParams, Navigate, useNavigate } from "react-router";
import { useData } from "../context/DataContext";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rows } = useData();

  const index = Number(id);
  const product = Array.isArray(rows) ? rows[index] : null;

  // Guard rails
  if (!rows?.length) return <Navigate to="/dashboard" replace />;
  if (!Number.isInteger(index) || index < 0 || index >= rows.length) {
    return <Navigate to="/dashboard" replace />;
  }

  const fields = Object.entries(product);
  const N = (v) => (v === "" || v == null ? 0 : Number(v));

  // Chart data
  const pieData = [
    { name: "Profit", value: N(product["Profit"]) },
    { name: "Expenses", value: N(product["TE"]) + N(product["Credit"]) + N(product["Amazon Fee"]) },
  ];

  const barData = [
    {
      name: product["Product Name"],
      Sales: N(product["Sales"]),
      Profit: N(product["Profit"]),
      Expenses: N(product["TE"]) + N(product["Credit"]) + N(product["Amazon Fee"]),
    },
  ];

  const COLORS = ["#60A5FA", "#F87171"];

  // Animation variants
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-900"
    >
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-100">{product["Product Name"]}</h1>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm rounded-lg border border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ← Back
          </motion.button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Sales" value={product["Sales"]} />
          <Stat label="Profit" value={product["Profit"]} />
          <Stat
            label="Expenses"
            value={N(product["TE"]) + N(product["Credit"]) + N(product["Amazon Fee"])}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
          >
            <h3 className="text-lg font-medium text-gray-100 mb-4">Profit vs Expenses</h3>
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
            <h3 className="text-lg font-medium text-gray-100 mb-4">Sales / Profit / Expenses</h3>
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

        {/* Data Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Field
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {fields.map(([k, v], i) => (
                  <motion.tr
                    key={k}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    whileHover={{ backgroundColor: "#1E3A8A", transition: { duration: 0.2 } }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{k}</td>
                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-100">
                      {String(v ?? "")}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}

function Stat({ label, value }) {
  const n = Number(value || 0);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg"
    >
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-gray-100">₹{n.toLocaleString()}</p>
    </motion.div>
  );
}
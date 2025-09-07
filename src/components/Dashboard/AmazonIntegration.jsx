import { useState } from "react";
import { motion } from "framer-motion";
import Amazon from "../../assets/Amazon.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import Loader from "../Loader";
import { Package } from "lucide-react";

export default function AmazonIntegration({ onConnect }) {
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      email: form.get("email")?.trim(),
      store: form.get("store")?.trim(),
    };

    if (!payload.email || !payload.email.includes("@")) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (!payload.store) {
      setStatus("error");
      setErrorMsg("Please enter a store name.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setStatus("success");
      setErrorMsg("");
      setIsConnected(true);
      setIsLoading(false);
      onConnect?.(payload);
    }, 500);
  }

  function handleDisconnect() {
    setIsLoading(true);
    setTimeout(() => {
      setIsConnected(false);
      setStatus(null);
      setErrorMsg("");
      setIsLoading(false);
    }, 500);
  }

  // Sample data for charts
  const monthlyData = [
    { month: "Jan 2017", revenue: 1.2, sales: 0.8 },
    { month: "Jul 2017", revenue: 1.8, sales: 1.1 },
    { month: "Jan 2018", revenue: 2.5, sales: 1.5 },
    { month: "Jul 2018", revenue: 3.2, sales: 1.8 },
    { month: "Jan 2019", revenue: 3.8, sales: 2.2 },
  ];

  const cogsData = [
    { month: "Jan 2017", cogs: 0.5, unitCost: 16 },
    { month: "Jul 2017", cogs: 0.8, unitCost: 17 },
    { month: "Jan 2018", cogs: 1.2, unitCost: 18 },
    { month: "Jul 2018", cogs: 1.6, unitCost: 19 },
    { month: "Jan 2019", cogs: 1.8, unitCost: 20 },
  ];

  const costAnalysisData = [
    { name: "Net profit", value: 27.1, color: "#3b82f6" },
    { name: "Amz fees", value: 15.5, color: "#06b6d4" },
    { name: "COGS", value: 56.9, color: "#fbbf24" },
    { name: "Freight", value: 0.6, color: "#10b981" },
  ];

  const profitTypeData = [
    { name: "Amz PO", profit: 35.9 },
    { name: "1P", profit: 25.7 },
    { name: "FBA", profit: 17.7 },
    { name: "FBM", profit: 2.7 },
  ];

  const scatterData = [
    { x: 15, y: 3, size: 50, profit: 5 },
    { x: 25, y: 10, size: 80, profit: 15 },
    { x: 35, y: 15, size: 120, profit: 25 },
    { x: 45, y: 7, size: 90, profit: 12 },
    { x: 55, y: 22, size: 150, profit: 30 },
  ];

  const productData = [
    { asin: "D777GSLKJW", sales: 256236, revenue: "$3,324,822", cogs: "$2,295,806", netProfit: "$647,946" },
    { asin: "D774LE7DDC", sales: 44085, revenue: "$1,469,015", cogs: "$860,565", netProfit: "$440,346" },
    { asin: "D777GYDYSO", sales: 146929, revenue: "$978,894", cogs: "$265,696", netProfit: "$531,241" },
    { asin: "D777KSOOLI", sales: 62598, revenue: "$891,262", cogs: "$582,594", netProfit: "$217,332" },
    { asin: "D777WI9S85I", sales: 26988, revenue: "$680,681", cogs: "$396,084", netProfit: "$196,085" },
  ];

  const MetricCard = ({ title, value, change, changeColor = "text-blue-400" }) => (
    <div className="text-center">
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      {change && <div className={`text-xs ${changeColor}`}>{change}</div>}
    </div>
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isLoading) {
    return <Loader text="Processing..." />;
  }

  if (isConnected) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 p-6"
      >
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="p-2 rounded-lg bg-orange-900/50 mr-3">
              <img src={Amazon} alt="Amazon" className="w-6 h-6 filter brightness-150" />
            </div>
            <h1 className="text-3xl font-bold text-white">Amazon Seller Dashboard</h1>
                  <motion.button
                        onClick={handleDisconnect}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        aria-label="Disconnect Shopify integration"
                      >
                        Disconnect
                      </motion.button>
          </div>

       
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <MetricCard title="Revenue" value="$44.1M" />
            <MetricCard title="Sales" value="3.4M" />
            <MetricCard title="COGS" value="$25.1M" />
            <MetricCard title="Net profit" value="$11.9M" />
            <MetricCard title="Revenue YoY%" value="10.5%" />
            <MetricCard title="Sales YoY%" value="10.5%" />
            <MetricCard title="COGS YoY%" value="11.3%" />
            <MetricCard title="Net profit YoY%" value="10.2%" />
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Cost Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costAnalysisData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {costAnalysisData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <div className="text-xl font-bold text-white">$44.1M</div>
                <div className="text-sm text-gray-400">Revenue</div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue and Sales by Month</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="sales" fill="#fbbf24" name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profit (%) by Type</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitTypeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={10} />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="profit" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-right mt-2">
                <div className="text-xl font-bold text-white">27.1%</div>
                <div className="text-sm text-gray-400">Profit (%)</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue and Profit (%) by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={scatterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="Profit (%)"
                      stroke="#9ca3af"
                      fontSize={10}
                      domain={[0, 60]}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Sales YoY%"
                      stroke="#9ca3af"
                      fontSize={10}
                      domain={[0, 25]}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                    <Scatter dataKey="size" fill="#3b82f6" fillOpacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">COGS and Unit cost ($) by Month</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cogsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                    <YAxis yAxisId="left" stroke="#9ca3af" fontSize={10} />
                    <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                    <Bar yAxisId="left" dataKey="cogs" fill="#06b6d4" name="COGS" />
                    <Line yAxisId="right" dataKey="unitCost" stroke="#ec4899" name="Unit cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">ASIN Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-400 py-2">ASIN</th>
                      <th className="text-right text-gray-400 py-2">Sales</th>
                      <th className="text-right text-gray-400 py-2">Revenue</th>
                      <th className="text-right text-gray-400 py-2">Net profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.slice(0, 8).map((product, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="text-white py-2">{product.asin}</td>
                        <td className="text-right text-gray-300 py-2">{product.sales.toLocaleString()}</td>
                        <td className="text-right text-gray-300 py-2">{product.revenue}</td>
                        <td className="text-right text-green-400 py-2">{product.netProfit}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-600 font-semibold">
                      <td className="text-white py-2">Total</td>
                      <td className="text-right text-white py-2">3,431,161</td>
                      <td className="text-right text-white py-2">$44,120,331</td>
                      <td className="text-right text-green-400 py-2">$11,941,696</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-orange-900/50 mr-3">
          <img src={Amazon} alt="Amazon" className="w-6 h-6 filter brightness-150" />
        </div>
        <h3 className="text-lg font-medium text-gray-100">Amazon Integration</h3>
      </div>
      <p className="text-gray-400 mb-6">Connect your Amazon account to sync data.</p>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <motion.input
          name="email"
          type="email"
          placeholder="Email"
          whileFocus={{ scale: 1.02 }}
          className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          data-tooltip-id="email-tooltip"
          data-tooltip-content="Enter your Amazon account email"
        />
        <ReactTooltip id="email-tooltip" place="top" effect="solid" />
        <motion.input
          name="store"
          placeholder="Store name"
          whileFocus={{ scale: 1.02 }}
          className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
          data-tooltip-id="store-tooltip"
          data-tooltip-content="Enter your Amazon store name"
        />
        <ReactTooltip id="store-tooltip" place="top" effect="solid" />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-xl font-medium hover:from-orange-700 hover:to-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all shadow-md"
          aria-label="Connect Amazon"
        >
          Connect
        </motion.button>
      </form>
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-900/50 rounded-lg border border-green-700 flex items-center"
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
          <p className="text-green-300 text-sm">Connection successful!</p>
        </motion.div>
      )}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-900/50 rounded-lg border border-red-700 flex items-start"
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
          <p className="text-red-300 text-sm">{errorMsg}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
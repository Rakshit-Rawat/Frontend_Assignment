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
  LabelList,
} from "recharts";
import {
  RevenueIcon,
  SalesIcon,
  CogsIcon,
  ProfitIcon,
  TrendIcon,
} from "../Icons";
import Loader from "../Loader";

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
    {
      asin: "D777GSLKJW",
      sales: 256236,
      revenue: "$3,324,822",
      cogs: "$2,295,806",
      netProfit: "$647,946",
    },
    {
      asin: "D774LE7DDC",
      sales: 44085,
      revenue: "$1,469,015",
      cogs: "$860,565",
      netProfit: "$440,346",
    },
    {
      asin: "D777GYDYSO",
      sales: 146929,
      revenue: "$978,894",
      cogs: "$265,696",
      netProfit: "$531,241",
    },
    {
      asin: "D777KSOOLI",
      sales: 62598,
      revenue: "$891,262",
      cogs: "$582,594",
      netProfit: "$217,332",
    },
    {
      asin: "D777WI9S85I",
      sales: 26988,
      revenue: "$680,681",
      cogs: "$396,084",
      netProfit: "$196,085",
    },
  ];

  const MetricCard = ({
    title,
    value,
    change,
    changeColor = "text-blue-400",
    icon,
  }) => (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-lg"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-2xl font-bold text-white">{value}</div>
        {icon && <div className="p-1.5 rounded-lg bg-blue-900/30">{icon}</div>}
      </div>
      <div className="text-xs text-gray-400">{title}</div>
      {change && (
        <div className={`text-xs mt-0.5 ${changeColor}`}>{change}</div>
      )}
    </motion.div>
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-700 rounded-lg p-2 shadow-lg text-xs">
          <p className="text-black font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Icons for metric cards

  if (isLoading) {
    return <Loader text="Processing..." />;
  }

  if (isConnected) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 p-3 h-full overflow-auto"
      >
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-800 mr-3 shadow-lg">
                <img
                  src={Amazon}
                  alt="Amazon"
                  className="w-6 h-6 filter brightness-150"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Amazon Seller Dashboard
                </h1>
                <p className="text-gray-400 text-xs">
                  Real-time analytics and insights
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleDisconnect}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md flex items-center"
              aria-label="Disconnect Amazon integration"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              Disconnect
            </motion.button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MetricCard
              title="Revenue"
              value="$44.1M"
              change="+10.5%"
              icon={RevenueIcon}
            />
            <MetricCard
              title="Sales"
              value="3.4M"
              change="+10.5%"
              icon={SalesIcon}
            />
            <MetricCard
              title="COGS"
              value="$25.1M"
              change="+11.3%"
              icon={CogsIcon}
            />
            <MetricCard
              title="Net profit"
              value="$11.9M"
              change="+10.2%"
              icon={ProfitIcon}
            />
          </div>

          {/* Year-over-Year Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MetricCard
              title="Revenue YoY%"
              value="10.5%"
              changeColor="text-green-400"
              icon={TrendIcon}
            />
            <MetricCard
              title="Sales YoY%"
              value="10.5%"
              changeColor="text-green-400"
              icon={TrendIcon}
            />
            <MetricCard
              title="COGS YoY%"
              value="11.3%"
              changeColor="text-red-400"
              icon={TrendIcon}
            />
            <MetricCard
              title="Net profit YoY%"
              value="10.2%"
              changeColor="text-green-400"
              icon={TrendIcon}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
            {/* Cost Analysis */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Cost Analysis
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costAnalysisData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {costAnalysisData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#1f2937"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-1">
                <div className="text-lg font-bold text-white">$44.1M</div>
                <div className="text-xs text-gray-400">Total Revenue</div>
              </div>
            </div>

            {/* Revenue and Sales */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Revenue and Sales by Month
              </h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 0, left: -30, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      vertical={false}
                    />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={9} />
                    <YAxis stroke="#9ca3af" fontSize={9} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#3b82f6"
                      name="Revenue"
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      dataKey="sales"
                      fill="#fbbf24"
                      name="Sales"
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profit by Type */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-purple-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Profit (%) by Type
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profitTypeData}
                    layout="horizontal"
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={9} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#9ca3af"
                      fontSize={9}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="profit" fill="#3b82f6" radius={[0, 3, 3, 0]}>
                      <LabelList
                        dataKey="profit"
                        position="right"
                        fill="#9ca3af"
                        fontSize={8}
                        formatter={(v) => `${v}%`}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-400 ml-10">
                  Average Profit
                </div>
                <div className="text-lg font-bold text-white">27.1%</div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

            {/* Revenue and Profit Scatter */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-cyan-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Revenue and Profit by Category
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    data={scatterData}
                    margin={{ top: 10, right: 0, left: -40, bottom: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="Profit (%)"
                      stroke="#9ca3af"
                      fontSize={9}
                      domain={[0, 60]}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Sales YoY%"
                      stroke="#9ca3af"
                      fontSize={9}
                      domain={[0, 25]}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={<CustomTooltip />}
                    />
                    <Scatter dataKey="size" fill="#3b82f6" fillOpacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* COGS and Unit Cost */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  />
                </svg>
                COGS and Unit Cost by Month
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cogsData}
                    margin={{ top: 10, right: -40, left: -40, bottom: -50 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      vertical={false}
                    />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={9} />
                    <YAxis yAxisId="left" stroke="#9ca3af" fontSize={9} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#9ca3af"
                      fontSize={9}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="cogs"
                      fill="#06b6d4"
                      name="COGS"
                      radius={[3, 3, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      dataKey="unitCost"
                      stroke="#ec4899"
                      name="Unit cost ($)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ASIN Performance Table */}
            <div className="h-full">
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-xl h-full flex flex-col">
                {/* Header */}
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center flex-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ASIN Performance
                </h3>

                {/* Scroll area fills the rest */}
                <div className="relative flex-1 overflow-auto">
                  <table className="w-full text-xs table-fixed border-collapse">
                    {/* Force columns to stretch evenly (tweak % as you like) */}
                    <colgroup>
                      <col style={{ width: "28%" }} />
                      <col style={{ width: "24%" }} />
                      <col style={{ width: "24%" }} />
                      <col style={{ width: "24%" }} />
                    </colgroup>

                    <thead className="sticky top-0 z-10">
                      <tr className="border-b border-gray-700 bg-gray-800/90 backdrop-blur">
                        <th className="text-left text-gray-400 py-2 px-2">ASIN</th>
                        <th className="text-right text-gray-400 py-2 px-2">Sales</th>
                        <th className="text-right text-gray-400 py-2 px-2">Revenue</th>
                        <th className="text-right text-gray-400 py-2 px-2">Net Profit</th>
                      </tr>
                    </thead>

                    <tbody>
                      {productData.slice(0, 50).map((product, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="text-white py-2 px-2 font-mono text-xs">
                            {product.asin}
                          </td>
                          <td className="text-right text-gray-300 py-2 px-2">
                            {product.sales.toLocaleString()}
                          </td>
                          <td className="text-right text-gray-300 py-2 px-2">
                            {product.revenue}
                          </td>
                          <td className="text-right text-green-400 py-2 px-2 font-medium">
                            {product.netProfit}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot className="sticky bottom-0 z-10">
                      <tr className="border-t-2 border-gray-600 font-semibold bg-gray-700/70 backdrop-blur">
                        <td className="text-white py-2 px-2">Total</td>
                        <td className="text-right text-white py-2 px-2">3,431,161</td>
                        <td className="text-right text-white py-2 px-2">$44,120,331</td>
                        <td className="text-right text-green-400 py-2 px-2 font-medium">
                          $11,941,696
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
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
      className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 max-w-md mx-auto"
    >
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-800 mr-4 shadow-lg">
          <img
            src={Amazon}
            alt="Amazon"
            className="w-8 h-8 filter brightness-150"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-100">
            Amazon Integration
          </h3>
          <p className="text-gray-400 text-sm">
            Connect your Amazon seller account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Email Address
          </label>
          <motion.input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            whileFocus={{ scale: 1.02 }}
            className="w-full border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
            data-tooltip-id="email-tooltip"
            data-tooltip-content="Enter your Amazon account email"
          />
          <ReactTooltip id="email-tooltip" place="top" effect="solid" />
        </div>

        <div>
          <label
            htmlFor="store"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Store Name
          </label>
          <motion.input
            id="store"
            name="store"
            placeholder="Your Store Name"
            whileFocus={{ scale: 1.02 }}
            className="w-full border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
            data-tooltip-id="store-tooltip"
            data-tooltip-content="Enter your Amazon store name"
          />
          <ReactTooltip id="store-tooltip" place="top" effect="solid" />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-xl font-medium hover:from-orange-700 hover:to-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all shadow-lg flex items-center justify-center"
          aria-label="Connect Amazon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clipRule="evenodd"
            />
          </svg>
          Connect to Amazon
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
          <p className="text-green-300 text-sm">
            Connection successful! Your Amazon data is now syncing.
          </p>
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

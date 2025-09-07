import { useState } from "react";
import { motion } from "framer-motion";
import Shopify from "../../assets/shopify.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Loader from "../Loader";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Truck,
  Receipt,
} from "lucide-react";

export default function ShopifyIntegration({ onConnect }) {
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      storeUrl: form.get("storeUrl")?.trim(),
      apiKey: form.get("apiKey")?.trim(),
    };

    if (!payload.storeUrl || !payload.storeUrl.includes(".")) {
      setStatus("error");
      setErrorMsg("Please enter a valid store URL.");
      setIsLoading(false);
      return;
    }
    if (!payload.apiKey) {
      setStatus("error");
      setErrorMsg("Please enter an API key.");
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

  const mockData = [
    { name: "Online Sales", value: 800 },
    { name: "In-Store Sales", value: 200 },
    { name: "Refunds", value: 30 },
  ];

  const COLORS = ["#00C4B4", "#26D6C7", "#4DE8DA"];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const MetricCard = ({ title, value, change, changeType, icon: Icon, showChart = true }) => (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      {change && (
        <div className="flex items-center space-x-1 mb-4">
          {changeType === "increase" ? (
            <TrendingUp className="w-4 h-4 text-red-400" />
          ) : changeType === "decrease" ? (
            <TrendingDown className="w-4 h-4 text-red-400" />
          ) : (
            <TrendingUp className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-sm text-red-400">{change}</span>
          <span className="text-xs text-gray-500">Dec 31 vs Dec 24, 2024</span>
        </div>
      )}
      {showChart && (
        <div className="h-12 flex items-end space-x-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-500/30 rounded-sm"
              style={{
                height: `${Math.random() * 100}%`,
                minHeight: "4px",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <Loader text="Processing..." />;
  }

  if (isConnected) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="min-h-screen bg-gray-950 p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-green-900/50">
                <img src={Shopify} alt="Shopify" className="w-6 h-6 filter brightness-150" />
              </div>
              <h1 className="text-2xl font-bold text-white">Shopify - Finance Overview</h1>
            </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-100 mb-2">Sales Summary</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`${Number(v)}`, "Count"]}
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
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-100 mb-2">Key Metrics</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-lg font-semibold text-gray-100">₹950,000</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Average Order Value</p>
                  <p className="text-lg font-semibold text-gray-100">₹950</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Conversion Rate</p>
                  <p className="text-lg font-semibold text-gray-100">3.2%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Sales"
              value="94,006.73"
              change="6.7% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={DollarSign}
            />
            <MetricCard
              title="Gross Sales"
              value="88,564"
              change="7.9% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={DollarSign}
            />
            <MetricCard
              title="Net Sales"
              value="83,895.55"
              change="7.0% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={DollarSign}
            />
            <MetricCard
              title="AOV"
              value="52.49"
              change="6.5% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={DollarSign}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="MER"
              value="4.62"
              change="8.9% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={TrendingUp}
            />
            <MetricCard
              title="Total Customers"
              value="1,781"
              change="0.3% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={Users}
            />
            <MetricCard
              title="Repeat Customers"
              value="839"
              change="12.4% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={Users}
            />
            <MetricCard
              title="Returning Customer Rate"
              value="47.11"
              change="12.1% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={TrendingUp}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Returns"
              value="0"
              change="0.0% Dec 31 vs Dec 24, 2024"
              changeType="neutral"
              icon={Package}
              showChart={false}
            />
            <MetricCard
              title="Shipping"
              value="4,820"
              change="7.7% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={Truck}
            />
            <MetricCard
              title="Taxes"
              value="6,111.18"
              change="8.3% Dec 31 vs Dec 24, 2024"
              changeType="increase"
              icon={Receipt}
            />
            <MetricCard
              title="COGS"
              value="0"
              change="0.0% Dec 31 vs Dec 24, 2024"
              changeType="neutral"
              icon={Package}
              showChart={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Discounts" value="5,488.45" icon={DollarSign} />
            <MetricCard title="Ad Spend" value="20,361.37" icon={TrendingUp} />
            <MetricCard title="Gross Profit" value="83,895.55" icon={DollarSign} />
            <MetricCard title="Gross Margin" value="100" icon={TrendingUp} />
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
        <div className="p-2 rounded-lg bg-green-900/50 mr-3">
          <img src={Shopify} alt="Shopify" className="w-6 h-6 filter brightness-150" />
        </div>
        <h3 className="text-lg font-medium text-gray-100">Shopify Integration</h3>
      </div>
      <p className="text-gray-400 mb-6">Connect your Shopify store to sync data.</p>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <motion.input
          name="storeUrl"
          placeholder="Store URL"
          whileFocus={{ scale: 1.02 }}
          className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
          data-tooltip-id="storeUrl-tooltip"
          data-tooltip-content="Enter your Shopify store URL (e.g., mystore.myshopify.com)"
        />
        <ReactTooltip id="storeUrl-tooltip" place="top" effect="solid" />
        <motion.input
          name="apiKey"
          placeholder="API Key"
          whileFocus={{ scale: 1.02 }}
          className="border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
          data-tooltip-id="apiKey-tooltip"
          data-tooltip-content="Enter your Shopify API key"
        />
        <ReactTooltip id="apiKey-tooltip" place="top" effect="solid" />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md"
          aria-label="Connect Shopify"
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
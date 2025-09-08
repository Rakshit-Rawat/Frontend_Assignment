import { useState } from "react";
import { motion } from "framer-motion";
import Shopify from "../../assets/shopify.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
  AreaChart, Area
} from "recharts";
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
  Activity,
  Target,
  Zap,
  Award,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function ShopifyIntegration({ onConnect }) {
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  
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
  
  // Mock data
  const salesData = [
    { name: "Online Sales", value: 800, color: "#00C4B4" },
    { name: "In-Store Sales", value: 200, color: "#26D6C7" },
    { name: "Refunds", value: 30, color: "#4DE8DA" },
  ];
  
  const revenueData = [
    { month: "Jan", revenue: 40000, profit: 24000 },
    { month: "Feb", revenue: 30000, profit: 13980 },
    { month: "Mar", revenue: 20000, profit: 9800 },
    { month: "Apr", revenue: 27800, profit: 18900 },
    { month: "May", revenue: 18900, profit: 13900 },
    { month: "Jun", revenue: 23900, profit: 18000 },
    { month: "Jul", revenue: 34900, profit: 24000 },
  ];
  
  const trafficData = [
    { source: "Direct", visitors: 4000, conversion: 4.2 },
    { source: "Social", visitors: 3000, conversion: 3.8 },
    { source: "Email", visitors: 2000, conversion: 5.1 },
    { source: "Organic", visitors: 2780, conversion: 4.5 },
  ];
  
  const COLORS = ["#00C4B4", "#26D6C7", "#4DE8DA", "#6EEBE0"];
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  
  const MetricCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    showChart = true,
    trend = "up",
    suffix = "",
    prefix = ""
  }) => (
    <motion.div 
      whileHover={{ y: -3 }}
      className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="p-1.5 rounded-lg bg-green-900/30">
              <Icon className="w-4 h-4 text-green-400" />
            </div>
            <h3 className="text-xs font-medium text-gray-300">{title}</h3>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-white">{prefix}{value}</span>
            <span className="text-sm text-gray-400 ml-1">{suffix}</span>
          </div>
        </div>
        {trend === "up" ? (
          <div className="flex items-center text-green-400 bg-green-900/20 px-2 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span className="text-xs font-medium">{change}</span>
          </div>
        ) : trend === "down" ? (
          <div className="flex items-center text-red-400 bg-red-900/20 px-2 py-1 rounded-full">
            <ArrowDownRight className="w-3 h-3 mr-1" />
            <span className="text-xs font-medium">{change}</span>
          </div>
        ) : null}
      </div>
      {showChart && (
        <div className="h-8 flex items-end space-x-1 mt-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-green-500/20 to-green-500/60 rounded-sm"
              style={{
                height: `${20 + Math.random() * 80}%`,
                minHeight: "4px",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-200 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-300">{entry.name}:</span>
              </div>
              <span className="text-sm font-medium text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
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
        className="bg-gradient-to-br from-green-900 via-slate-900 to-slate-800 p-4 h-full overflow-auto"
      >
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-green-800 mr-4 shadow-lg">
                <img src={Shopify} alt="Shopify" className="w-8 h-8 filter brightness-150" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Shopify Analytics</h1>
                <p className="text-gray-400 text-sm">Comprehensive business insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Time Range Selector */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                {["7d", "30d", "90d", "1y"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      timeRange === range 
                        ? "bg-green-600 text-white" 
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              
              <motion.button
                onClick={handleDisconnect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md flex items-center"
                aria-label="Disconnect Shopify integration"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Disconnect
              </motion.button>
            </div>
          </div>
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MetricCard
              title="Total Revenue"
              value="94,006.73"
              change="+6.7%"
              changeType="increase"
              icon={DollarSign}
              prefix="₹"
            />
            <MetricCard
              title="Total Orders"
              value="1,789"
              change="+12.3%"
              changeType="increase"
              icon={ShoppingBag}
            />
            <MetricCard
              title="Average Order Value"
              value="52.49"
              change="+6.5%"
              changeType="increase"
              icon={Target}
              prefix="₹"
            />
            <MetricCard
              title="Conversion Rate"
              value="3.2"
              change="+0.8%"
              changeType="increase"
              icon={Activity}
              suffix="%"
            />
          </div>
          
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
            {/* Sales Distribution */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Sales Distribution
                </h3>
                <div className="text-xs text-gray-400">Last 30 days</div>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#1f2937" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Revenue Trend */}
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  Revenue Trend
                </h3>
                <div className="text-xs text-gray-400">Last 7 months</div>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#00C4B4" fill="url(#colorRevenue)" fillOpacity={1} />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C4B4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00C4B4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Customer Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MetricCard
              title="Total Customers"
              value="1,781"
              change="+0.3%"
              changeType="increase"
              icon={Users}
            />
            <MetricCard
              title="New Customers"
              value="942"
              change="+5.2%"
              changeType="increase"
              icon={Users}
            />
            <MetricCard
              title="Repeat Customers"
              value="839"
              change="+12.4%"
              changeType="increase"
              icon={Award}
            />
            <MetricCard
              title="Customer Lifetime Value"
              value="1,247"
              change="+8.7%"
              changeType="increase"
              icon={Star}
              prefix="₹"
            />
          </div>
          
          {/* Traffic Sources */}
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-xl mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-3.04.937-4.41a1 1 0 00-1.218 1.584c.077.203.145.41.202.622A10.037 10.037 0 014.083 9zM15 9a1 1 0 10-2 0v1.896c-.077.212-.145.419-.202.622a1 1 0 101.218 1.584A10.037 10.037 0 01-.937 4.41H15a1 1 0 102 0v-7.512zM5 15a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Traffic Sources
              </h3>
              <div className="text-xs text-gray-400">Conversion rates by source</div>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="#9ca3af" fontSize={10} />
                  <YAxis dataKey="source" type="category" stroke="#9ca3af" fontSize={10} width={60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="conversion" fill="#00C4B4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Financial Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MetricCard
              title="Gross Profit"
              value="83,895.55"
              change="+7.0%"
              changeType="increase"
              icon={DollarSign}
              prefix="₹"
            />
            <MetricCard
              title="Gross Margin"
              value="89.3"
              change="+2.1%"
              changeType="increase"
              icon={TrendingUp}
              suffix="%"
            />
            <MetricCard
              title="Ad Spend"
              value="20,361.37"
              change="+3.8%"
              changeType="increase"
              icon={Zap}
              prefix="₹"
            />
            <MetricCard
              title="Return on Ad Spend"
              value="4.12"
              change="+15.2%"
              changeType="increase"
              icon={Target}
            />
          </div>
          
          {/* Operational Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              title="Order Fulfillment Rate"
              value="98.7"
              change="+1.2%"
              changeType="increase"
              icon={Truck}
              suffix="%"
            />
            <MetricCard
              title="Average Fulfillment Time"
              value="1.2"
              change="-0.3"
              changeType="decrease"
              icon={Package}
              suffix=" days"
            />
            <MetricCard
              title="Return Rate"
              value="2.1"
              change="-0.5%"
              changeType="decrease"
              icon={Package}
              suffix="%"
            />
            <MetricCard
              title="Customer Satisfaction"
              value="4.8"
              change="+0.2"
              changeType="increase"
              icon={Star}
            />
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
        <div className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-green-800 mr-4 shadow-lg">
          <img src={Shopify} alt="Shopify" className="w-8 h-8 filter brightness-150" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-100">Shopify Integration</h3>
          <p className="text-gray-400 text-sm">Connect your Shopify store to sync data</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="storeUrl" className="block text-sm font-medium text-gray-400 mb-1">Store URL</label>
          <motion.input
            id="storeUrl"
            name="storeUrl"
            placeholder="yourstore.myshopify.com"
            whileFocus={{ scale: 1.02 }}
            className="w-full border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
            data-tooltip-id="storeUrl-tooltip"
            data-tooltip-content="Enter your Shopify store URL"
          />
          <ReactTooltip id="storeUrl-tooltip" place="top" effect="solid" />
        </div>
        
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
          <motion.input
            id="apiKey"
            name="apiKey"
            placeholder="Your API Key"
            whileFocus={{ scale: 1.02 }}
            className="w-full border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
            data-tooltip-id="apiKey-tooltip"
            data-tooltip-content="Enter your Shopify API key"
          />
          <ReactTooltip id="apiKey-tooltip" place="top" effect="solid" />
        </div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-lg flex items-center justify-center"
          aria-label="Connect Shopify"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
          Connect to Shopify
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
          <p className="text-green-300 text-sm">Connection successful! Your Shopify data is now syncing.</p>
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
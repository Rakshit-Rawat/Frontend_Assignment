import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList
} from "recharts";
import { motion } from "framer-motion";
import SummaryCards from "../Dashboard/SummaryCards";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function ProfitView({ totals, barData, pieData }) {
  const COLORS = ["#60A5FA", "#F87171"];
  const BAR_COLORS = { Sales: "#60A5FA", Profit: "#34D399", Expenses: "#F87171" };

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(barData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProfitData");
    const csv = XLSX.write(wb, { bookType: "csv" });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "profit_data.csv");
  };

  const profitMargin = totals.totalSales
    ? ((totals.totalProfit / totals.totalSales) * 100).toFixed(1)
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-slate-100 text-sm font-medium">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold text-slate-200">₹{Number(entry.value).toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + r * Math.sin((-midAngle * Math.PI) / 180);
    return (
      <text
        x={x}
        y={y}
        fill="#E5E7EB"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-[10px] font-medium"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-5 px-3 sm:px-4"
    >
      <SummaryCards totals={totals} profitMargin={profitMargin} />

      <div className="grid gap-5 lg:grid-cols-5 items-stretch">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex flex-col lg:col-span-2 min-h-[420px]"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-100">Overall Profit vs Expenses</h3>
            <div className="hidden sm:flex items-center gap-3">
              <span className="flex items-center text-xs text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-1.5" /> Profit
              </span>
              <span className="flex items-center text-xs text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 mr-1.5" /> Expenses
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#1F2937" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 text-xs">
              <span className="flex items-center text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-1.5" />
                Profit:&nbsp;<span className="font-semibold">₹{Number(totals.totalProfit).toLocaleString()}</span>
              </span>
              <span className="flex items-center text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 mr-1.5" />
                Expenses:&nbsp;<span className="font-semibold">₹{Number(totals.totalExpenses).toLocaleString()}</span>
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex flex-col lg:col-span-3 min-h-[420px]"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-100">Sales / Profit / Expenses by Product</h3>
            <button
              onClick={exportToCSV}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded-md transition-colors"
            >
              Export
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 8, right: 8, bottom: 42, left: 8 }}
                barSize={18}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  height={48}
                  interval={0}
                />
                <YAxis
                  stroke="#9CA3AF"
                  width={56}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={28}
                  wrapperStyle={{ color: "#E5E7EB", fontSize: 11 }}
                />
                <Bar dataKey="Sales" name="Sales" fill={BAR_COLORS.Sales} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="Sales" position="top" fill="#9CA3AF" fontSize={9} formatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                </Bar>
                <Bar dataKey="Profit" name="Profit" fill={BAR_COLORS.Profit} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="Profit" position="top" fill="#9CA3AF" fontSize={9} formatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                </Bar>
                <Bar dataKey="Expenses" name="Expenses" fill={BAR_COLORS.Expenses} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="Expenses" position="top" fill="#9CA3AF" fontSize={9} formatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

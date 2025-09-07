import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import SummaryCards from "../Dashboard/SummaryCards";

export default function ProfitView({ totals, barData, pieData }) {
  const COLORS = ["#4285F4", "#EA4335"];

  return (
    <>
      <SummaryCards totals={totals} />

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Overall Profit vs Expenses</h3>
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
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Amount"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Sales / Profit / Expenses by Product</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString()}`} />
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Amount"]} />
                <Legend />
                <Bar dataKey="Sales" fill="#4285F4" name="Sales" />
                <Bar dataKey="Profit" fill="#34A853" name="Profit" />
                <Bar dataKey="Expenses" fill="#EA4335" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

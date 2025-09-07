import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function ProductBars({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Sales / Profit / Expenses by Product</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
  );
}

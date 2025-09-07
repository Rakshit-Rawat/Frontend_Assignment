
import { useParams, Navigate, useNavigate } from "react-router";
import { useData } from "../context/DataContext";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Product Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map(([k, v]) => (
                <tr key={k}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{k}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">
                    {String(v ?? "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Optional: quick stats row if you use these columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Stat label="Sales"   value={product["Sales"]}   />
          <Stat label="Profit"  value={product["Profit"]}  />
          <Stat label="Expenses" value={(Number(product["TE"]||0)+Number(product["Credit"]||0)+Number(product["Amazon Fee"]||0))} />
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  const n = Number(value || 0);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">₹{n.toLocaleString()}</p>
    </div>
  );
}

import Dollar from "../../assets/dollar.svg";

export default function SummaryCards({ totals }) {
  const cards = [
    { title: "Total Sales",    value: totals.totalSales,    tone: "blue"  },
    { title: "Total Profit",   value: totals.totalProfit,   tone: "green" },
    { title: "Total Expenses", value: totals.totalExpenses, tone: "red"   },
  ];

  const styles = {
    blue:  { card: "bg-blue-50/60 border-blue-100",  iconBg: "bg-blue-200",  title: "text-blue-700",  value: "text-blue-900"  },
    green: { card: "bg-green-50/60 border-green-100",iconBg: "bg-green-200", title: "text-green-700", value: "text-green-900" },
    red:   { card: "bg-rose-50/60 border-rose-100",  iconBg: "bg-rose-200",  title: "text-rose-700",  value: "text-rose-900"  },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map(({ title, value, tone }) => {
        const s = styles[tone];
        return (
          <div key={title} className={`rounded-2xl p-6 border shadow-sm ${s.card}`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${s.iconBg}`}>
                {/* Note: <img> SVGs won't recolor with text classes. */}
                <img src={Dollar} alt="₹" className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${s.title}`}>{title}</p>
                <p className={`text-2xl font-extrabold ${s.value}`}>
                  ₹{Number(value || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

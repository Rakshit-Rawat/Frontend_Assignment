import { motion } from "framer-motion";
import Dollar from "../../assets/dollar.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function SummaryCards({ totals, profitMargin }) {
  const cards = [
    { title: "Total Sales", value: totals.totalSales, tone: "blue", trend: "+5.2%", id: "sales-tooltip" },
    { title: "Total Profit", value: totals.totalProfit, tone: "green", trend: "+3.8%", id: "profit-tooltip" },
    { title: "Total Expenses", value: totals.totalExpenses, tone: "red", trend: "-2.1%", id: "expenses-tooltip" },
  ];

  const styles = {
    blue: {
      card: "bg-gray-800 border-blue-900",
      iconBg: "bg-blue-900/50",
      title: "text-blue-400",
      value: "text-gray-100",
      trend: "text-blue-400",
    },
    green: {
      card: "bg-gray-800 border-green-900",
      iconBg: "bg-green-900/50",
      title: "text-green-400",
      value: "text-gray-100",
      trend: "text-green-400",
    },
    red: {
      card: "bg-gray-800 border-red-900",
      iconBg: "bg-red-900/50",
      title: "text-red-400",
      value: "text-gray-100",
      trend: "text-red-400",
    },
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map(({ title, value, tone, trend, id }, index) => {
        const s = styles[tone];
        return (
          <motion.div
            key={title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            className={`rounded-2xl p-6 border shadow-lg ${s.card}`}
            data-tooltip-id={id}
            data-tooltip-content={`${title}: ₹${Number(value || 0).toLocaleString()} (${trend} from last period)`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${s.iconBg}`}>
                <img src={Dollar} alt="₹" className="w-5 h-5 filter brightness-150" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${s.title}`}>{title}</p>
                <p className={`text-2xl font-extrabold ${s.value}`}>
                  ₹{Number(value || 0).toLocaleString()}
                </p>
                <p className={`text-xs ${s.trend}`}>
                  {trend}
                </p>
              </div>
            </div>
            <ReactTooltip id={id} place="top" effect="solid" />
          </motion.div>
        );
      })}
      {profitMargin && (
        <motion.div
          custom={cards.length}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
          className="rounded-2xl p-6 border shadow-lg bg-gray-800 border-purple-900"
          data-tooltip-id="margin-tooltip"
          data-tooltip-content={`Profit Margin: ${profitMargin}% of total sales`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-900/50">
              <img src={Dollar} alt="%" className="w-5 h-5 filter brightness-150" />
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-400">Profit Margin</p>
              <p className="text-2xl font-extrabold text-gray-100">{profitMargin}%</p>
            </div>
          </div>
          <ReactTooltip id="margin-tooltip" place="top" effect="solid" />
        </motion.div>
      )}
    </div>
  );
}
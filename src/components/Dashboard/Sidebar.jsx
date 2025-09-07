import Amazon from "../../assets/amazon.svg";
import Shopify from "../../assets/shopify.svg";
import Chat from "../../assets/chat.svg";
import Bank from "../../assets/bank.svg";

const items = [
  { key: "Chatbot", label: "Chatbot", icon: Chat },
  { key: "Profit",  label: "Profit",  icon: Bank },
  { key: "Amazon",  label: "Amazon Integration",  icon: Amazon },
  { key: "Shopify", label: "Shopify Integration", icon: Shopify },
];

export default function Sidebar({ tab, setTab }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 ">
        {items.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`group flex items-center px-4 py-3 w-full text-sm font-medium rounded-md transition-colors ${
              tab === key ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <img src={icon} alt={label} className="w-5 h-5 mr-3" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

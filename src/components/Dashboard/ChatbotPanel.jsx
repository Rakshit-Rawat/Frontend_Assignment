import React, { useMemo, useRef, useState } from "react";

function N(v) {
  return v === "" || v == null ? 0 : Number(v);
}

export default function ChatbotPanel({ rows }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me about your data. Try: “top 3 profit”, “total sales”, or “best product by profit %”" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const indexed = useMemo(() => {
    const list = rows.map(r => ({
      name: String(r["Product Name"] ?? ""),
      sales: N(r["Sales"]),
      profit: N(r["Profit"]),
      te: N(r["TE"]),
      credit: N(r["Credit"]),
      fee: N(r["Amazon Fee"]),
      pct: N(r["Profit Percentage"]),
    }));
    const totals = list.reduce(
      (acc, x) => {
        acc.sales += x.sales;
        acc.profit += x.profit;
        acc.expenses += x.te + x.credit + x.fee;
        return acc;
      },
      { sales: 0, profit: 0, expenses: 0 }
    );
    const byProfit = [...list].sort((a, b) => b.profit - a.profit);
    const byPct = [...list].sort((a, b) => b.pct - a.pct);
    const bySales = [...list].sort((a, b) => b.sales - a.sales);
    return { list, totals, byProfit, byPct, bySales };
  }, [rows]);

  function answer(q) {
    const query = q.toLowerCase();

    // Top 3 by profit
    if (query.includes("top") && query.includes("profit")) {
      const top = indexed.byProfit.slice(0, 3);
      return (
        "Top 3 products by Profit:\n" +
        top.map((x, i) => `${i + 1}. ${x.name} — ₹${x.profit.toLocaleString()}`).join("\n")
      );
    }

    // Totals
    if (query.includes("total")) {
      const t = indexed.totals;
      return `Totals:\n• Sales: ₹${t.sales.toLocaleString()}\n• Profit: ₹${t.profit.toLocaleString()}\n• Expenses: ₹${t.expenses.toLocaleString()}`;
    }

    // Best product by profit percentage
    if (query.includes("profit %") || query.includes("profit percentage")) {
      const best = indexed.byPct[0];
      return `Best profit %: ${best.name} — ${best.pct}%`;
    }

    // Best by sales
    if (query.includes("best") && query.includes("sales")) {
      const best = indexed.bySales[0];
      return `Best by sales: ${best.name} — ₹${best.sales.toLocaleString()}`;
    }

    // Fallback
    return "I can answer things like: “top 3 profit”, “total sales”, “best product by profit %”, or “best by sales”.";
  }

  function onSend(e) {
    e?.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    const botMsg = { role: "assistant", text: answer(input.trim()) };
    setMessages(m => [...m, userMsg, botMsg]);
    setInput("");
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  const quick = [
    "top 3 profit",
    "total sales",
    "best product by profit %",
    "best by sales",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-indigo-100 mr-3">💬</div>
        <h3 className="text-lg font-medium text-gray-800">AI Assistant</h3>
      </div>
      <p className="text-gray-600 mb-4">This is a mock chat that analyzes your uploaded sheet locally.</p>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quick.map(s => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="h-64 overflow-auto rounded-lg border border-gray-200 p-4 mb-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block px-3 py-2 rounded-lg text-sm ${
              m.role === "user" ? "bg-blue-600 text-white" : "bg-white border"
            }`}>
              {m.text.split("\n").map((line, j) => <div key={j}>{line}</div>)}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={onSend} className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ask something…"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Send
        </button>
      </form>
    </div>
  );
}

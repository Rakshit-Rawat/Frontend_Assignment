import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

function N(v) {
  return v === "" || v == null ? 0 : Number(v);
}

export default function ChatbotPanel({ rows }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm a multipurpose AI assistant. Ask me about your product data (e.g., “top 3 profit”, “total sales”), or any general question!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  const indexed = useMemo(() => {
    const list = rows.map((r) => ({
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

  async function answer(query) {
    const API_KEY = "AIzaSyBLQzsYrcsQyqZBC-PW7va6jI6ujJzm6eY"; 
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a multipurpose AI assistant. You can answer general questions, provide information, or analyze the provided product data.
      
      If the query is related to the product data, use the following JSON data to analyze and respond:
      ${JSON.stringify(indexed, null, 2)}
      
      For general queries not related to the data, answer helpfully using your knowledge.
      
      Keep your response concise and directly address the query.
      
      Query: ${query}
    `;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      return "Sorry, I encountered an error while processing your query. Please try again.";
    }
  }

  async function onSend(e) {
    e?.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 0);

    const botText = await answer(input.trim());
    const botMsg = { role: "assistant", text: botText };
    setMessages((m) => [...m, botMsg]);
    setIsLoading(false);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  const quick = [
    "top 3 profit",
    "total sales",
    "best product by profit %",
    "best by sales",
    "What's the weather like today?",
    "Tell me a joke",
  ];

  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-indigo-900/50 mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-100">Multipurpose AI Assistant</h3>
      </div>
      <p className="text-gray-400 mb-4">Ask questions about your data or anything else! Try the suggestions below.</p>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quick.map((s, i) => (
          <motion.button
            key={s}
            custom={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            onClick={() => setInput(s)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm px-3 py-1 rounded-full border border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            {s}
          </motion.button>
        ))}
      </div>

      {/* Messages */}
      <div className="h-64 overflow-auto rounded-lg border border-gray-700 p-4 mb-4 bg-gray-900">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-lg text-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 border border-gray-600 text-gray-100"
                }`}
              >
                {m.text.split("\n").map((line, j) => (
                  <div key={j}>{line}</div>
                ))}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className="text-left mb-3"
            >
              <div className="inline-block px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-600 text-gray-100">
                Thinking...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={onSend} className="flex gap-3">
        <motion.input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          whileFocus={{ scale: 1.02 }}
          className="flex-1 border border-gray-600 rounded-xl px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ask something…"
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          Send
        </motion.button>
      </form>
    </motion.div>
  );
}
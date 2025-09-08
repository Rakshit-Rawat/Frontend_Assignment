import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Mic, Square, Lightbulb, Copy, Check, RefreshCw, Bot, User } from "lucide-react";

export default function ChatbotPanel() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your AI analytics assistant. Ask me anything about your data or general queries.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const endRef = useRef(null);

  async function answer(query) {
    const API_KEY =import.meta.env.VITE_GEMINI_API_KEY 
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent(query);
      return result.response.text();
    } catch (error) {
      console.error("Gemini error:", error);
      return "⚠️ Sorry, something went wrong. Try again later.";
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

  function handleQuickQuestion(question) {
    setInput(question);
    setTimeout(() => {
      const form = document.getElementById("chatbot-form");
      if (form) form.dispatchEvent(new Event("submit", { cancelable: true }));
    }, 30);
  }

  function copyToClipboard(text, index) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  }

  function clearChat() {
    setMessages([
      { role: "assistant", text: "✅ Chat cleared! What do you want to explore now?" },
    ]);
  }

  const quickQuestions = [
    "Show me top 3 profitable products",
    "What's my total sales and profit?",
    "Which product has highest profit margin?",
    "Compare sales vs profit trends",
    "Explain my data in simple terms",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl border border-slate-700 flex flex-col h-full"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl p-3 flex-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI Analytics Assistant</h3>
              <p className="text-indigo-200 text-xs">Ask about your data or anything</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="p-3 flex-none">
        <div className="flex items-center mb-2">
          <Lightbulb className="h-4 w-4 mr-2 text-yellow-400" />
          <p className="text-gray-300 text-xs font-medium">Quick questions:</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((s) => (
            <button
              key={s}
              onClick={() => handleQuickQuestion(s)}
              className="text-xs px-2 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scroll">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-end gap-2 max-w-[70%]">
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm shadow ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
                <button
                  onClick={() => copyToClipboard(m.text, i)}
                  className="text-slate-400 hover:text-indigo-400 text-xs"
                >
                  {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex gap-2 items-center text-slate-400 text-xs">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
              Thinking...
            </div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-700 bg-slate-900 flex-none rounded-2xl">
  <form
    id="chatbot-form"
    onSubmit={onSend}
    className="flex gap-2 items-end"
  >
    <div className="relative flex-1">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend(e);
          }
        }}
        rows={1}
        className="w-full resize-none bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 pr-10 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scroll"
        placeholder="Ask about your data or anything..."
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-50"
        title="Send"
      >
        <Send size={16} />
      </button>
    </div>
  </form>
</div>

    </motion.div>
  );
}

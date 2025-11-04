"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX, FiRefreshCw } from "react-icons/fi";

// --- API Key for Weather ---
const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // 🔑 Replace this with your key

// --- Default Messages ---
const DEFAULT_MESSAGES = [
  { sender: "bot", text: "Hi 👋 I'm InterviewBot — ask me about interviews, resumes, or even the weather!" },
];

// --- Static FAQ ---
const FAQ = [
  { keywords: ["hi", "hello", "hey"], responses: ["Hey there 👋 How can I help you today? Interview tips or resume advice?"] },
  { keywords: ["interview", "tips", "prepare", "how to prepare"], responses: [
    "💼 Preparation Tip: Research the company, know your projects, and practice STAR (Situation, Task, Action, Result) answers.",
    "🧠 Mock interviews are great! I can simulate HR or technical rounds if you’d like."
  ]},
  { keywords: ["resume", "cv"], responses: [
    "📄 Resume Tip: Keep it short, show measurable results, and tailor it to each job role.",
    "💡 Highlight achievements, not just duties — like 'Reduced processing time by 40%' instead of 'Managed files'."
  ]},
  { keywords: ["behavioral", "tell me about yourself", "strength", "weakness"], responses: [
    "💬 Behavioral questions test attitude and fit. Use the STAR method (Situation, Task, Action, Result) for clear, structured answers.",
    "🧭 Example: 'My strength is adaptability — I quickly learn and adjust to new technologies or workflows.'"
  ]},
  { keywords: ["technical", "coding", "data structure", "algorithm"], responses: [
    "💻 Focus on core DSA — arrays, linked lists, trees, recursion, and dynamic programming.",
    "⚙️ Also, explain your logic aloud during interviews. Clarity beats speed!"
  ]},
  { keywords: ["mock", "simulate", "practice"], responses: [
    "🎭 I can simulate a mock interview — HR or Technical. Which one do you want to try?"
  ]},
  { keywords: ["projects", "portfolio"], responses: [
    "🚀 Showcase 2-3 strong projects. Explain your role, tech stack, and challenges you solved.",
    "📁 Use GitHub or a portfolio site — employers love seeing clean, well-documented code."
  ]},
  { keywords: ["communication", "soft skills"], responses: [
    "🗣️ Soft skills matter too — clarity, confidence, and empathy. Practice explaining technical topics simply."
  ]},
  { keywords: ["ai", "artificial intelligence", "ml", "machine learning"], responses: [
    "🤖 AI Interview Tip: Brush up on regression, classification, model evaluation metrics, and overfitting prevention.",
    "🧠 ML-focused roles often expect you to explain projects — data preprocessing, model choice, and results."
  ]},
  { keywords: ["thanks", "thank you", "thx"], responses: ["You’re welcome! 😊 Glad I could help.", "Anytime! Wishing you success 🚀"] },
  { keywords: ["bye", "goodbye", "see you"], responses: ["Goodbye 👋 Stay confident and keep practicing!"] },
];

// --- Helper: Find Matching Response ---
function findResponse(text) {
  if (!text) return null;
  const norm = text.toLowerCase();
  for (let item of FAQ) {
    for (let kw of item.keywords) {
      if (norm.includes(kw)) {
        return item.responses[Math.floor(Math.random() * item.responses.length)];
      }
    }
  }
  return null;
}

// --- Weather API Fetch ---
async function getWeather() {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=New Delhi&appid=${WEATHER_API_KEY}&units=metric`);
    const data = await res.json();
    if (data.cod === 200) {
      const { name, weather, main } = data;
      return `🌤️ The weather in ${name} is ${weather[0].description} with a temperature of ${main.temp}°C.`;
    } else {
      return "Sorry, I couldn’t fetch the weather right now 😅";
    }
  } catch {
    return "⚠️ Network error while fetching weather info.";
  }
}

export default function ChatbotPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("chat_messages_v1");
      return raw ? JSON.parse(raw) : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("chat_messages_v1", JSON.stringify(messages));
    } catch {}
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function pushMessage(msg) {
    setMessages(prev => [...prev, msg]);
  }

  async function send() {
    const text = input.trim();
    if (!text) return;

    pushMessage({ sender: "user", text });
    setInput("");
    setTyping(true);

    setTimeout(async () => {
      let reply = findResponse(text);

      // Weather Logic
      if (text.toLowerCase().includes("weather") || text.toLowerCase().includes("temperature")) {
        reply = await getWeather();
      }

      if (!reply)
        reply = "🤔 Hmm, I didn’t get that. Try asking about interviews, resumes, or say 'weather'.";

      pushMessage({ sender: "bot", text: reply });
      setTyping(false);
    }, 1000);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!open && (
        <motion.button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-16 h-16 flex items-center justify-center rounded-full 
                     bg-gray-900/80 backdrop-blur-md border border-white/20 
                     text-white text-3xl shadow-lg hover:scale-110 
                     transition-transform duration-200"
        >
          🤖
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 h-[430px] sm:w-96 sm:h-[500px] rounded-2xl 
                       shadow-2xl shadow-fuchsia-500/10 flex flex-col overflow-hidden 
                       border border-white/10 bg-black/30 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 
                            bg-black/50 border-b border-white/10 text-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-lg">🤖</div>
                <div>
                  <div className="font-semibold text-sm">InterviewBot</div>
                  <div className="text-xs flex items-center gap-1.5 text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMessages(DEFAULT_MESSAGES);
                    try { localStorage.removeItem("chat_messages_v1"); } catch {}
                  }}
                  title="Clear chat"
                  className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FiRefreshCw size={16} />
                </button>
                <button 
                  onClick={() => setOpen(false)} 
                  aria-label="Close chat" 
                  className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-sm bg-transparent">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col max-w-[80%] ${
                    m.sender === "bot" ? "items-start" : "items-end ml-auto"
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl shadow-sm ${
                      m.sender === "bot"
                        ? "bg-gray-800/80 text-gray-200 rounded-bl-lg"
                        : "bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white rounded-br-lg"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                  </div>
                  Bot is typing...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/50 flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 rounded-xl bg-gray-800/70 text-sm outline-none 
                           border-none text-gray-200 placeholder:text-gray-500
                           focus:ring-2 focus:ring-fuchsia-500 transition-shadow"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="p-2.5 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-700
                           text-white shadow-md hover:scale-105 active:scale-95 transition-transform 
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

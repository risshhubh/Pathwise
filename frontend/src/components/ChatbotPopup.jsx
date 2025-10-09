"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_MESSAGES = [
  { sender: "bot", text: "Hi 👋 I'm InterviewBot — ask me about interviews, resumes, or how to prepare!" },
];

const FAQ = [
  { keywords: ["hi", "hello", "hey"], responses: ["Hello! 👋 How can I help you with interviews today?"] },
  { keywords: ["interview", "tips", "prepare", "how to prepare"], responses: [
    "✅ Practice common questions, try mock interviews, and research the company. Want me to simulate an HR or technical round?"
  ]},
  { keywords: ["resume", "cv"], responses: [
    "📄 Resume Tip: Keep it concise, highlight achievements with numbers, and tailor it to the job role."
  ]},
  { keywords: ["behavioural", "behavioral", "tell me about yourself", "strength", "weakness"], responses: [
    "💡 Use the STAR method: Situation, Task, Action, Result. Want to hear an example answer?"
  ]},
  { keywords: ["technical", "algorithms", "data structure", "coding"], responses: [
    "💻 Practice DSA, solve coding problems (LeetCode, GFG), and explain your thought process clearly."
  ]},
  { keywords: ["mock", "practice", "simulate"], responses: [
    "🎭 I can simulate a mock interview (HR or Technical). Which one do you want?"
  ]},
  { keywords: ["thanks", "thank you", "thx"], responses: ["You’re welcome! ✨ All the best! 🚀"] },
  { keywords: ["bye", "goodbye", "see you"], responses: ["Goodbye 👋 — come back anytime!"] },
];

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
  return "🤔 Sorry, I didn't catch that. Try asking about interview tips, resumes, mock interviews or just say 'hi'.";
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

  function send() {
    const text = input.trim();
    if (!text) return;
    pushMessage({ sender: "user", text });
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = findResponse(text);
      pushMessage({ sender: "bot", text: reply });
      setTyping(false);
    }, 700);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!open && (
        <motion.button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="w-14 h-14 flex items-center justify-center rounded-full 
                     bg-gradient-to-r from-indigo-500 to-purple-600 
                     text-white shadow-lg cursor-pointer hover:scale-110 
                     animate-pulse"
        >
          💬
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-80 h-[430px] sm:w-96 sm:h-[500px] rounded-2xl 
                       shadow-2xl flex flex-col overflow-hidden 
                       border border-gray-200 backdrop-blur-2xl bg-white/90"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 
                            bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">🤖</div>
                <div>
                  <div className="font-semibold text-sm">InterviewBot</div>
                  <div className="text-xs flex items-center gap-1">
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
                  className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 cursor-pointer"
                >
                  Clear
                </button>
                <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-lg font-bold hover:text-gray-200 cursor-pointer">
                  ✖
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 text-sm 
                         bg-gradient-to-b from-gray-50 to-gray-100"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.sender === "bot" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm break-words leading-relaxed ${
                    m.sender === "bot"
                      ? "bg-white text-gray-900 border border-gray-200 self-start"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white self-end ml-auto"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}

              {typing && (
                <div className="flex items-center gap-2 text-xs text-gray-600 italic">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  Bot is typing...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none 
                           focus:ring-2 focus:ring-indigo-400 text-black"
              />
              <button
                onClick={send}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 
                           text-white shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

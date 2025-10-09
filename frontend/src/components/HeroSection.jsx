"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LightRays from "./LightRays"; // ✅ Import LightRays

// Animation variants for the main container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

// Variants for line and text
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

// Word animation
const wordVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function HeroSection() {
  const words = ["Crack", "Your", "Interview"]; // keep these in one line
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const handleGetStarted = () => {
    navigate("/interview");
  };

  const handleLearnMore = () => {
    navigate("/learn-more");
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black pt-16">
      {/* 🔆 LightRays Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      {/* ✨ Foreground Content */}
      <motion.div
        className="relative z-10 text-center text-white px-6 max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold drop-shadow-lg leading-tight"
        >
          <motion.span variants={itemVariants} className="block">
            {words.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.span>

          <motion.span variants={wordVariants} className="block mt-2">
            with{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI
            </span>
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg md:text-xl opacity-90"
        >
          Practice HR, Technical, and Behavioral interviews with real-time
          feedback. Track your progress and boost your confidence 🚀
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex gap-6 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg transition cursor-pointer"
            onClick={handleGetStarted}
          >
            🚀 Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 text-white border border-gray-400 hover:border-white rounded-xl font-semibold shadow-md transition cursor-pointer"
            onClick={handleLearnMore}
          >
            📄 Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* 🤖 Floating Chatbot Button & Popup */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        {/* Chatbot Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center text-white text-2xl"
        >
          💬
        </button>

        {/* Chat Window */}
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 font-semibold flex justify-between items-center">
              AI Chatbot
              <button onClick={() => setChatOpen(false)}>✖</button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto text-black">
              <p className="text-gray-600 text-sm">
                👋 Hi! How can I help you with your interview prep?
              </p>
            </div>

            {/* Input Box */}
            <div className="p-2 border-t flex">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none"
              />
              <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

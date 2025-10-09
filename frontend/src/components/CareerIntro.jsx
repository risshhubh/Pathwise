import React from "react";
import { motion } from "framer-motion";

export default function CareerIntro() {
  return (
    <div className="flex flex-col justify-center items-center text-center px-6 py-16 h-full w-full">
      
      {/* Friendly Emoji Intro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-6xl mb-6"
      >
              </motion.div>

      {/* Headline */}
      <motion.h2
        className="text-4xl font-bold text-blue-500 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Nervous About Interviews?
      </motion.h2>

      {/* Subheadline */}
      <motion.p
        className="text-lg text-gray-400 max-w-xl leading-relaxed mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        You’re not alone.  
        Pathwise is like your personal practice buddy — helping you prep,  
        learn from mistakes, and walk in confident. 🚀
      </motion.p>

      {/* Step Style Cards with Glassmorphism */}
      <div className="flex flex-col sm:flex-row gap-6 max-w-3xl">
        {[
          { emoji: "🤖", text: "Practice realistic AI mock interviews" },
          { emoji: "📊", text: "Get instant feedback & tips" },
          { emoji: "🎯", text: "Track your progress towards success" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center justify-center 
                       rounded-xl p-6 w-full
                       bg-white/10 backdrop-blur-lg 
                       border border-white/20 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
          >
            <span className="text-3xl mb-3">{item.emoji}</span>
            <p className="text-white text-base font-medium">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


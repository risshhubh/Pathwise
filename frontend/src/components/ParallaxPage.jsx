import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ParallaxPage() {
  const navigate = useNavigate();
  const handleStartInterview = () => {
    navigate("/interview");
  };
  return (
    <section
      className="relative h-[80vh] flex items-center justify-center text-center text-white px-6"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-3xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-5xl font-bold mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          Level Up Your Career
        </motion.h2>
        <motion.p
          className="text-lg max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Unlock AI-powered interview preparation, resume analysis, and expert
          career tools designed to help you succeed.
        </motion.p>
        <motion.button
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold shadow-lg transition transform hover:scale-105 cursor-pointer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 40 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          onClick={handleStartInterview}
        >
          🚀 Start Interview
        </motion.button>
      </motion.div>
    </section>
  );
}

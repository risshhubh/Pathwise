"use client";

import Threads from "./Threads";
import { motion } from "framer-motion"; // 👈 Import motion
import { useNavigate } from "react-router-dom";

// Animation variants for the main container (no changes here)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delay between h1, p, and buttons
    },
  },
};

// MODIFIED: This variant now also staggers its own children (the words)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.08, // 👈 Add stagger for the text trail effect
    },
  },
};

// NEW: A separate variant for each word in the heading
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
  const title = "Crack Your Interview with";
  const words = title.split(" ");
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate("/learn-more");
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 🔮 Animated Threads Background */}
      <div className="absolute inset-0">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
          color={[0.6, 0.2, 0.8]} // purple-pink cosmic tone
        />
      </div>

      {/* ✨ Foreground Content */}
      <motion.div
        className="relative z-10 text-center text-white px-6 max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* MODIFIED: The h1 now maps over words to create the trail effect */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold drop-shadow-lg"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              className="inline-block"
            >
              {word}&nbsp; {/* Adds a space after each word */}
            </motion.span>
          ))}
          {/* The "AI" part joins the animation trail */}
          <motion.span variants={wordVariants} className="inline-block">
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
    </section>
  );
}
"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    title: "AI Mock Interviews",
    description: "Get realistic interview simulations with instant feedback.",
    icon: "🤖",
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement with detailed analytics.",
    icon: "📊",
  },
  {
    title: "Resume Builder",
    description: "Create a professional resume with AI assistance.",
    icon: "🎯",
  },
  {
    title: "Personalized Roadmap",
    description: "Customized learning paths designed just for you.",
    icon: "🛣️",
  },
];

export default function FeatureCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: false });

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden"
    >
      {/* Decorative background elements */}
      {/* OPTIMIZATION: Reduced blur intensity on decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>

      <motion.div
        className="grid sm:grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl w-full relative z-10"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: {
            opacity: 0,
            y: 50,
            transition: {
              duration: 0.5,
              staggerChildren: 0.1,
              staggerDirection: -1,
            },
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.18,
              duration: 0.6,
            },
          },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={{
              // COMPLETED: Added the missing variants for enter/exit animations
              hidden: {
                opacity: 0,
                y: 40,
                transition: { duration: 0.5, ease: "easeOut" },
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            whileHover={{
              scale: 1.07,
              // OPTIMIZATION: Switched from boxShadow to a more performant border color change
              borderColor: "rgba(129, 140, 248, 0.5)", // indigo-400 with opacity
              transition: { type: "spring", stiffness: 300, damping: 18 },
            }}
            // OPTIMIZATION: Removed `backdrop-blur-lg` and added `will-change`
            className="p-10 rounded-3xl shadow-2xl bg-white/5 border border-gray-700 text-center"
            style={{ willChange: "transform, opacity, border-color" }}
          >
            <div className="text-6xl mb-6">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileScan, Bot, Map, TrendingUp } from "lucide-react";

// Feature data
const features = [
  {
    id: 1,
    title: "Resume Analyzer",
    description:
      "Get instant, AI-powered feedback to optimize your resume and land more interviews.",
    Icon: FileScan,
    path: "/resume-analyzer",
  },
  {
    id: 2,
    title: "AI Mock Interviews",
    description:
      "Practice your interview skills with a realistic AI, covering both technical and behavioral questions.",
    Icon: Bot,
    path: "/interview",
  },
  {
    id: 3,
    title: "Personalized Roadmap",
    description:
      "Receive a custom learning path with curated resources to achieve your specific career goals.",
    Icon: Map,
    path: "/personalized-roadmap",
  },
  {
    id: 4,
    title: "Progress Tracker",
    description:
      "Visualize your growth with detailed analytics on your skills, interview performance, and progress.",
    Icon: TrendingUp,
    path: "/tracker",
  },
];

export default function CareerLanding() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="w-full">
      {/* 🔹 Features Section */}
      <section
        ref={ref}
        className="relative min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden"
      >
        {/* Fades */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black via-black/80 to-transparent z-20"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-black via-black/70 to-transparent"></div>

        {/* Glow & grid */}
        <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Feature Cards */}
        <motion.div
          className="relative z-30 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature) => (
            <Card key={feature.id} feature={feature} />
          ))}
        </motion.div>
      </section>

      {/* 🟣 Hero Section */}
      <section
        className="relative h-[85vh] flex items-center justify-center text-center text-white px-6 overflow-hidden"
        style={{
          backgroundImage: "url('/src/assets/ai.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* ✅ Fixed overlay z-index to be behind navbar */}
        <div className="absolute inset-0 bg-black/70 z-0"></div>

        {/* Top fade */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black via-black/80 to-transparent z-0"></div>

        <motion.div
          className="relative z-10 max-w-4xl"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Level Up Your Career
          </motion.h2>

          <motion.p
            className="text-lg max-w-2xl mx-auto mb-10 text-gray-200"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          >
            Unlock AI-powered interview preparation, resume analysis, and expert
            career tools designed to help you succeed.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10 text-gray-200"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <div>
              <h4 className="text-2xl font-bold text-purple-400">10K+</h4>
              <p className="text-sm">Resumes Analyzed</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-blue-400">5K+</h4>
              <p className="text-sm">Mock Interviews</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-pink-400">95%</h4>
              <p className="text-sm">Success Rate</p>
            </div>
          </motion.div>

          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
            onClick={() => navigate("/interview")}
          >
            🚀 Start Interview
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
// 🪄 Enhanced Feature Card Component
const Card = ({ feature }) => {
  const navigate = useNavigate();
  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1] // Custom easing for smoother animation
      } 
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      onClick={() => feature.path && navigate(feature.path)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group bg-gradient-to-br from-white/10 via-white/5 to-transparent 
                 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 
                 cursor-pointer overflow-hidden"
    >
      {/* Animated gradient border on hover */}
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-pink-500/50 
                      opacity-0 group-hover:opacity-100 blur-sm transition-all duration-700"></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] 
                        bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        transition-transform duration-1000 ease-in-out"></div>
      </div>

      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Card content wrapper */}
      <div className="relative z-10">
        {/* Icon container */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex items-center justify-center w-16 h-16 mb-6
                     rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 
                     text-white shadow-lg shadow-purple-500/50
                     group-hover:shadow-xl group-hover:shadow-purple-500/70
                     transition-shadow duration-500"
        >
          <feature.Icon className="w-8 h-8" strokeWidth={2} />
        </motion.div>

        {/* Text content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white tracking-tight
                         group-hover:text-transparent group-hover:bg-clip-text 
                         group-hover:bg-gradient-to-r group-hover:from-purple-300 
                         group-hover:via-blue-300 group-hover:to-pink-300
                         transition-all duration-500">
            {feature.title}
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm
                        group-hover:text-white transition-colors duration-300">
            {feature.description}
          </p>
        </div>

        {/* Arrow indicator */}
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          whileHover={{ x: 5, opacity: 1 }}
          className="absolute bottom-8 right-8 text-white/60 group-hover:text-white transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 
                      group-hover:w-full transition-all duration-700 ease-out"></div>
    </motion.div>
  );
};
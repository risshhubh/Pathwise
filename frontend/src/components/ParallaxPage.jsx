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

// 🪄 Feature Card Component
const Card = ({ feature }) => {
  const navigate = useNavigate();
  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={cardVariants}
      onClick={() => feature.path && navigate(feature.path)}
      className="relative group bg-white/5 backdrop-blur-xl border border-white/10 
                 rounded-3xl shadow-lg p-8 hover:scale-[1.02] hover:border-white/20 cursor-pointer"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div
          className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r 
                     from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-2xl"
        />
      </div>

      <div
        className="relative flex items-center justify-center w-14 h-14 
                   rounded-2xl bg-gradient-to-tr from-purple-500/80 to-blue-500/80 
                   text-white shadow-md transition-transform duration-500 
                   group-hover:scale-110"
      >
        <feature.Icon className="w-7 h-7" />
      </div>

      <div className="relative mt-6 space-y-3">
        <h3 className="text-xl font-semibold text-white/90 tracking-wide">
          {feature.title}
        </h3>
        <p className="text-gray-300/90 leading-relaxed text-sm">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

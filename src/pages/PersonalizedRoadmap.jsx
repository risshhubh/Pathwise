"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBrain,
  FaRobot,
  FaGlobe,
  FaShieldAlt,
  FaChartLine,
  FaCheckCircle,
  FaLock,
  FaClock
} from "react-icons/fa";

const careerPaths = {
  datascience: {
    title: "Data Science",
    icon: <FaChartLine className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-500",
    stages: [
      { title: "Python Fundamentals", duration: "4 weeks", courses: ["Python for Data Science", "NumPy & Pandas Mastery"] },
      { title: "Statistics & Mathematics", duration: "6 weeks", courses: ["Probability & Statistics", "Linear Algebra Essentials"] },
      { title: "Machine Learning Basics", duration: "8 weeks", courses: ["Supervised Learning", "Unsupervised Learning", "Scikit-learn Workshop"] },
      { title: "Advanced ML & Deep Learning", duration: "10 weeks", courses: ["Neural Networks", "TensorFlow & PyTorch", "Model Optimization"] },
      { title: "Real-world Projects", duration: "8 weeks", courses: ["Kaggle Competitions", "Industry Case Studies", "Portfolio Building"] },
      { title: "Job Ready", duration: "Ongoing", courses: ["Interview Prep", "Resume Optimization", "LinkedIn Strategy"] }
    ]
  },
  aiml: {
    title: "AI/ML Engineering",
    icon: <FaBrain className="h-6 w-6" />,
    color: "from-purple-500 to-pink-500",
    stages: [
      { title: "Programming Foundation", duration: "4 weeks", courses: ["Python Advanced", "Data Structures & Algorithms"] },
      { title: "ML Fundamentals", duration: "6 weeks", courses: ["Machine Learning Theory", "Feature Engineering", "Model Selection"] },
      { title: "Deep Learning", duration: "10 weeks", courses: ["CNNs & Computer Vision", "RNNs & NLP", "Transformers Architecture"] },
      { title: "MLOps & Deployment", duration: "8 weeks", courses: ["Docker & Kubernetes", "ML Pipeline Design", "Cloud Platforms (AWS/GCP)"] },
      { title: "Specialized AI", duration: "8 weeks", courses: ["Reinforcement Learning", "GANs", "AI Ethics & Fairness"] },
      { title: "Career Launch", duration: "Ongoing", courses: ["Portfolio Projects", "Technical Interviews", "Networking"] }
    ]
  },
  genai: {
    title: "Generative AI",
    icon: <FaRobot className="h-6 w-6" />,
    color: "from-emerald-500 to-teal-500",
    stages: [
      { title: "AI Basics", duration: "3 weeks", courses: ["Introduction to AI/ML", "Python for AI", "APIs & Integration"] },
      { title: "LLM Fundamentals", duration: "6 weeks", courses: ["Transformer Architecture", "Prompt Engineering", "OpenAI & Anthropic APIs"] },
      { title: "Advanced GenAI", duration: "8 weeks", courses: ["Fine-tuning LLMs", "RAG Systems", "Vector Databases"] },
      { title: "Multimodal AI", duration: "6 weeks", courses: ["Text-to-Image (Stable Diffusion)", "Image Generation", "Audio AI"] },
      { title: "Production Systems", duration: "8 weeks", courses: ["LangChain & LlamaIndex", "AI Agents", "Scalable Deployment"] },
      { title: "Launch Career", duration: "Ongoing", courses: ["Build AI Products", "GenAI Portfolio", "Industry Applications"] }
    ]
  },
  web3: {
    title: "Web3 & Blockchain",
    icon: <FaGlobe className="h-6 w-6" />,
    color: "from-yellow-500 to-orange-500",
    stages: [
      { title: "Blockchain Basics", duration: "4 weeks", courses: ["Cryptocurrency Fundamentals", "Blockchain Technology", "Ethereum Basics"] },
      { title: "Smart Contracts", duration: "8 weeks", courses: ["Solidity Programming", "Smart Contract Security", "Testing & Debugging"] },
      { title: "DApp Development", duration: "8 weeks", courses: ["Web3.js & Ethers.js", "React + Web3", "IPFS & Decentralized Storage"] },
      { title: "Advanced Web3", duration: "8 weeks", courses: ["DeFi Protocols", "NFT Development", "Layer 2 Solutions"] },
      { title: "Real Projects", duration: "10 weeks", courses: ["Build a DEX", "NFT Marketplace", "DAO Implementation"] },
      { title: "Career Ready", duration: "Ongoing", courses: ["Web3 Portfolio", "Community Building", "Job Search Strategy"] }
    ]
  },
  cybersecurity: {
    title: "Cybersecurity",
    icon: <FaShieldAlt className="h-6 w-6" />,
    color: "from-red-500 to-rose-500",
    stages: [
      { title: "Security Fundamentals", duration: "5 weeks", courses: ["Network Security Basics", "Linux Administration", "Security Protocols"] },
      { title: "Ethical Hacking", duration: "8 weeks", courses: ["Penetration Testing", "Vulnerability Assessment", "Kali Linux Mastery"] },
      { title: "Security Operations", duration: "8 weeks", courses: ["SIEM Tools", "Incident Response", "Threat Hunting"] },
      { title: "Advanced Security", duration: "10 weeks", courses: ["Malware Analysis", "Cryptography", "Cloud Security"] },
      { title: "Certifications Path", duration: "12 weeks", courses: ["CompTIA Security+", "CEH Preparation", "CISSP Fundamentals"] },
      { title: "Job Market", duration: "Ongoing", courses: ["SOC Analyst Skills", "Security Portfolio", "Career Networking"] }
    ]
  }
};

const liveTasks = [
  "Analyzing job market trends across tech sectors...",
  "Matching your skills with 156 open positions...",
  "Curating personalized learning paths...",
  "Scanning 2,847 course reviews for quality...",
  "Optimizing your career timeline...",
  "Generating interview prep materials...",
];

export default function PersonalizedRoadmap() {
  const [selectedPath, setSelectedPath] = useState("datascience");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % liveTasks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-progress through stages for demonstration
  useEffect(() => {
    const currentPath = careerPaths[selectedPath];
    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prevIndex) => (prevIndex + 1) % currentPath.stages.length);
    }, 4000);

    return () => clearInterval(stageInterval);
  }, [selectedPath]);

  const currentPath = careerPaths[selectedPath];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-4 py-12 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your AI Career Roadmap
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose your path and explore the journey from beginner to job-ready professional
          </p>
        </motion.div>

        {/* Real-Time Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 max-w-2xl mx-auto mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">AI Analysis Active</span>
          </div>
          <div className="h-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTaskIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="font-mono text-sm text-cyan-300"
              >
                {liveTasks[currentTaskIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Career Path Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {Object.keys(careerPaths).map((pathKey) => {
            const path = careerPaths[pathKey];
            const isSelected = selectedPath === pathKey;
            return (
              <motion.button
                key={pathKey}
                onClick={() => {
                  setSelectedPath(pathKey);
                  setCurrentStageIndex(0);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-r ${path.color} text-white shadow-lg`
                    : 'bg-gray-800/50 text-gray-400 border border-white/10 hover:border-white/30'
                }`}
              >
                {path.icon}
                <span>{path.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Roadmap Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPath}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700"></div>

            {/* Timeline Stages */}
            <div className="space-y-8">
              {currentPath.stages.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const isLocked = index > currentStageIndex;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start gap-6 group"
                  >
                    {/* Timeline Node */}
                    <div className="relative z-10 flex-shrink-0">
                      <motion.div
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          isCompleted
                            ? `bg-gradient-to-br ${currentPath.color} border-transparent shadow-lg`
                            : isCurrent
                            ? 'bg-gray-800 border-white/30 animate-pulse'
                            : 'bg-gray-900 border-gray-700'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {isCompleted ? (
                          <FaCheckCircle className="h-6 w-6 text-white" />
                        ) : isLocked ? (
                          <FaLock className="h-5 w-5 text-gray-600" />
                        ) : (
                          <FaClock className="h-5 w-5 text-gray-400" />
                        )}
                      </motion.div>
                    </div>

                    {/* Stage Content */}
                    <div className={`flex-1 pb-8 transition-all duration-300 ${isLocked ? 'opacity-50' : ''}`}>
                      <div className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 ${
                        isCurrent
                          ? `border-white/30 shadow-2xl`
                          : 'border-white/10 hover:border-white/20'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{stage.title}</h3>
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                              <FaClock className="h-3 w-3" />
                              {stage.duration}
                            </p>
                          </div>
                          {isCurrent && (
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-xs font-semibold text-yellow-300">
                              IN PROGRESS
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full text-xs font-semibold text-green-300">
                              COMPLETED
                            </span>
                          )}
                        </div>

                        {/* Courses */}
                        <div className="space-y-2 mt-4">
                          {stage.courses.map((course, courseIndex) => (
                            <motion.div
                              key={courseIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * courseIndex }}
                              className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-white/5 hover:border-white/10 transition-all"
                            >
                              <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-400' : isCurrent ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'}`}></div>
                              <span className="text-sm text-gray-300">{course}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Roadmap Overview</h3>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentPath.stages.length}
              </p>
              <p className="text-gray-400 text-sm mt-1">Total Stages</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white">
                {currentPath.stages.reduce((acc, stage) => acc + stage.courses.length, 0)}
              </p>
              <p className="text-gray-400 text-sm mt-1">Courses</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white">
                {currentPath.stages.reduce((acc, stage) => {
                  const weeks = stage.duration.includes('weeks') ? parseInt(stage.duration) : 0;
                  return acc + weeks;
                }, 0)}+
              </p>
              <p className="text-gray-400 text-sm mt-1">Weeks</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import React from "react";
import { motion } from "framer-motion";

export default function CareerIntro() {
  return (
    <div className="flex flex-col justify-center items-start text-left p-10 h-full">
      <motion.h1
        className="text-5xl font-extrabold text-blue-400 mb-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        Start Your Career Today 🚀
      </motion.h1>
      <motion.p
        className="text-lg text-gray-300 max-w-lg leading-relaxed"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Pathwise is your AI-powered interview partner.  
        Practice mock interviews, get instant feedback, and 
        boost your confidence to land your dream job.
      </motion.p>
    </div>
  );
}

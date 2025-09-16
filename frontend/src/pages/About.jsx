import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Powered Mock Interviews",
    description:
      "Simulate real interview scenarios with instant, actionable feedback powered by advanced AI.",
    icon: "🤖",
  },
  {
    title: "Personalized Roadmaps",
    description:
      "Get a learning path tailored to your goals, strengths, and areas for improvement.",
    icon: "🗺️",
  },
  {
    title: "Progress Tracking",
    description:
      "Visualize your growth with analytics, charts, and detailed performance reports.",
    icon: "📈",
  },
  {
    title: "Resume Builder",
    description:
      "Craft a professional resume with AI suggestions and best practices.",
    icon: "📄",
  },
];

const team = [
  {
    name: "Rishabh Srivastava",
    role: "Frontend Lead",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Loves building beautiful, accessible user experiences.",
  },
  {
    name: "Mohd. Saqib",
    role: "Auth Lead",
    img: "https://randomuser.me/api/portraits/men/68.jpg",
    bio: "Expert in secure authentication and user management systems.",
  },
  {
    name: "Shubh Kumar",
    role: "Backend Lead",
    img: "https://randomuser.me/api/portraits/men/44.jpg",
    bio: "Passionate about scalable backend architectures and APIs.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          About Pathwise
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          Our mission is to empower everyone to ace their interviews with confidence. We blend cutting-edge AI, expert content, and a supportive community to help you land your dream job.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <span className="inline-block px-6 py-2 bg-blue-700/30 rounded-full text-blue-200 font-semibold animate-pulse">
            Built for learners. Trusted by professionals.
          </span>
        </motion.div>
      </motion.div>


      {/* Animated Timeline Section */}
      <motion.div
        className="max-w-5xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-10 text-blue-300">Our Journey</h2>
        <ol className="relative border-l border-blue-500">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-700 rounded-full -left-4 ring-4 ring-blue-300 animate-bounce">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" /></svg>
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-white">Founded in 2024</h3>
            <p className="mb-4 text-base font-normal text-gray-300">Pathwise was born from a passion to make interview prep accessible to all.</p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-700 rounded-full -left-4 ring-4 ring-purple-300 animate-pulse">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 7H7v6h6V7z" /></svg>
            </span>
            <h3 className="mb-1 text-lg font-semibold text-white">First 1,000 Users</h3>
            <p className="text-base font-normal text-gray-300">Our community grew rapidly, validating the need for smarter, friendlier interview prep tools.</p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-green-700 rounded-full -left-4 ring-4 ring-green-300 animate-spin-slow">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2" fill="none" /></svg>
            </span>
            <h3 className="mb-1 text-lg font-semibold text-white">Continuous Innovation</h3>
            <p className="text-base font-normal text-gray-300">We keep adding new features, smarter AI, and more ways to help you succeed.</p>
          </li>
        </ol>
      </motion.div>

      {/* Fun Facts Section */}
      <motion.div
        className="max-w-5xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-10 text-green-300">Fun Facts</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform animate-fade-in">
            <div className="text-4xl mb-2">🌍</div>
            <div className="text-2xl font-bold text-white">20+</div>
            <div className="text-gray-300">Countries with users</div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform animate-fade-in">
            <div className="text-4xl mb-2">💬</div>
            <div className="text-2xl font-bold text-white">100k+</div>
            <div className="text-gray-300">Mock interviews completed</div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform animate-fade-in">
            <div className="text-4xl mb-2">🚀</div>
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-gray-300">Uptime this year</div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        className="max-w-5xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-10 text-pink-300">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white/10 rounded-xl p-8 shadow-lg animate-fade-in"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-lg text-gray-200 mb-4">“The AI feedback is so detailed and helpful. I landed my dream job thanks to this app!”</p>
            <div className="font-bold text-white">— Samir, Software Engineer</div>
          </motion.div>
          <motion.div
            className="bg-white/10 rounded-xl p-8 shadow-lg animate-fade-in"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-lg text-gray-200 mb-4">“I love the clean design and the instant practice. It’s like having a coach 24/7.”</p>
            <div className="font-bold text-white">— Priya, Data Analyst</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        className="max-w-4xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-yellow-300">Our Mission</h2>
        <p className="text-lg text-gray-200 mb-2">We believe everyone deserves a fair shot at their dream job. Our mission is to break down barriers and make interview preparation accessible, effective, and even fun for all.</p>
        <p className="text-lg text-gray-200">From students to seasoned professionals, we’re here to support your journey every step of the way.</p>
      </motion.div>

      {/* Team Section */}
      <motion.div
        className="max-w-5xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-10 text-purple-300">Meet the Team</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-10">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="bg-white/10 border border-gray-700 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2, type: "spring" }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-4 border-4 border-purple-400 shadow-md"
              />
              <h4 className="text-xl font-bold mb-1 text-white">{member.name}</h4>
              <p className="text-purple-300 font-semibold mb-2">{member.role}</p>
              <p className="text-gray-300 text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Animated Call to Action */}
      <motion.div
        className="w-full flex flex-col items-center mt-16"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl px-10 py-8 shadow-2xl flex flex-col items-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Ace Your Next Interview?</h3>
          <p className="text-gray-200 mb-4">Sign up now and unlock all features for free!</p>
          <a
            href="/interview"
            className="px-8 py-3 bg-black/80 hover:bg-black rounded-xl font-semibold text-blue-200 shadow-lg transition transform hover:scale-105"
          >
            Start Practicing
          </a>
        </div>
      </motion.div>
    </div>
  );
}

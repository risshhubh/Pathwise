// src/components/AuthLayout.jsx
import React from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import LiquidEther from "./LiquidEther";
import CareerIntro from "./CareerIntro";

export default function AuthLayout({
  isLogin,
  form,
  showPassword,
  message,
  handleChange,
  handleSubmit,
  setShowPassword,
  toggleAuthMode,
  onGoogleSuccess,
  onGoogleError,
}) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-y-auto">
      {/* 🔹 Background stays fixed behind everything */}
      <div className="absolute inset-0 z-0">
        <LiquidEther />
      </div>

      {/* 🔹 Content wrapper */}
      <div className="relative z-10">
        {/* ============ HERO SECTION ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
          {/* Center Title */}
          <motion.div
            className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 drop-shadow-lg">
              Pathwise
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-200 mt-2">
              AI Job Portal – Smarter Careers Begin Here
            </h2>
          </motion.div>

          {/* Left section - Career intro */}
          <div className="hidden md:flex items-center justify-center">
            <CareerIntro />
          </div>

          {/* Right section - Auth card */}
          <div className="flex items-center justify-center p-8 mt-32 md:mt-0">
            <div className="max-w-md w-full bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-10 shadow-2xl">
              <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">
                {isLogin ? "Login" : "Sign Up"}
              </h1>

              {/* Auth form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {!isLogin && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="px-4 py-2 rounded bg-black/60 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="px-4 py-2 rounded bg-black/60 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="px-4 py-2 rounded bg-black/60 border border-gray-700 text-white focus:outline-none w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 cursor-pointer"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg transition cursor-pointer"
                >
                  {isLogin ? "Login" : "Sign Up"}
                </button>
              </form>

              {/* Separator */}
              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="mx-4 text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-600"></div>
              </div>

              {/* Google login */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={onGoogleSuccess}
                  onError={onGoogleError}
                  theme="outline"
                  size="large"
                  shape="pill"
                />
              </div>

              {/* Toggle login/signup */}
              <button
                type="button"
                className="w-full text-center mt-6 text-blue-300 hover:underline cursor-pointer"
                onClick={toggleAuthMode}
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Login"}
              </button>

              {/* Feedback message */}
              {message && (
                <div
                  className={`mt-4 text-center ${
                    message.startsWith("✅") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============ EXTRA CONTENT BELOW ============ */}
        <section className="py-20 px-6 md:px-16 text-center">
          <h2 className="text-4xl font-bold text-blue-400 mb-6">
            Why Choose Pathwise?
          </h2>
          <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed">
            Pathwise is more than just a job portal. We combine the power of AI
            with career insights to help you land the perfect opportunity.
            Explore roles that match your skills, get AI interview prep, and
            track your growth — all in one place.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-900/60 p-6 rounded-xl shadow-lg border border-gray-800">
              <h3 className="text-xl font-semibold text-blue-300 mb-3">
                AI Career Match
              </h3>
              <p className="text-gray-400">
                Smart recommendations tailored to your skills & goals.
              </p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl shadow-lg border border-gray-800">
              <h3 className="text-xl font-semibold text-blue-300 mb-3">
                Interview Prep
              </h3>
              <p className="text-gray-400">
                Practice with AI-driven mock interviews & instant feedback.
              </p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl shadow-lg border border-gray-800">
              <h3 className="text-xl font-semibold text-blue-300 mb-3">
                Growth Analytics
              </h3>
              <p className="text-gray-400">
                Track your job applications, skills, and improvement over time.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/70 border-t border-gray-800 text-gray-500 text-sm py-6 text-center">
          © {new Date().getFullYear()} Pathwise. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

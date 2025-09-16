import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-16 relative overflow-hidden">
      {/* Matte decorative background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* About / Branding */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Pathwise
          </h2>
          <p className="text-gray-400 text-sm">
            Helping you crack interviews with AI-powered mock sessions, resume tips, and progress tracking.  
            Stay ahead and level up your career!
          </p>
          {/* Social links as text */}
          <div className="flex gap-4 mt-2 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">GitHub</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">LinkedIn</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Twitter</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <a href="#" className="hover:text-blue-400 transition-colors duration-300">Home</a>
          <a href="#" className="hover:text-blue-400 transition-colors duration-300">Interview</a>
          <a href="#" className="hover:text-blue-400 transition-colors duration-300">Dashboard</a>
          <a href="#" className="hover:text-blue-400 transition-colors duration-300">About</a>
        </div>

        {/* Newsletter / Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
          <p className="text-gray-400 text-sm">
            Subscribe to get the latest updates, tips, and AI features.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-1 py-2 rounded-l-xl bg-black border border-gray-700 focus:outline-none focus:border-blue-400 text-gray-200"
            />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-xl text-white font-semibold transition-transform hover:scale-105 cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AI Interview Assistant. All rights reserved.
      </div>
    </footer>
  );
}

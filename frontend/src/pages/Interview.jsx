import React from "react";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white/5 border border-gray-800 rounded-2xl p-10 shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Interview Room</h1>
        <p className="text-lg text-gray-300 mb-8">
          Welcome to your AI-powered interview experience!<br />
          Click below to start a mock interview or explore interview tips.
        </p>
        <div className="flex flex-col gap-4 items-center">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg transition transform hover:scale-105 cursor-pointer">
            Start Mock Interview
          </button>
          <button
            className="px-8 py-3 border border-gray-400 hover:border-white rounded-xl font-semibold shadow-md transition transform hover:scale-105 text-white cursor-pointer"
            onClick={() => navigate("/interview-tips")}
          >
            View Interview Tips
          </button>
        </div>
      </div>
    </div>
  );
}

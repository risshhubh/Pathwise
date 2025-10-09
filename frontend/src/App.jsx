import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// 🧭 Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import ChatbotPopup from "./components/ChatbotPopup";

// 📝 Page Components
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import InterviewTips from "./pages/InterviewTips";
import About from "./pages/About";
import LearnMore from "./pages/LearnMore";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import PersonalizedRoadmap from "./pages/PersonalizedRoadmap"; // ✅ Added

function AppLayout() {
  const location = useLocation();
  const hideNavFooter = location.pathname === "/auth";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* 🟣 Navbar */}
      {!hideNavFooter && <Navbar />}

      {/* 🟡 Page Routes */}
      <main className="flex-grow">
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* 🔐 Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/interview-tips" element={<InterviewTips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route
              path="/personalized-roadmap"
              element={<PersonalizedRoadmap />}
            />
          </Route>
        </Routes>
      </main>

      {/* 🟣 Footer */}
      {!hideNavFooter && <Footer />}

      {/* 🤖 Chatbot Floating */}
      {!hideNavFooter && <ChatbotPopup />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

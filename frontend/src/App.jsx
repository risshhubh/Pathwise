import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the new component

// Page Components
import HomePage from "./pages/HomePage"; // Import the new homepage
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import InterviewTips from "./pages/InterviewTips";
import About from "./pages/About";
import LearnMore from "./pages/LearnMore";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import Help from "./pages/Help";

function AppLayout() {
  const location = useLocation();
  const hideNavFooter = location.pathname === "/auth";
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/interview-tips" element={<InterviewTips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
          </Route>
        </Routes>
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}
// ...existing code...
// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

const API_URL = "http://localhost:5000/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const body = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) return setMessage(data.message || "Something went wrong");

      login(data.token, data.user);
      setMessage(
        isLogin
          ? "✅ Login successful! Redirecting..."
          : "✅ Signup successful! Welcome! Redirecting..."
      );
      setTimeout(() => navigate("/"), 1000);
    } catch {
      setMessage("❌ Server error. Please try again later.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    try {
      const res = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.user);
        setMessage("✅ Google login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.message || "❌ Google login failed");
      }
    } catch {
      setMessage("❌ Google login failed");
    }
  };

  const handleGoogleError = () => setMessage("❌ Google Login Failed");

  return (
    <AuthLayout
      isLogin={isLogin}
      form={form}
      showPassword={showPassword}
      message={message}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      setShowPassword={setShowPassword}
      toggleAuthMode={() => {
        setIsLogin(!isLogin);
        setMessage("");
      }}
      onGoogleSuccess={handleGoogleSuccess}
      onGoogleError={handleGoogleError}
    />
  );
}

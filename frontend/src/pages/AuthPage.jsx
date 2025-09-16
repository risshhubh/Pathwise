import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import LiquidEther from "../components/LiquidEther"; // 1. Import the effect

const API_URL = "http://localhost:5000/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const body = isLogin ? { email: form.email, password: form.password } : form;
      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.message || "Something went wrong");
      if (isLogin && data.token) {
        // After login, fetch user profile to get the correct name
        let userInfo = { name: '', email: form.email };
        try {
          const profileRes = await fetch("http://localhost:5000/api/user/profile", {
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            userInfo = {
              name: profileData.name || '',
              email: profileData.email || form.email
            };
          } else {
            // fallback: use signup name from localStorage
            const signupData = localStorage.getItem("signupData");
            if (signupData) {
              const parsedSignup = JSON.parse(signupData);
              userInfo.name = parsedSignup.name || '';
            }
          }
        } catch (err) {
          // fallback: use signup name from localStorage
          const signupData = localStorage.getItem("signupData");
          if (signupData) {
            const parsedSignup = JSON.parse(signupData);
            userInfo.name = parsedSignup.name || '';
          }
        }
        login(data.token, userInfo);
        localStorage.setItem("userData", JSON.stringify(userInfo));
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else if (!isLogin) {
        // After successful signup, automatically try to log in
        try {
          const loginRes = await fetch(API_URL + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email: form.email, 
              password: form.password 
            }),
          });
          const loginData = await loginRes.json();
          
          if (loginRes.ok && loginData.token) {
            // Store user data and log them in
            // Save signup name for fallback on login
            localStorage.setItem("signupData", JSON.stringify({
              name: form.name,
              email: form.email
            }));
            localStorage.setItem("userData", JSON.stringify({
              name: form.name,
              email: form.email
            }));
            login(loginData.token, {
              name: form.name,
              email: form.email
            });
            setMessage("Signup successful! Redirecting...");
            setTimeout(() => navigate("/"), 1000);
          } else {
            // If auto-login fails, show message and redirect to login
            setMessage("Signup successful! Please login to continue");
            setForm(prev => ({ ...prev, password: "" }));
            setTimeout(() => setIsLogin(true), 1000);
          }
        } catch (err) {
          // If auto-login fails, fall back to manual login
          setMessage("Signup successful! Please login to continue");
          setForm(prev => ({ ...prev, password: "" }));
          setTimeout(() => setIsLogin(true), 1000);
        }
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    // 2. Add `relative` and `overflow-hidden` for positioning
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* 3. Add LiquidEther in a full-screen div behind everything else */}
      <div className="absolute inset-0 z-0">
        <LiquidEther />
      </div>

      {/* 4. Add `relative z-10` and a semi-transparent background to the form container */}
      <div className="max-w-md w-full bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-10 shadow-2xl relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
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
        <button
          className="mt-6 text-blue-300 hover:underline cursor-pointer"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
        {message && <div className="mt-4 text-red-400">{message}</div>}
      </div>
    </div>
  );
}
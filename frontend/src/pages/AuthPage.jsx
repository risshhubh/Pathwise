import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import LiquidEther from "../components/LiquidEther";
// ✅ Import the GoogleLogin component
import { GoogleLogin } from "@react-oauth/google";

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
      if (!res.ok) {
        return setMessage(data.message || "Something went wrong");
      }

      if (isLogin) {
        // The /login endpoint now returns user data, so no need for another fetch
        login(data.token, data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        // After signup, prompt user to log in
        setMessage("Signup successful! Please login to continue.");
        setIsLogin(true);
        setForm({ name: "", email: form.email, password: "" });
      }
    } catch {
      setMessage("Server error. Please try again later.");
    }
  };
  
  // ❌ The useGoogleLogin hook is no longer needed

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <LiquidEther />
      </div>

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

        {/* Separator */}
        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* ✅ Replace custom button with the GoogleLogin component */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const idToken = credentialResponse.credential;
              try {
                const res = await fetch(`${API_URL}/google-login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token: idToken }), // Send the ID Token
                });

                const data = await res.json();
                if (res.ok && data.token) {
                  login(data.token, data.user);
                  localStorage.setItem("userData", JSON.stringify(data.user));
                  setMessage("Google login successful! Redirecting...");
                  setTimeout(() => navigate("/"), 1000);
                } else {
                  setMessage(data.message || "Google login failed");
                }
              } catch (err) {
                console.error("Google login fetch error:", err);
                setMessage("Google login failed");
              }
            }}
            onError={() => {
              setMessage("Google Login Failed");
            }}
            theme="outline"
            size="large"
            shape="pill"
          />
        </div>

        <button
          className="w-full text-center mt-6 text-blue-300 hover:underline cursor-pointer"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </button>

        {message && (
          <div className="mt-4 text-center text-red-400">{message}</div>
        )}
      </div>
    </div>
  );
}
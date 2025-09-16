import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ use jwt-decode for all tokens

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to get token from localStorage on initial load
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // ✅ Use jwtDecode for both backend JWT & Google ID token
        const decoded = jwtDecode(token);

        const name =
          decoded.name ||
          (decoded.given_name
            ? `${decoded.given_name} ${decoded.family_name || ""}`.trim()
            : "");
        const email = decoded.email || "";

        setUser({ name, email });
      } catch (e) {
        // If decoding fails, fallback to stored userData
        const userData =
          JSON.parse(localStorage.getItem("userData")) ||
          JSON.parse(localStorage.getItem("signupData") || "{}");

        if (userData?.email) {
          setUser({
            name: userData.name || "",
            email: userData.email || "",
          });
        }
      }
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("signupData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ use jwt-decode for all tokens

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to get user data from localStorage on initial load
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    
    console.log("AuthContext useEffect - token:", !!token, "userData:", !!userData);
    
    if (token && userData) {
      try {
        // Parse the stored user data (this contains name, email, picture)
        const parsedUserData = JSON.parse(userData);
        console.log("Parsed user data:", parsedUserData);
        
        if (parsedUserData?.email) {
          setUser({
            name: parsedUserData.name || "",
            email: parsedUserData.email || "",
            picture: parsedUserData.picture || "",
          });
          console.log("User set from localStorage:", parsedUserData.name);
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
        // If parsing fails, try to decode token as fallback
        try {
          const decoded = jwtDecode(token);
          const name =
            decoded.name ||
            (decoded.given_name
              ? `${decoded.given_name} ${decoded.family_name || ""}`.trim()
              : "");
          const email = decoded.email || "";

          setUser({ name, email });
        } catch (tokenError) {
          console.error("Error decoding token:", tokenError);
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

import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ use jwt-decode for all tokens

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const inactivityTimerRef = useRef(null);
  const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour in ms

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT);
  };

  const handleUserActivity = () => {
    if (user) {
      resetInactivityTimer();
    }
  };

  useEffect(() => {
    // Try to get user data from localStorage on initial load
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        // Parse the stored user data (this contains name, email, picture)
        const parsedUserData = JSON.parse(userData);

        if (parsedUserData?.email) {
          setUser({
            name: parsedUserData.name || "",
            email: parsedUserData.email || "",
            picture: parsedUserData.picture || "",
            phone: parsedUserData.phone || "",
            location: parsedUserData.location || "",
            course: parsedUserData.course || "",
            interviewsCompleted: parsedUserData.interviewsCompleted || 0,
            averageScore: parsedUserData.averageScore || 0,
          });
        }
      } catch (e) {
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
          // Silent fail
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      resetInactivityTimer();
      // Add event listeners for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true);
        });
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }
  }, [user]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    const userObj = {
      name: userData.name || "",
      email: userData.email || "",
      picture: userData.picture || "",
      phone: userData.phone || "",
      location: userData.location || "",
      course: userData.course || "",
      interviewsCompleted: userData.interviewsCompleted || 0,
      averageScore: userData.averageScore || 0,
    };
    setUser(userObj);
    // Smooth transition - return user object for immediate state update
    return userObj;
  };

  const logout = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
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

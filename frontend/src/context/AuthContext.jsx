import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to get user data from localStorage on initial load
    const token = localStorage.getItem('token');
    if (token) {
      let name = '';
      let email = '';
      try {
        // Decode JWT token to get user info
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        name = tokenPayload.name || '';
        email = tokenPayload.email || '';
      } catch (e) {
        // If token doesn't have name, fallback to localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          name = parsed.name || '';
          email = parsed.email || '';
        } else {
          const signupData = localStorage.getItem('signupData');
          if (signupData) {
            const parsedSignup = JSON.parse(signupData);
            name = parsedSignup.name || '';
            email = parsedSignup.email || '';
          }
        }
      }
      setUser({ name, email });
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
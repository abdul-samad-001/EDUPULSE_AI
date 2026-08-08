import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser());

  // Broadcast token to Extension on mount / refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.postMessage({ type: "EDUPULSE_AUTH_TOKEN", token }, "*");
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    window.postMessage({ type: "EDUPULSE_AUTH_TOKEN", token }, "*");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

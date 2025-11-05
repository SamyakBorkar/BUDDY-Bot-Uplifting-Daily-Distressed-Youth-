import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("buddy_user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("buddy_user", JSON.stringify(user));
    else localStorage.removeItem("buddy_user");
  }, [user]);

  const login = (userObj) => setUser(userObj);
  const logout = () => {
    setUser(null);
    localStorage.removeItem("buddy_token");
    localStorage.removeItem("buddy_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

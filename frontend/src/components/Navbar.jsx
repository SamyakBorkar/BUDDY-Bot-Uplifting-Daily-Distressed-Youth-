import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white px-6 py-4 shadow-2xl border-b border-purple-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold cursor-pointer bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-transform" onClick={() => navigate("/")}>
          ✨ BUDDY
        </h1>
        <div className="flex items-center space-x-2">
          <Link to="/" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">Home</Link>
          {!user && <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">Login</Link>}
          {!user && <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg">Get Started</Link>}
          {user && <Link to="/dashboard" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">Dashboard</Link>}
          {user && <Link to="/coach" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">AI Coach</Link>}
          {user && <Link to="/profile" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">Profile</Link>}
          {user && (
            <button onClick={logout} className="ml-2 bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}

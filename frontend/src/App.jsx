import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import CrisisSupport from "./pages/CrisisSupport";
import Profile from "./pages/Profile";
import Coach from "./pages/Coach";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach"
            element={
              <ProtectedRoute>
                <Coach />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 p-6 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2">
          <span className="text-purple-400">❤️</span>
          <span>© {new Date().getFullYear()} BUDDY - Your AI Companion for Well-being</span>
        </div>
      </footer>
    </div>
  );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        Buddy
      </h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        {!user && <Link to="/login" className="hover:underline">Login</Link>}
        {!user && <Link to="/register" className="hover:underline">Register</Link>}
        {user && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
        {user && <Link to="/coach" className="hover:underline">Coach</Link>}
        {user && <Link to="/profile" className="hover:underline">Profile</Link>}
        {user && (
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        )}
      </div>
    </nav>
  );
}

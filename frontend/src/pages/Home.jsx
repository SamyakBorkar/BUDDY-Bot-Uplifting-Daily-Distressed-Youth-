import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold mb-4">BUDDY — AI Companion for Student Well-being</h1>
      <p className="text-lg text-gray-600 mb-6">
        Track moods, chat with an AI coping coach, and get help when you need it.
      </p>
      <div className="space-x-4">
        <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded">Get Started</Link>
        <Link to="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded">Login</Link>
      </div>
    </div>
  );
}

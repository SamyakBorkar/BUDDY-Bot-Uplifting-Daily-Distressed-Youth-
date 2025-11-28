import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <div className="inline-block mb-6 px-6 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
          <span className="text-purple-300 text-sm font-semibold">🎯 Your Mental Health Matters</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
          BUDDY
        </h1>
        <p className="text-2xl text-gray-300 mb-4 font-light">
          AI Companion for Student Well-being
        </p>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          Track your moods, chat with an empathetic AI coach, and access support whenever you need it. Your journey to better mental health starts here.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
            Get Started Free
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </Link>
          <Link to="/login" className="px-8 py-4 border-2 border-purple-500/50 text-purple-300 rounded-xl font-semibold text-lg hover:bg-purple-500/10 transition-all duration-300 hover:border-purple-400">
            Login
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-16 px-4">
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-white mb-3">AI Coach Chat</h3>
          <p className="text-gray-400">Chat with an empathetic AI companion trained to provide coping strategies and emotional support 24/7.</p>
        </div>
        <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 p-8 rounded-2xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:scale-105">
          <div className="text-4xl mb-4">🎭</div>
          <h3 className="text-xl font-bold text-white mb-3">Quick Mood Logging</h3>
          <p className="text-gray-400">One-tap mood check-ins with emoji buttons. Track your emotional patterns over time with AI analysis.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105">
          <div className="text-4xl mb-4">🆘</div>
          <h3 className="text-xl font-bold text-white mb-3">Crisis Support</h3>
          <p className="text-gray-400">Immediate access to emergency resources and automatic alerts when you need help the most.</p>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { getMoodLogs } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import MoodChart from "../components/MoodChart";

export default function Dashboard() {
  const { user } = useAuth();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMoodLogs(user._id);
        const logs = data.moodLogs || data;
        setMoods(Array.isArray(logs) ? logs : []);
      } catch (err) {
        console.error("Failed to fetch mood logs", err);
        setMoods([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchData();
  }, [user]);

  // Calculate stats
  const thisWeekMoods = moods.filter(m => {
    const logDate = new Date(m.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  });

  const todayMoods = moods.filter(m => {
    const logDate = new Date(m.date);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}! 👋</h2>
        <p className="text-gray-400 text-lg">Here's an overview of your emotional well-being</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 p-6 rounded-2xl border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm font-medium">Total Entries</h3>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-3xl font-bold text-white">{moods?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 p-6 rounded-2xl border border-pink-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm font-medium">This Week</h3>
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-3xl font-bold text-white">{thisWeekMoods?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 p-6 rounded-2xl border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm font-medium">Today</h3>
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-3xl font-bold text-white">{todayMoods?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Check-ins today</p>
            </div>
          </div>

          {/* Mood Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Week View */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">📈 Week Overview</h3>
              <MoodChart data={thisWeekMoods} type="week" />
            </div>

            {/* Day View */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">📆 Daily Breakdown</h3>
              <MoodChart data={moods} type="day" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Link to="/coach" className="group bg-gradient-to-br from-purple-900/40 to-purple-800/20 p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Talk to AI Coach</h3>
                  <p className="text-gray-400">Get support and log your mood</p>
                </div>
                <span className="text-4xl group-hover:scale-110 transition-transform">💬</span>
              </div>
            </Link>
            <Link to="/profile" className="group bg-gradient-to-br from-pink-900/40 to-pink-800/20 p-6 rounded-2xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Your Profile</h3>
                  <p className="text-gray-400">View and manage your account</p>
                </div>
                <span className="text-4xl group-hover:scale-110 transition-transform">👤</span>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

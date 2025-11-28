// src/pages/MoodTracker.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { analyzeMood } from "../services/ai";
import { logMood, getMoodLogs, sendSOS } from "../services/auth";

export default function MoodTracker() {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null); // { label, score }
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysing, setAnalysing] = useState(false);

  // fetch history
  const fetchLogs = async () => {
    if (!userId) return;
    try {
      const res = await getMoodLogs(userId);
      // backend might return { moodLogs } or an array
      const data = res.moodLogs || res;
      setLogs(Array.isArray(data) ? data.slice().reverse() : []);
    } catch (err) {
      console.error("fetchLogs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [userId]);

  const handleAnalyzeAndSave = async () => {
    if (!userId) {
      alert("Please login to log your mood");
      return;
    }
    if (!text.trim()) return;
    setAnalysing(true);
    try {
      // 1) analyze sentiment locally
      const res = await analyzeMood(text);
      // res: { label: "POSITIVE"|"NEGATIVE", score: 0-1 }
      setAnalysis(res);

      // map to mood string (you can change mapping)
      const moodLabel = res.label ? res.label.toLowerCase() : "neutral";
      const moodToSave = `${moodLabel} (${Math.round(res.score * 100)}%)`;

      // 2) save mood to backend
      const saved = await logMood({ userId, mood: moodToSave });
      // backend may return array of moodLogs or user object
      const savedLogs = saved.moodLogs || saved;
      setLogs(Array.isArray(savedLogs) ? savedLogs.slice().reverse() : []);
    } catch (err) {
      console.error("analyze+save error", err);
      alert("Something went wrong while analyzing/saving your mood.");
    } finally {
      setAnalysing(false);
      setText("");
    }
  };

  // simple crisis heuristic (strong negative)
  const isCrisisSuggested = () => {
    if (!analysis) return false;
    return analysis.label === "NEGATIVE" && analysis.score >= 0.9;
  };

  const handleSendSOS = async () => {
    if (!userId) { alert("Login required"); return; }
    if (!confirm("Send SOS to your counselor? This will notify them with your recent mood logs.")) return;
    setLoading(true);
    try {
      const payload = {
        userId,
        message: `SOS from ${user?.name || "student"} via MoodTracker. Latest entry: ${text || "(just sent)"}`
      };
      await sendSOS(payload); // uses your services/auth.js -> POST /users/sos
      alert("SOS sent. Counselor will be notified.");
    } catch (err) {
      console.error("SOS failed", err);
      alert("Failed to send SOS. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Daily Mood Check-In 🎭</h2>
        <p className="text-gray-400 text-lg">Quick daily logging and sentiment tracking</p>
      </div>

      {/* Quick Mood Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { emoji: '😊', label: 'Great', mood: 'positive (95%)' },
          { emoji: '🙂', label: 'Good', mood: 'positive (75%)' },
          { emoji: '😐', label: 'Okay', mood: 'neutral (50%)' },
          { emoji: '😔', label: 'Down', mood: 'negative (70%)' },
          { emoji: '😢', label: 'Very Down', mood: 'negative (90%)' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={async () => {
              if (!userId) return alert("Please login");
              try {
                const saved = await logMood({ userId, mood: `${item.label} - ${item.mood}` });
                const savedLogs = saved.moodLogs || saved;
                setLogs(Array.isArray(savedLogs) ? savedLogs.slice().reverse() : []);
                alert(`Mood logged: ${item.label}`);
              } catch (err) {
                console.error(err);
              }
            }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 hover:from-purple-900/40 hover:to-pink-900/40 border border-gray-700 hover:border-purple-500/40 p-6 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-5xl mb-2">{item.emoji}</div>
            <div className="text-white font-semibold">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Detailed Entry Card */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20">
        <h3 className="text-2xl font-bold text-white mb-4">📝 Detailed Entry (Optional)</h3>
        <p className="text-gray-400 mb-4">Want to write more? Add context to your mood for better tracking.</p>
        <textarea
          rows={3}
          className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
          placeholder="Optional: Add details about your day or what's affecting your mood..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAnalyzeAndSave}
            disabled={analysing || !text.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analysing ? "Analyzing..." : "📊 Analyze & Save"}
          </button>

          {isCrisisSuggested() && (
            <button
              onClick={handleSendSOS}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {loading ? "Sending..." : "🆘 Send SOS"}
            </button>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-6 p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h4 className="text-lg font-semibold text-white">Sentiment Analysis</h4>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Detected Sentiment</p>
              <p className="text-xl font-bold text-purple-400">
                {analysis.label} ({Math.round(analysis.score * 100)}% confidence)
              </p>
            </div>
            {isCrisisSuggested() && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400 font-semibold">
                  ⚠️ Strong negative sentiment detected. Consider talking to our AI Coach or sending SOS if needed.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Need to Talk? CTA */}
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 rounded-2xl border border-blue-500/20 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Need someone to talk to?</h3>
          <p className="text-gray-400">Our AI Coach is available 24/7 for deeper conversations</p>
        </div>
        <Link 
          to="/coach" 
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg whitespace-nowrap"
        >
          Talk to Coach →
        </Link>
      </div>

      {/* Recent Mood Logs */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Your Mood History 📈</h3>
          <span className="text-sm text-gray-400">{logs.length} total entries</span>
        </div>
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400">No entries yet. Log your first mood above!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {logs.map((l, idx) => (
              <li key={idx} className="bg-gray-900/50 p-5 border border-gray-700 rounded-xl hover:border-purple-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(l.date).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <p className="text-lg text-purple-400 font-semibold">{l.mood}</p>
                  </div>
                  <span className="text-2xl">
                    {l.mood.toLowerCase().includes('great') || l.mood.toLowerCase().includes('good') || l.mood.toLowerCase().includes('positive') ? '😊' : 
                     l.mood.toLowerCase().includes('down') || l.mood.toLowerCase().includes('negative') ? '😔' : '😐'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

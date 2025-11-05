// src/pages/MoodTracker.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { analyzeMood, generateAdvice } from "../services/ai";
import { logMood, getMoodLogs, sendSOS } from "../services/auth";

export default function MoodTracker() {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null); // { label, score }
  const [advice, setAdvice] = useState("");
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

      // 3) generate a short coping advice (best-effort)
      const advicePrompt = `Provide 1-2 friendly coping tips for someone who says: "${text}"`;
      const gen = await generateAdvice(advicePrompt);
      setAdvice(gen || "Try some deep breathing, a short walk, or talking to a friend.");
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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">How are you feeling?</h3>
        <textarea
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Write a sentence or two about how you feel..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-3 mt-3">
          <button
            onClick={handleAnalyzeAndSave}
            disabled={analysing}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {analysing ? "Analyzing..." : "Analyze & Save"}
          </button>

          {isCrisisSuggested() && (
            <button
              onClick={handleSendSOS}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              {loading ? "Sending..." : "Send SOS"}
            </button>
          )}
        </div>

        {analysis && (
          <div className="mt-4 p-3 bg-gray-50 border rounded">
            <div className="text-sm text-gray-600">Sentiment: <strong>{analysis.label}</strong> ({Math.round(analysis.score * 100)}%)</div>
            {advice && (
              <div className="mt-2">
                <strong>Quick tip:</strong>
                <p className="mt-1 whitespace-pre-wrap">{advice}</p>
              </div>
            )}
            {isCrisisSuggested() && (
              <div className="mt-3 text-sm text-red-700">
                Strong negative sentiment detected. If you feel unsafe, please send SOS or contact local emergency services.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Recent mood logs</h3>
        {logs.length === 0 ? (
          <div className="text-sm text-gray-500">No entries yet.</div>
        ) : (
          <ul className="space-y-3">
            {logs.map((l, idx) => (
              <li key={idx} className="p-3 border rounded">
                <div className="text-sm text-gray-500">{new Date(l.date).toLocaleString()}</div>
                <div className="mt-1">{l.mood}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

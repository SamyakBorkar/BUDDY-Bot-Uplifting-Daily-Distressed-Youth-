// frontend/src/pages/Coach.jsx
import React, { useState, useRef, useEffect } from "react";
import API from "../services/api"; // axios instance with baseURL
import { useAuth } from "../context/AuthContext";
import { logMood } from "../services/auth";
import SOSPopup from "../components/SOSPopup";

export default function Coach() {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hi — I'm Buddy. How are you feeling today?" }]);
  const [input, setInput] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickMood = async (moodEmoji, moodLabel, moodValue) => {
    if (!userId) return;
    try {
      await logMood({ userId, mood: `${moodLabel} - ${moodValue}` });
      setMessages(prev => [...prev, 
        { sender: "user", text: `${moodEmoji} ${moodLabel}` },
        { sender: "bot", text: `Thanks for sharing! I see you're feeling ${moodLabel.toLowerCase()}. Would you like to talk about it?` }
      ]);
      setShowMoodPicker(false);
    } catch (err) {
      console.error("Failed to log mood", err);
    }
  };

  const sendToServer = async (text) => {
    const payload = { userId, userName: user?.name, message: text };
    const res = await API.post("/chat", payload); // baseURL + /chat
    return res.data;
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || blocked) return;

    setMessages(prev => [...prev, { sender: "user", text: trimmed }]);
    setInput("");

    try {
      const data = await sendToServer(trimmed);
      setMessages(prev => [...prev, { sender: "bot", text: data.response }]);

      if (data.alertTriggered) {
        setBlocked(true);
        setShowSOS(true);
      }
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages(prev => [...prev, { sender: "bot", text: "Sorry, something went wrong. Try again later." }]);
    }
  };

  const closeSOS = () => setShowSOS(false);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-white mb-2">AI Coach & Mood Tracker 💬🎭</h2>
        <p className="text-gray-400">Your empathetic companion for emotional support and daily check-ins</p>
      </div>

      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/20 h-[75vh] flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-b border-purple-500/20 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">BUDDY AI</h3>
                <p className="text-sm text-gray-400">Always here to help</p>
              </div>
            </div>
            {!showMoodPicker && (
              <button 
                onClick={() => setShowMoodPicker(true)}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-lg text-sm text-purple-300 transition-all"
              >
                Log Mood 🎭
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Quick Mood Picker */}
          {showMoodPicker && (
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 mb-4">
              <h4 className="text-white font-semibold mb-3 text-center">Quick Mood Check-in</h4>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { emoji: '😊', label: 'Great', value: 'positive (95%)' },
                  { emoji: '🙂', label: 'Good', value: 'positive (75%)' },
                  { emoji: '😐', label: 'Okay', value: 'neutral (50%)' },
                  { emoji: '😔', label: 'Down', value: 'negative (70%)' },
                  { emoji: '😢', label: 'Bad', value: 'negative (90%)' }
                ].map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => handleQuickMood(mood.emoji, mood.label, mood.value)}
                    className="bg-gray-800/50 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 border border-gray-700 hover:border-purple-500/40 p-4 rounded-xl transition-all hover:scale-105"
                  >
                    <div className="text-4xl mb-2">{mood.emoji}</div>
                    <div className="text-white text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowMoodPicker(false)}
                className="mt-3 w-full text-sm text-gray-400 hover:text-gray-300"
              >
                Skip for now
              </button>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
              <div className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                m.sender === "user" 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                  : "bg-gray-800/80 text-gray-100 border border-gray-700"
              }`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-gray-700 bg-gray-900/50 rounded-b-2xl">
          {blocked && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
              <p className="text-red-400 text-sm font-semibold">⚠️ Chat disabled - Emergency alert triggered</p>
            </div>
          )}
          <div className="flex gap-3">
            <input
              disabled={blocked}
              className="flex-1 bg-gray-800/50 border border-gray-700 text-white px-5 py-4 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder-gray-500 disabled:opacity-50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={blocked ? "Chat disabled after crisis alert" : "Type your message..."}
            />
            <button 
              onClick={handleSend} 
              disabled={blocked || !input.trim()} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {showSOS && <SOSPopup onClose={closeSOS} />}
    </div>
  );
}

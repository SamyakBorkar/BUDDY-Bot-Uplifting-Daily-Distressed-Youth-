// frontend/src/pages/Coach.jsx
import React, { useState, useRef, useEffect } from "react";
import API from "../services/api"; // axios instance with baseURL
import { useAuth } from "../context/AuthContext";
import SOSPopup from "../components/SOSPopup";

export default function Coach() {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hi — I'm Buddy. How are you feeling today?" }]);
  const [input, setInput] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white p-4 rounded shadow h-[70vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-2 rounded-lg ${m.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="mt-3 flex">
          <input
            disabled={blocked}
            className="flex-1 border p-2 rounded-l"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={blocked ? "Chat disabled after crisis alert" : "Write something..."}
          />
          <button onClick={handleSend} disabled={blocked} className="bg-blue-600 text-white px-4 rounded-r">Send</button>
        </div>
      </div>

      {showSOS && <SOSPopup onClose={closeSOS} />}
    </div>
  );
}

import React, { useState } from "react";
import { pipeline } from "@xenova/transformers";
import SOSPopup from "../components/SOSPopup";
import { sendSOS } from "../services/auth";
import { useAuth } from "../context/AuthContext";

export default function Coach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([{ from: "bot", text: "Hey there 👋 How are you feeling today?" }]);
  const [input, setInput] = useState("");
  const [showSOS, setShowSOS] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    // Check for suicidal phrases
    if (/suicide|die|kill myself|end it/i.test(input)) {
      setShowSOS(true);
      await sendSOS({ reg_no: user.reg_no, message: input });
      return;
    }

    // Hugging Face local inference
    const generator = await pipeline("text-generation", "Xenova/distilgpt2");
    const output = await generator(input, { max_new_tokens: 30 });
    const reply = output[0]?.generated_text || "I'm here for you ❤️";

    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    setInput("");
  };

  return (
    <div className="p-6 h-[90vh] flex flex-col">
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded">
        {messages.map((msg, i) => (
          <p key={i} className={`my-2 ${msg.from === "bot" ? "text-blue-700" : "text-gray-800 text-right"}`}>
            {msg.text}
          </p>
        ))}
      </div>

      <div className="mt-3 flex">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your feelings..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded-r">
          Send
        </button>
      </div>

      {showSOS && <SOSPopup onClose={() => setShowSOS(false)} />}
    </div>
  );
}

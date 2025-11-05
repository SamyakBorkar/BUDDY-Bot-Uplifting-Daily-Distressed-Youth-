const express = require("express");
const router = express.Router();
const { sendAlertMail } = require("../utils/mailer");
require("dotenv").config();

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message, userId, userName } = req.body;

    // Detect dangerous text
    const dangerWords = ["suicide", "kill myself", "die", "end my life", "finish myself"];
    const alertTriggered = dangerWords.some(word =>
      message.toLowerCase().includes(word)
    );

    if (alertTriggered) {
      const recipients = process.env.COUNSELLOR_EMAILS.split(",");
      const subject = "🚨 Urgent: Student Crisis Detected (Buddy Alert)";
      const text = `
A student may be in distress.

🧑 Name: ${userName || "Unknown"}
🆔 User ID: ${userId || "N/A"}
💬 Message: "${message}"
🕒 Time: ${new Date().toLocaleString()}

Please reach out to this student immediately.
      `;
      await sendAlertMail(recipients, subject, text);

      return res.json({
        response: "⚠️ Crisis detected! We've notified your counselor immediately.",
        alertTriggered: true,
      });
    }

    // Otherwise, respond normally (basic bot)
    const botReply = "I'm here to listen, please tell me more.";
    res.json({ response: botReply, alertTriggered: false });

  } catch (error) {
    console.error("Error in /api/chat:", error.message);
    res.status(500).json({ response: "Sorry, something went wrong. Try again later." });
  }
});

module.exports = router;

// backend/controllers/chatController.js
const User = require("../models/User");
const { sendAlertMail } = require("../utils/mailer");

// tweak these trigger words as needed
const crisisRegex = /(i want to die|kill myself|kill me|end my life|suicide|i can't go on|hurt myself|finish myself|i will die|i want to die)/i;

const DEFAULT_COUNSELLORS = (process.env.COUNSELLOR_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);

exports.handleChat = async (req, res) => {
  try {
    const { userId, userName, message } = req.body;
    if (!message) return res.status(400).json({ message: "message required" });

    // find user if provided (to save logs & find reg_no)
    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }

    // If user is flagged -> block chat
    if (user && user.isFlagged) {
      return res.status(403).json({ response: "Your account is flagged for crisis; chat is disabled. Help is on the way.", alertTriggered: true });
    }

    // immediate client-side-level detection should already be done,
    // but we run server-side detection as authoritative
    if (crisisRegex.test(message)) {
      // send emails to counsellors (from env or default)
      const counsellors = DEFAULT_COUNSELLORS.length ? DEFAULT_COUNSELLORS : [process.env.COUNSELLOR_EMAIL].filter(Boolean);
      const recipients = counsellors.length ? counsellors : (user ? [user.email] : []);
      const subject = `URGENT: Possible suicide/self-harm alert for ${userName || (user && user.name) || "User"}`;
      const text = [
        `User: ${userName || (user && user.name) || "Unknown"}`,
        `Reg No: ${user?.reg_no || "N/A"}`,
        `Email: ${user?.email || "N/A"}`,
        ``,
        `Detected message: ${message}`,
        ``,
        `Recent moods (last 10):`,
        ...((user?.moodLogs || []).slice(-10).map(m => `${new Date(m.date).toLocaleString()}: ${m.mood}`) || ["No mood logs"])
      ].join("\n");

      // send email (do not await too long— but await for success here)
      try {
        await sendAlertMail(recipients, subject, text);
      } catch (mailErr) {
        console.error("sendAlertMail failed:", mailErr);
        // continue to log even if mail fails
      }

      // Save SOS log & flag the user
      if (user) {
        user.sosLogs = user.sosLogs || [];
        user.sosLogs.push({ message, sentBy: "auto-detect" });
        user.isFlagged = true;
        await user.save();
      }

      return res.json({
        response: "We detected language that indicates you might be in immediate danger. We have notified your counsellor and help will reach out soon.",
        alertTriggered: true
      });
    }

    // If not crisis, you can implement normal bot logic here or fallback
    // For now we return a neutral reply — frontend can later call transformers.js directly
    const reply = `Thanks for sharing. Could you tell me a bit more about that?`;
    // Optionally save non-crisis user message as mood or history if wanted

    return res.json({ response: reply, alertTriggered: false });
  } catch (err) {
    console.error("chatController.handleChat err:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

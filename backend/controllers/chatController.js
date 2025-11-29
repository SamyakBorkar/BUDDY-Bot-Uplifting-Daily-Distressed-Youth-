// backend/controllers/chatController.js
const User = require("../models/User");
const { sendAlertMail } = require("../utils/mailer");

// HIGH STRESS - Crisis keywords (Level 3)
const crisisRegex = /(i want to die|kill myself|kill me|end my life|suicide|i can't go on|hurt myself|finish myself|i will die|self harm|cut myself|overdose)/i;

// MEDIUM STRESS - Anxiety/stress keywords (Level 2)
const mediumStressRegex = /(anxious|stressed|panic|overwhelmed|can't handle|too much|breaking down|depressed|lonely|hopeless|worried|scared|afraid|crying|exhausted|burnt out|can't sleep)/i;

// LOW/NORMAL STRESS - General emotions (Level 1)
const normalStressRegex = /(sad|upset|tired|bored|confused|frustrated|annoyed|disappointed|unmotivated|down|blue)/i;

// Load counsellor emails list from .env (comma separated)
const DEFAULT_COUNSELLORS = (process.env.COUNSELLOR_EMAILS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// Warn at startup if none configured
if (!DEFAULT_COUNSELLORS.length) {
  console.warn("⚠️ No counsellor emails configured. Set COUNSELLOR_EMAILS in .env (comma separated list).");
}

// Motivational quotes for normal stress
const motivationalQuotes = [
  "Remember, tough times don't last, but tough people do. You've got this! 💪",
  "Every day may not be good, but there's something good in every day. Keep your head up! 🌟",
  "You are stronger than you think. This feeling is temporary, and you will get through it. ✨",
  "Small steps forward are still progress. Be proud of yourself for showing up today! 🌈",
  "It's okay to have bad days. Tomorrow is a fresh start with new possibilities. 🌅",
  "You've survived 100% of your worst days so far. You're doing amazing! 💙",
  "Difficult roads often lead to beautiful destinations. Keep going! 🚀",
  "Your mental health is a priority. It's okay to take a break and breathe. 🌸"
];

// Yoga and relaxation resources for medium stress
const relaxationTips = [
  {
    tip: "Try the 4-7-8 breathing technique: Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 3-4 times.",
    video: "https://www.youtube.com/watch?v=gz4G31LGyog"
  },
  {
    tip: "5-minute guided meditation for anxiety relief:",
    video: "https://www.youtube.com/watch?v=O-6f5wQXSu8"
  },
  {
    tip: "Simple yoga stretches for stress relief (10 minutes):",
    video: "https://www.youtube.com/watch?v=COp7BR_Dvps"
  },
  {
    tip: "Progressive muscle relaxation technique - tense and release each muscle group:",
    video: "https://www.youtube.com/watch?v=86HUcX8ZtAk"
  },
  {
    tip: "Calming yoga for anxiety and stress (15 minutes):",
    video: "https://www.youtube.com/watch?v=_zbtKeeAa-Y"
  },
  {
    tip: "Box breathing exercise: Inhale 4, hold 4, exhale 4, hold 4. Great for panic attacks!",
    video: "https://www.youtube.com/watch?v=tEmt1Znux58"
  }
];

// Function to detect stress level
function detectStressLevel(message) {
  if (crisisRegex.test(message)) return 'HIGH';
  if (mediumStressRegex.test(message)) return 'MEDIUM';
  if (normalStressRegex.test(message)) return 'NORMAL';
  return 'NEUTRAL';
}

exports.handleChat = async (req, res) => {
  try {
    const { userId, userName, message } = req.body;
    console.log("📥 Received chat request:", { userId, userName, message });
    
    if (!message) return res.status(400).json({ message: "message required" });

    // find user if provided (to save logs & find reg_no)
    let user = null;
    if (userId) {
      try {
        user = await User.findById(userId);
        console.log("Found user:", user ? { name: user.name, reg_no: user.reg_no, email: user.email } : "User not found");
      } catch (userErr) {
        console.error("Error finding user:", userErr);
      }
    }

    // If user is flagged -> inform but don't block (counsellor can help via chat)
    // Removed blocking to allow continued support
    // if (user && user.isFlagged) {
    //   return res.status(403).json({ 
    //     response: "Your account is flagged for crisis; chat is disabled. Help is on the way.", 
    //     alertTriggered: true,
    //     stressLevel: 'HIGH'
    //   });
    // }

    // Detect stress level
    const stressLevel = detectStressLevel(message);
    console.log(`Detected stress level: ${stressLevel} for message: "${message}"`);

    // ========== HIGH STRESS (CRISIS) ==========
    if (stressLevel === 'HIGH') {
      // Send emails ONLY to counsellors defined in .env (never to student)
      const recipients = DEFAULT_COUNSELLORS;
      if (!recipients.length) {
        console.warn("🚫 Skipping alert email: no counsellor recipients configured in COUNSELLOR_EMAILS.");
      }
      
      const regNo = user?.reg_no || "NOT AVAILABLE";
      const studentName = userName || (user && user.name) || "Unknown";
      const studentEmail = user?.email || "N/A";
      
      const subject = `🚨 URGENT: Student in Distress - Registration Number: ${regNo}`;
      const text = [
        `==============================================`,
        `🚨 EMERGENCY ALERT - IMMEDIATE ACTION REQUIRED`,
        `==============================================`,
        ``,
        `📋 STUDENT DETAILS:`,
        ``,
        `Name: ${studentName}`,
        `Registration Number: ${regNo}`,
        `Email: ${studentEmail}`,
        `User ID: ${user?._id || "N/A"}`,
        `Alert Time: ${new Date().toLocaleString()}`,
        ``,
        `==============================================`,
        `⚠️ DETECTED MESSAGE:`,
        `"${message}"`,
        `==============================================`,
        ``,
        `📊 Recent mood logs (last 10):`,
        ...((user?.moodLogs || []).slice(-10).map(m => `  • ${new Date(m.date).toLocaleString()}: ${m.mood}`) || ["  No mood logs available"]),
        ``,
        `Please reach out to this student immediately.`
      ].join("\n");

      console.log("📧 Sending alert email for:", { studentName, regNo, studentEmail });
      console.log("📧 Recipients:", recipients);
      console.log("📧 Subject:", subject);

      // send email (do not await too long— but await for success here)
      try {
        await sendAlertMail(recipients, subject, text);
        console.log("✅ Alert email sent successfully");
      } catch (mailErr) {
        console.error("❌ sendAlertMail failed:");
        console.error("Error message:", mailErr.message);
        console.error("Full error:", mailErr);
        // continue to log even if mail fails
      }

      // Save SOS log (removed permanent flagging to allow continued support)
      if (user) {
        user.sosLogs = user.sosLogs || [];
        user.sosLogs.push({ message, sentBy: "auto-detect" });
        // Removed: user.isFlagged = true; 
        // User can still chat - counsellor will reach out directly
        await user.save();
      }

      return res.json({
        response: "I'm really concerned about what you've shared with me. Your safety is the top priority. I've notified your counselor, and they will reach out to you soon. Please remember you're not alone. If you're in immediate danger, please call emergency services at 112 or contact a crisis helpline. You matter, and help is available. 💙",
        alertTriggered: true,
        stressLevel: 'HIGH'
      });
    }

    // ========== MEDIUM STRESS (ANXIETY/OVERWHELM) ==========
    if (stressLevel === 'MEDIUM') {
      const randomTip = relaxationTips[Math.floor(Math.random() * relaxationTips.length)];
      
      const response = `I can sense you're going through a tough time right now, and that's completely valid. Let's try to ease some of that stress together. 🌿\n\n${randomTip.tip}\n\n🎥 Watch here: ${randomTip.video}\n\nTake a few minutes for yourself. You deserve this break. Would you like to talk more about what's bothering you, or would you prefer another relaxation technique?`;
      
      return res.json({
        response,
        alertTriggered: false,
        stressLevel: 'MEDIUM',
        resource: randomTip
      });
    }

    // ========== NORMAL/LOW STRESS ==========
    if (stressLevel === 'NORMAL') {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      
      const response = `I hear you, and it's okay to feel this way. Everyone has ups and downs. 🌈\n\n${randomQuote}\n\nRemember, you're doing better than you think! Is there something specific that's been on your mind? I'm here to listen.`;
      
      return res.json({
        response,
        alertTriggered: false,
        stressLevel: 'NORMAL'
      });
    }

    // ========== NEUTRAL (NO STRESS DETECTED) ==========
    // Contextual responses based on common topics
    const lowerMsg = message.toLowerCase();
    let reply;

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      reply = `Hello! 👋 I'm BUDDY, your AI companion. I'm here to listen and support you. How are you feeling today?`;
    } else if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
      reply = `You're very welcome! I'm always here for you. Remember, taking care of your mental health is a sign of strength. 💪 Is there anything else on your mind?`;
    } else if (lowerMsg.includes('help') || lowerMsg.includes('support')) {
      reply = `I'm here to help! You can:\n• Share how you're feeling\n• Ask for coping strategies\n• Get relaxation techniques\n• Just chat about what's on your mind\n\nWhat would you like to talk about?`;
    } else {
      reply = `Thanks for sharing that with me. I'm listening. 💙 Can you tell me more about how you're feeling? I'm here to support you.`;
    }

    return res.json({ 
      response: reply, 
      alertTriggered: false,
      stressLevel: 'NEUTRAL'
    });
    
  } catch (err) {
    console.error("❌ chatController.handleChat error:");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    return res.status(500).json({ 
      message: "Server error",
      error: err.message 
    });
  }
};

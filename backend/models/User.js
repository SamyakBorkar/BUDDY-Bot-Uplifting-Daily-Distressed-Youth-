const mongoose = require("mongoose");

const MoodLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  mood: String,
});

const SosLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  message: String,
  sentBy: { type: String, enum: ["user", "auto-detect"], default: "user" },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reg_no: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  moodLogs: [MoodLogSchema],
  sosLogs: [SosLogSchema],
  isFlagged: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

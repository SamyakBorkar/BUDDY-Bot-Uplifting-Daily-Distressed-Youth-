const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatController");

// POST /api/chat
router.post("/", (req, res, next) => {
  console.log("🔵 Chat route hit!");
  console.log("Request body:", req.body);
  handleChat(req, res, next);
});

module.exports = router;

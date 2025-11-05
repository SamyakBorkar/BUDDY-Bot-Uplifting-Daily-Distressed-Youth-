const express = require('express')
const router = express.Router()
const { registerUser, loginUser, logMood, getMoodLogs, sendSOS } = require('../controllers/userController.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
// router.post('/mood', logMood);
// router.post('/mood/:userId', getMoodLogs);

// Log a mood
router.post('/:userId/mood', logMood);

// Get moods
router.get('/:userId/mood', getMoodLogs);
router.post("/sos", sendSOS);

module.exports = router;

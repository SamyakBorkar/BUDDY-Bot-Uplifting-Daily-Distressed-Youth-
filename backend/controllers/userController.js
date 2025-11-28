const User = require('../models/User.js')
const { sendCounsellorAlert } = require("../utils/emailService");

const registerUser = async (req, res)=>{
    const {name ,reg_no, email, password} = req.body;
    try{
        const userExist = await User.findOne({email});
        if(userExist) return res.status(400).json({message : "User Already Exist"})
    
        const user = await User.create({name, reg_no, email, password})
        return res.status(201).json({user});
        }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

const loginUser = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user || user.password !== password) return res.status(401).json({message: "Invalid Credentials"});

        res.json({user})
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

const logMood = async (req, res) => {
    const { userId, mood } = req.body;
    try {
        const user = await User.findById(userId);
        user.moodLogs.push({ mood });
        await user.save();
        res.json({ moodLogs: user.moodLogs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Mood Logs
const getMoodLogs = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json({ moodLogs: user.moodLogs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendSOS = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    await sendCounsellorAlert(user.reg_no, message);
    res.json({ success: true, message: "Counsellor notified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send SOS" });
  }
};

module.exports = {registerUser, loginUser, logMood, getMoodLogs, sendSOS};
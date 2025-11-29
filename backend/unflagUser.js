// Quick script to unflag users for testing
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function unflagAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buddydb');
    console.log('Connected to MongoDB');
    
    const result = await User.updateMany(
      { isFlagged: true },
      { $set: { isFlagged: false } }
    );
    
    console.log(`✅ Unflagged ${result.modifiedCount} users`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

unflagAll();

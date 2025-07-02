require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 这里可以用本地MongoDB或者Mongo Atlas等
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/youshow_db');
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

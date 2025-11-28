const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  picture: { type: String },
  phone: { type: String },             // 📱 New field
  location: { type: String },          // 📍 New field
  course: { type: String },            // 🎓 New field
  interviewsCompleted: { type: Number, default: 0 }, // 📝 For stats
  averageScore: { type: Number, default: 0 },        // 📊 For stats
  lastActivity: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

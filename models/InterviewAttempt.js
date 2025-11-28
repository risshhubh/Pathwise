const mongoose = require("mongoose");

const interviewAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., "technical", "behavioral", "system-design"
  mode: { type: String, required: true }, // "mcq", "coding", "quiz"
  timestamp: { type: Date, default: Date.now },
  scorePercent: { type: Number }, // for mcq, null for others
  answers: { type: Object }, // store answers object
  report: { type: Object }, // store report object
  plan: { type: Object }, // store practice plan object
});

module.exports = mongoose.model("InterviewAttempt", interviewAttemptSchema);

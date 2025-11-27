const express = require("express");
const router = express.Router();
const InterviewAttempt = require("../models/InterviewAttempt");
const User = require("../models/User");
const auth = require("../middleware/auth");

// POST /api/progress/save-attempt
// Save a new interview attempt and update user stats
router.post("/save-attempt", auth, async (req, res) => {
  try {
    const { type, mode, scorePercent, answers, report, plan } = req.body;
    const userId = req.userId;

    // Create new attempt
    const attempt = new InterviewAttempt({
      userId,
      type,
      mode,
      scorePercent,
      answers,
      report,
      plan,
    });
    await attempt.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      user.interviewsCompleted += 1;
      // Calculate new average score (only for mcq with scorePercent)
      if (scorePercent !== null && scorePercent !== undefined) {
        const prevTotal = (user.averageScore * (user.interviewsCompleted - 1));
        user.averageScore = (prevTotal + scorePercent) / user.interviewsCompleted;
      }
      await user.save();
    }

    // Return updated user stats to the client as well
    const safeUser = {
      name: user.name,
      email: user.email,
      picture: user.picture,
      phone: user.phone || null,
      location: user.location || null,
      course: user.course || null,
      interviewsCompleted: user.interviewsCompleted || 0,
      averageScore: user.averageScore || 0,
    };

    res.status(201).json({ message: "Attempt saved successfully", attemptId: attempt._id, user: safeUser });
  } catch (error) {
    console.error("Error saving attempt:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/progress/attempts
// Fetch user's interview attempts
router.get("/attempts", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const attempts = await InterviewAttempt.find({ userId }).sort({ timestamp: -1 });
    res.json(attempts);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

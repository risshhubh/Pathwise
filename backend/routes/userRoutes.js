const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// 🔹 Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      picture: user.picture,
      phone: user.phone,
      location: user.location,
      course: user.course,
      interviewsCompleted: user.interviewsCompleted || 0,
      averageScore: user.averageScore || 0,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, location, course } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, phone, location, course },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      picture: user.picture,
      phone: user.phone,
      location: user.location,
      course: user.course,
      interviewsCompleted: user.interviewsCompleted || 0,
      averageScore: user.averageScore || 0,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

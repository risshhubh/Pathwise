const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔹 Normal Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, lastActivity: Date.now() });
    await user.save();

    console.log("✅ User created:", { id: user._id, name: user.name, email: user.email });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        picture: user.picture,
        phone: user.phone || null,
        location: user.location || null,
        course: user.course || null,
        interviewsCompleted: user.interviewsCompleted || 0,
        averageScore: user.averageScore || 0,
      },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Normal Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    user.lastActivity = Date.now();
    await user.save();

    console.log("✅ User logged in:", { id: user._id, name: user.name, email: user.email });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        picture: user.picture,
        phone: user.phone || null,
        location: user.location || null,
        course: user.course || null,
        interviewsCompleted: user.interviewsCompleted || 0,
        averageScore: user.averageScore || 0,
      },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Google Login
router.post("/google-login", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        password: null,
        lastActivity: Date.now(),
      });
      await user.save();
    } else {
      user.lastActivity = Date.now();
      await user.save();
    }

    const appToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token: appToken,
      user: {
        name: user.name,
        email: user.email,
        picture: user.picture,
        phone: user.phone || null,
        location: user.location || null,
        course: user.course || null,
        interviewsCompleted: user.interviewsCompleted || 0,
        averageScore: user.averageScore || 0,
      },
    });
  } catch (err) {
    console.error("Google token verification error:", err);
    res.status(400).json({ message: "Invalid Google token", error: err.message });
  }
});

module.exports = router;

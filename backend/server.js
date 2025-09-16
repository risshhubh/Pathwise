const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config(); // ✅ Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 MongoDB connection
mongoose.connect("mongodb://localhost:27017/ai-interviewer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 🔹 User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for Google users
  picture: { type: String },  // Google profile picture
});

const User = mongoose.model("User", userSchema);

// 🔹 Normal Signup
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Normal Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) // Check for password existence
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Use secret from .env file
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { name: user.name, email: user.email, picture: user.picture },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Google Login
// ✅ Initialize client with ID from .env file
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/google-login", async (req, res) => {
  const { token } = req.body; // This is now the ID Token from the frontend
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Verify it's for your app
    });
    const payload = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        password: null, // No password for Google sign-in
      });
      await user.save();
    }

    // Generate our application's JWT
    // ✅ Use secret from .env file
    const appToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token: appToken,
      user: { name: user.name, email: user.email, picture: user.picture },
    });
  } catch (err) {
    console.error("Google token verification error:", err);
    res
      .status(400)
      .json({ message: "Invalid Google token", error: err.message });
  }
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
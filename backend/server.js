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
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

// 🔹 User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for Google users
  picture: { type: String },  // Google profile picture
  lastActivity: { type: Date, default: Date.now } // ⏳ Track last activity
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
    const user = new User({ name, email, password: hashedPassword, lastActivity: Date.now() });
    await user.save();

    console.log("✅ User created in MongoDB:", { id: user._id, name: user.name, email: user.email });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { name: user.name, email: user.email, picture: user.picture },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Normal Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    user.lastActivity = Date.now(); // ⏳ Update activity on login
    await user.save();

    console.log("✅ User logged in from MongoDB:", { id: user._id, name: user.name, email: user.email });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
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
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/google-login", async (req, res) => {
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
        lastActivity: Date.now()
      });
      await user.save();
    } else {
      user.lastActivity = Date.now(); // ⏳ Update activity
      await user.save();
    }

    const appToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token: appToken,
      user: { name: user.name, email: user.email, picture: user.picture },
    });
  } catch (err) {
    console.error("Google token verification error:", err);
    res.status(400).json({ message: "Invalid Google token", error: err.message });
  }
});

// 🔹 Middleware to verify JWT token + inactivity check
const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ⏳ Inactivity check (1 hour)
    const now = Date.now();
    const lastActivity = new Date(user.lastActivity).getTime();
    const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour in ms

    if (now - lastActivity > INACTIVITY_LIMIT) {
      return res.status(401).json({ message: "Session expired due to inactivity" });
    }

    // ✅ Update activity
    user.lastActivity = now;
    await user.save();

    req.userId = user._id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔹 Get user profile
app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      picture: user.picture,
      interviewsCompleted: 0,
      averageScore: 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

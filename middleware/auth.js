const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

    // ✅ Update activity only if >5 minutes since last update to reduce DB writes
    const ACTIVITY_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes in ms
    if (now - lastActivity > ACTIVITY_UPDATE_INTERVAL) {
      user.lastActivity = now;
      await user.save();
    }

    req.userId = user._id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

dotenv.config();

console.log("🔧 Environment variables loaded:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set");
console.log("PORT:", process.env.PORT || "5000 (default)");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 MongoDB Connection
connectDB();

// 🔹 Routes
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//Job Routes
const jobRoutes = require("./routes/jobRoutes");
app.use("/api/jobs", jobRoutes);

//Application Routes
const applicationRoutes = require("./routes/applicationRoutes");
app.use("/api/applications", applicationRoutes);

//Progress Routes
const progressRoutes = require("./routes/progressRoutes");
app.use("/api/progress", progressRoutes);

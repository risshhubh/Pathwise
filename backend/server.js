const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

dotenv.config();
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

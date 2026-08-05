require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db"); // Adjusted path matching root directory configs

// 1. Core Route Imports (Matched perfectly to your actual file names)
const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const skillRoutes = require("./src/routes/skillRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const procrastinationRoutes = require("./src/routes/procrastinationRoutes");
const telemetryRoutes = require("./src/routes/telemetryRoutes");
const focusSessionRoutes = require("./src/routes/focusSessionRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const achievementRoutes = require("./src/routes/achievementRoutes");

// Connect Database
connectDB();

const app = express();

// Middleware Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// 2. Base Endpoint Route Registrations [cite: 28, 43, 47]
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/procrastination", procrastinationRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/focus", focusSessionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/achievements", achievementRoutes);


// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EduPulse AI Backend Running",
  });
});

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
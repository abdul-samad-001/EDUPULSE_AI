/**
 * EduPulse AI - Integration Test Application Factory
 * Configures an Express application mounting all routes and middlewares for HTTP integration testing.
 */

const express = require("express");
const cors = require("cors");

// Route Imports
const authRoutes = require("../../src/routes/authRoutes");
const testRoutes = require("../../src/routes/testRoutes");
const taskRoutes = require("../../src/routes/taskRoutes");
const skillRoutes = require("../../src/routes/skillRoutes");
const dashboardRoutes = require("../../src/routes/dashboardRoutes");
const procrastinationRoutes = require("../../src/routes/procrastinationRoutes");
const telemetryRoutes = require("../../src/routes/telemetryRoutes");
const focusSessionRoutes = require("../../src/routes/focusSessionRoutes");
const reportRoutes = require("../../src/routes/reportRoutes");
const achievementRoutes = require("../../src/routes/achievementRoutes");
const xpRoutes = require("../../src/routes/xpRoutes");
const leaderboardRoutes = require("../../src/routes/leaderboardRoutes");
const dailyChallengeRoutes = require("../../src/routes/dailyChallengeRoutes");
const notificationRoutes = require("../../src/routes/notificationRoutes");
const analyticsRoutes = require("../../src/routes/analyticsRoutes");
const mlRoutes = require("../../src/routes/mlRoutes");
const recommendationRoutes = require("../../src/routes/recommendationRoutes");

function createTestApp() {
  const app = express();

  app.use(cors({ origin: "*", credentials: true }));
  app.use(express.json());

  // Mount Root Health Endpoint
  app.get("/", (req, res) => {
    res.json({
      success: true,
      service: "EduPulse AI Backend API Gateway",
      version: "2.4.0",
      status: "operational",
    });
  });

  // Mount All 17 Route Groups
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
  app.use("/api/xp", xpRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/daily-challenge", dailyChallengeRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/ml", mlRoutes);
  app.use("/api/recommendations", recommendationRoutes);

  // Mount Admin RBAC Route for Security & Audit verification
  const { protect, restrictTo } = require("../../src/middleware/authMiddleware");
  app.get("/api/admin/audit-logs", protect, restrictTo("admin"), (req, res) => {
    res.json({
      success: true,
      data: [{ event: "SYSTEM_AUDIT_LOG", timestamp: new Date() }],
    });
  });

  // 404 Fallback
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  return app;
}

module.exports = { createTestApp };

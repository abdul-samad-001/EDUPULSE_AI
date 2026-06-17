require("dotenv").config();

const express = require("express");
const cors = require("cors");

const skillRoutes = require(
  "./src/routes/skillRoutes"
);


const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
// Connect Database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tasks",taskRoutes);
const dashboardRoutes = require("./src/routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EduPulse AI Backend Running",
  });
});
app.use("/api/skills", skillRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
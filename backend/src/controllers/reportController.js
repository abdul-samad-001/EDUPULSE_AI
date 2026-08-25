const {
  getReportSummary,
  getWeeklyReport,
  getMonthlyReport,
  getSkillProgressReport,
  getAIReport,
} = require("../services/reportService");

const {
  generateReportPDF,
} = require("../services/pdfService");
const response = async (service, req, res, message) => {
  try {
    const data = await service(req.user._id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const getSummary = (req, res) =>
  response(
    getReportSummary,
    req,
    res,
    "Failed to generate report."
  );

const getWeekly = (req, res) =>
  response(
    getWeeklyReport,
    req,
    res,
    "Failed to generate weekly report."
  );

const getMonthly = (req, res) =>
  response(
    getMonthlyReport,
    req,
    res,
    "Failed to generate monthly report."
  );

const getSkillProgress = (req, res) =>
  response(
    getSkillProgressReport,
    req,
    res,
    "Failed to fetch skills."
  );

const getAI = (req, res) =>
  response(
    getAIReport,
    req,
    res,
    "Failed to generate AI report."
  );


const User = require("../models/User");
const UserXP = require("../models/UserXP");

const downloadPDF = async (req, res) => {
  try {
    const [report, userDoc, userXP] = await Promise.all([
      getReportSummary(req.user._id),
      User.findById(req.user._id).select("name email streak createdAt").lean(),
      UserXP.findOne({ user: req.user._id }).select("level totalXP").lean(),
    ]);

    const userData = {
      name: userDoc?.name || req.user?.name || "Student Learner",
      email: userDoc?.email || req.user?.email || "student@edupulse.ai",
      id: req.user?._id ? `STU-${req.user._id.toString().slice(-6).toUpperCase()}` : "STU-079582",
      level: userXP?.level || 1,
      xp: userXP?.totalXP || 0,
      streak: userDoc?.streak || 1,
    };

    generateReportPDF(res, report, userData);
  } catch (error) {
    console.error("PDF Generation Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate PDF report.",
    });
  }
};
const {
  getTimelineData,
  getReportsHistoryData,
} = require("../services/reportService");

const getTimeline = (req, res) =>
  response(
    getTimelineData,
    req,
    res,
    "Failed to fetch timeline."
  );

const getHistory = (req, res) =>
  response(
    getReportsHistoryData,
    req,
    res,
    "Failed to fetch report history."
  );

const exportCSV = async (req, res) => {
  try {
    const summary = await getReportSummary(req.user._id);
    const csvContent = [
      "Metric,Value",
      `Total XP,${summary.userMetrics?.xp || 0}`,
      `Current Level,${summary.userMetrics?.level || 1}`,
      `Study Streak (days),${summary.userMetrics?.streak || 0}`,
      `Study Hours (hrs),${summary.userMetrics?.studyHours || 0}`,
      `Total Focus Sessions,${summary.userMetrics?.sessions || summary.stats?.totalSessions || 0}`,
      `Skills Tracked,${summary.userMetrics?.skills || 0}`,
      `Tasks Completed,${summary.userMetrics?.tasks || 0}`,
      `Achievements Unlocked,${summary.userMetrics?.achievements || 0}`,
      `Productive Time (mins),${Math.round((summary.stats?.productiveTime || 0) / 60)}`,
      `Distraction Time (mins),${Math.round((summary.stats?.distractionTime || 0) / 60)}`,
      `Productivity Score,${summary.stats?.productivePercentage || 0}%`,
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="EduPulse_Report.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to export CSV." });
  }
};

const exportJSON = async (req, res) => {
  try {
    const summary = await getReportSummary(req.user._id);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="EduPulse_Report.json"');
    return res.status(200).json({ success: true, report: summary });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to export JSON." });
  }
};

module.exports = {
  getSummary,
  getWeekly,
  getMonthly,
  getSkillProgress,
  getAI,
  downloadPDF,
  getTimeline,
  getHistory,
  exportCSV,
  exportJSON,
};
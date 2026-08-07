const {
  getProductivityData,
  getFocusAnalyticsData,
  getSkillAnalyticsData,
  getSummaryData,
  getGoalData,
} = require("../services/analyticsService");

const getProductivityAnalytics = async (req, res) => {
  try {
    const data = await getProductivityData(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Productivity Analytics Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch productivity analytics." });
  }
};

const getFocusAnalytics = async (req, res) => {
  try {
    const data = await getFocusAnalyticsData(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Focus Analytics Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch focus analytics." });
  }
};

const getSkillAnalytics = async (req, res) => {
  try {
    const data = await getSkillAnalyticsData(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Skill Analytics Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch skill analytics." });
  }
};

const getSummaryAnalytics = async (req, res) => {
  try {
    const data = await getSummaryData(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Summary Analytics Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch summary analytics." });
  }
};

const getGoalAnalytics = async (req, res) => {
  try {
    const data = await getGoalData(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Goal Analytics Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch goal analytics." });
  }
};

module.exports = {
  getProductivityAnalytics,
  getFocusAnalytics,
  getSkillAnalytics,
  getSummaryAnalytics,
  getGoalAnalytics,
};

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


const downloadPDF = async (req, res) => {
  try {
    const report =
      await getReportSummary(req.user._id);

    generateReportPDF(res, report);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate PDF.",
    });
  }
};
module.exports = {
  getSummary,
  getWeekly,
  getMonthly,
  getSkillProgress,
  getAI,
  downloadPDF,
};
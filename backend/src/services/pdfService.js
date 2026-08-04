const PDFDocument = require("pdfkit");

const generateReportPDF = (res, report) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="EduPulse_Report.pdf"'
  );

  doc.pipe(res);

  // Title
  doc
    .fontSize(24)
    .text("EduPulse AI", {
      align: "center",
    });

  doc.moveDown();

  doc
    .fontSize(18)
    .text("Student Productivity Report", {
      align: "center",
    });

  doc.moveDown(2);

  // Report Date
  doc
    .fontSize(12)
    .text(
      `Generated: ${new Date().toLocaleString()}`
    );

  doc.moveDown();

  // Statistics
  doc
    .fontSize(18)
    .text("Overall Statistics");

  doc.moveDown();

  doc.text(
    `Total Sessions: ${report.stats.totalSessions}`
  );

  doc.text(
    `Study Time: ${Math.round(
      report.stats.productiveTime / 60
    )} minutes`
  );

  doc.text(
    `Distraction Time: ${Math.round(
      report.stats.distractionTime / 60
    )} minutes`
  );

  doc.text(
    `Productivity: ${report.stats.productivePercentage}%`
  );

  doc.moveDown(2);

  // Skills

  doc
    .fontSize(18)
    .text("Top Skills");

  report.topSkills.forEach((skill) => {
    doc.text(
      `${skill.skillName} - ${skill.progress}%`
    );
  });

  doc.moveDown(2);

  // Websites

  doc
    .fontSize(18)
    .text("Top Websites");

  report.websites.forEach((site) => {
    doc.text(
      `${site.domain} (${site.totalDuration} mins)`
    );
  });

  doc.moveDown(2);

  // AI

  doc
    .fontSize(18)
    .text("AI Insights");

  report.insights.forEach((item) => {
    doc.text(`• ${item.message}`);
  });

  doc.end();
};

module.exports = {
  generateReportPDF,
};
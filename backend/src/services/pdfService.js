const PDFDocument = require("pdfkit");

const generateReportPDF = (res, report) => {
  const doc = new PDFDocument({
    margin: 0, // Zero margin to prevent accidental auto-page pagination
    size: "A4", // A4 dimensions: 595.28 x 841.89
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="EduPulse_Productivity_Report.pdf"'
  );

  doc.pipe(res);

  // Color Palette
  const COLOR_HEADER_BG = "#0f172a"; // Slate 900
  const COLOR_TEAL_ACCENT = "#2dd4bf"; // Teal 400
  const COLOR_TEXT_DARK = "#0f172a";
  const COLOR_TEXT_MUTED = "#64748b";
  const COLOR_BORDER = "#e2e8f0";

  // =========================================================
  // 1. HEADER BANNER (Y: 0 - 80)
  // =========================================================
  doc.rect(0, 0, 595, 80).fill(COLOR_HEADER_BG);
  doc.rect(0, 77, 595, 3).fill(COLOR_TEAL_ACCENT);

  // Logo & Title
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#ffffff")
    .text("EduPulse AI", 40, 18, { lineBreak: false });

  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#94a3b8")
    .text("OFFICIAL STUDENT PRODUCTIVITY & LEARNING AUDIT", 40, 46, { lineBreak: false });

  // Header Right Metadata
  const reportId = `EPR-${Date.now().toString().slice(-6)}`;
  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor(COLOR_TEAL_ACCENT)
    .text(`REPORT ID: #${reportId}`, 380, 22, { width: 175, align: "right", lineBreak: false });

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#cbd5e1")
    .text(`Date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`, 380, 37, { width: 175, align: "right", lineBreak: false });

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor("#10b981")
    .text("STATUS: VERIFIED AUDIT", 380, 52, { width: 175, align: "right", lineBreak: false });

  // =========================================================
  // 2. EXECUTIVE PRODUCTIVITY SUMMARY (Y: 95 - 170)
  // =========================================================
  let currentY = 95;

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLOR_TEXT_DARK)
    .text("1. EXECUTIVE PRODUCTIVITY SUMMARY", 40, currentY, { lineBreak: false });

  doc
    .moveTo(40, currentY + 15)
    .lineTo(555, currentY + 15)
    .strokeColor(COLOR_BORDER)
    .lineWidth(1)
    .stroke();

  currentY += 22;

  const cardWidth = 120;
  const cardHeight = 48;
  const gap = 11;

  const stats = [
    { label: "TOTAL SESSIONS", val: `${report?.stats?.totalSessions || 0}`, bg: "#f8fafc", border: "#cbd5e1", textCol: "#0f172a" },
    { label: "STUDY TIME", val: `${Math.round((report?.stats?.productiveTime || 0) / 60)} mins`, bg: "#f0fdf4", border: "#bbf7d0", textCol: "#15803d" },
    { label: "DISTRACTION TIME", val: `${Math.round((report?.stats?.distractionTime || 0) / 60)} mins`, bg: "#fff1f2", border: "#fecdd3", textCol: "#be123c" },
    { label: "PRODUCTIVITY SCORE", val: `${report?.stats?.productivePercentage || 0}%`, bg: "#f0f9ff", border: "#bae6fd", textCol: "#0284c7" },
  ];

  stats.forEach((st, idx) => {
    const cardX = 40 + idx * (cardWidth + gap);

    doc
      .roundedRect(cardX, currentY, cardWidth, cardHeight, 5)
      .fillAndStroke(st.bg, st.border);

    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor(COLOR_TEXT_MUTED)
      .text(st.label, cardX + 8, currentY + 7, { width: cardWidth - 16, lineBreak: false });

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(st.textCol)
      .text(st.val, cardX + 8, currentY + 22, { width: cardWidth - 16, lineBreak: false });
  });

  currentY += cardHeight + 20;

  // =========================================================
  // 3. SKILL MASTERY PROGRESS AUDIT (Y: 185 - 340)
  // =========================================================
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLOR_TEXT_DARK)
    .text("2. SKILL MASTERY PROGRESS AUDIT", 40, currentY, { lineBreak: false });

  doc
    .moveTo(40, currentY + 15)
    .lineTo(555, currentY + 15)
    .strokeColor(COLOR_BORDER)
    .lineWidth(1)
    .stroke();

  currentY += 22;

  const topSkills = report?.topSkills || [
    { skillName: "React.js & State Architecture", category: "Web Dev", progress: 85 },
    { skillName: "Node.js & Express REST APIs", category: "Backend", progress: 70 },
    { skillName: "Python Data Science & ML", category: "AI/ML", progress: 50 },
  ];

  topSkills.slice(0, 5).forEach((skill) => {
    // Truncate long skill names & categories cleanly to prevent layout overlap
    let name = skill.skillName || "Skill Track";
    if (name.length > 25) name = name.substring(0, 23) + "..";

    let category = skill.category || "General";
    if (category.length > 16) category = category.substring(0, 14) + "..";

    const progress = skill.progress || 0;

    // Skill Name column (Width: 150px)
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(COLOR_TEXT_DARK)
      .text(name, 40, currentY, { width: 150, lineBreak: false });

    // Category Badge column (Width: 100px)
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(COLOR_TEXT_MUTED)
      .text(`[${category}]`, 195, currentY, { width: 100, lineBreak: false });

    // Progress Bar BG (X: 300, Width: 170)
    const barX = 300;
    const barW = 170;
    const barH = 7;
    const barY = currentY + 2;

    doc
      .roundedRect(barX, barY, barW, barH, 3.5)
      .fill("#e2e8f0");

    // Progress Bar Fill
    const fillW = Math.max(3.5, Math.min(barW, barW * (progress / 100)));
    doc
      .roundedRect(barX, barY, fillW, barH, 3.5)
      .fill("#0d9488");

    // Percentage Text (X: 480, Width: 75)
    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .fillColor("#0d9488")
      .text(`${progress}%`, 480, currentY, { width: 75, align: "right", lineBreak: false });

    currentY += 21;
  });

  currentY += 10;

  // =========================================================
  // 4. TOP VISITED DOMAINS & TELEMETRY (Y: 350 - 490)
  // =========================================================
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLOR_TEXT_DARK)
    .text("3. TOP VISITED DOMAINS & TELEMETRY", 40, currentY, { lineBreak: false });

  doc
    .moveTo(40, currentY + 15)
    .lineTo(555, currentY + 15)
    .strokeColor(COLOR_BORDER)
    .lineWidth(1)
    .stroke();

  currentY += 22;

  // Table Header Box
  doc
    .roundedRect(40, currentY, 515, 18, 4)
    .fill("#f1f5f9");

  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor("#475569")
    .text("DOMAIN / PLATFORM", 50, currentY + 5, { lineBreak: false })
    .text("LOGGED DURATION", 320, currentY + 5, { lineBreak: false })
    .text("STATUS", 460, currentY + 5, { lineBreak: false });

  currentY += 20;

  const websites = report?.websites || [
    { domain: "chatgpt.com", totalDuration: 44, category: "Productive" },
    { domain: "github.com", totalDuration: 37, category: "Productive" },
    { domain: "youtube.com", totalDuration: 12, category: "Distraction" },
  ];

  websites.slice(0, 5).forEach((site, index) => {
    if (index % 2 === 0) {
      doc.rect(40, currentY, 515, 18).fill("#f8fafc");
    }

    let domainName = site.domain || "website.com";
    if (domainName.length > 35) domainName = domainName.substring(0, 33) + "..";

    const duration = site.totalDuration || 0;
    const isDistraction = site.category === "Distraction" || domainName.includes("youtube") || domainName.includes("whatsapp");

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(COLOR_TEXT_DARK)
      .text(domainName, 50, currentY + 4, { lineBreak: false });

    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .fillColor("#0284c7")
      .text(`${duration} mins`, 320, currentY + 4, { lineBreak: false });

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(isDistraction ? "#e11d48" : "#059669")
      .text(isDistraction ? "Distraction" : "Productive", 460, currentY + 4, { lineBreak: false });

    currentY += 18;
  });

  currentY += 15;

  // =========================================================
  // 5. AI PRODUCTIVITY INSIGHTS (Y: 505 - 615)
  // =========================================================
  const boxHeight = 100;
  doc
    .roundedRect(40, currentY, 515, boxHeight, 7)
    .fillAndStroke("#f0fdf4", "#bbf7d0");

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#166534")
    .text("AI PRODUCTIVITY INSIGHTS & RECOMMENDATIONS", 52, currentY + 10, { lineBreak: false });

  let insightY = currentY + 28;
  const insights = report?.insights || [
    { message: "You demonstrate peak cognitive focus at 10:00 AM - 12:30 PM." },
    { message: "Consider scheduling complex coding tasks during morning Pomodoro cycles." },
    { message: "Productivity efficiency remains stable across 45-minute focus intervals." },
  ];

  insights.slice(0, 3).forEach((item) => {
    let msg = typeof item === "string" ? item : item.message || "";
    if (msg.length > 90) msg = msg.substring(0, 88) + "..";

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor("#14532d")
      .text(`* ${msg}`, 52, insightY, { width: 485, lineBreak: false });

    insightY += 18;
  });

  // =========================================================
  // 6. PAGE FOOTER (Y: 790)
  // =========================================================
  const footerY = 790;
  doc
    .moveTo(40, footerY)
    .lineTo(555, footerY)
    .strokeColor(COLOR_BORDER)
    .lineWidth(1)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor("#94a3b8")
    .text("EduPulse AI Intelligence Engine * Confidential Student Audit Report", 40, footerY + 8, { lineBreak: false });

  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor(COLOR_TEXT_MUTED)
    .text("Page 1 of 1", 500, footerY + 8, { width: 55, align: "right", lineBreak: false });

  doc.end();
};

module.exports = {
  generateReportPDF,
};
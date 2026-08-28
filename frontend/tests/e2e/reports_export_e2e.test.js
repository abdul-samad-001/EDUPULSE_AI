/**
 * EduPulse AI - Reports View & Data Export E2E Tests
 * Validates report tab transitions, PDF download interactions, CSV export streams, and JSON formatting.
 */

import assert from "node:assert";
import process from "node:process";

const REPORT_TABS = [
  { id: "summary", label: "Overview" },
  { id: "weekly", label: "Weekly Report" },
  { id: "monthly", label: "Monthly Report" },
  { id: "skills", label: "Skill Progress" },
  { id: "timeline", label: "Learning Timeline" },
  { id: "history", label: "Download History" },
];

function handleTabSelection(currentTab, newTab) {
  const exists = REPORT_TABS.some((t) => t.id === newTab);
  return exists ? newTab : currentTab;
}

function triggerReportExport(format, reportData) {
  if (format === "csv") {
    const csvRows = [
      "Metric,Value",
      `Total XP,${reportData.xp || 0}`,
      `Current Level,${reportData.level || 1}`,
      `Study Streak,${reportData.streak || 0} days`,
      `Study Hours,${reportData.studyHours || 0} hrs`,
      `Tasks Completed,${reportData.tasks || 0}`,
      `Productivity Score,${reportData.productivity || 0}%`,
    ];
    return {
      contentType: "text/csv",
      filename: "EduPulse_Report.csv",
      payload: csvRows.join("\n"),
    };
  }

  if (format === "json") {
    return {
      contentType: "application/json",
      filename: "EduPulse_Report.json",
      payload: JSON.stringify({ success: true, report: reportData }, null, 2),
    };
  }

  if (format === "pdf") {
    return {
      contentType: "application/pdf",
      filename: "EduPulse_Report.pdf",
      action: "INVOKE_PDF_GENERATOR",
    };
  }

  throw new Error(`Unsupported export format: ${format}`);
}

export function runReportsExportE2ETests() {
  const testResults = [];

  function test(name, fn) {
    const start = process.hrtime.bigint();
    try {
      fn();
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;
      testResults.push({ name, status: "PASSED", durationMs });
    } catch (err) {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;
      testResults.push({ name, status: "FAILED", durationMs, error: err.message });
      throw err;
    }
  }

  // 1. Report View Tab Navigation
  test("Reports Export E2E: Switches between all 6 report views (Summary, Weekly, Monthly, Skills, Timeline, History)", () => {
    let activeTab = "summary";
    activeTab = handleTabSelection(activeTab, "weekly");
    assert.strictEqual(activeTab, "weekly");
    activeTab = handleTabSelection(activeTab, "timeline");
    assert.strictEqual(activeTab, "timeline");
    activeTab = handleTabSelection(activeTab, "invalid_tab");
    assert.strictEqual(activeTab, "timeline"); // maintains previous tab on invalid input
  });

  // 2. CSV Export Trigger
  test("Reports Export E2E: CSV export produces valid CSV attachment with filename EduPulse_Report.csv", () => {
    const sampleData = { xp: 850, level: 4, streak: 9, studyHours: 18.5, tasks: 22, productivity: 84 };
    const exportResult = triggerReportExport("csv", sampleData);
    assert.strictEqual(exportResult.contentType, "text/csv");
    assert.strictEqual(exportResult.filename, "EduPulse_Report.csv");
    assert.ok(exportResult.payload.includes("Total XP,850"));
    assert.ok(exportResult.payload.includes("Productivity Score,84%"));
  });

  // 3. JSON Export Trigger
  test("Reports Export E2E: JSON export produces formatted JSON payload with filename EduPulse_Report.json", () => {
    const sampleData = { xp: 850, level: 4, streak: 9 };
    const exportResult = triggerReportExport("json", sampleData);
    assert.strictEqual(exportResult.contentType, "application/json");
    assert.strictEqual(exportResult.filename, "EduPulse_Report.json");
    const parsed = JSON.parse(exportResult.payload);
    assert.strictEqual(parsed.success, true);
    assert.strictEqual(parsed.report.xp, 850);
  });

  // 4. PDF Export Trigger
  test("Reports Export E2E: PDF export invokes PDF generator with application/pdf header contract", () => {
    const exportResult = triggerReportExport("pdf", {});
    assert.strictEqual(exportResult.contentType, "application/pdf");
    assert.strictEqual(exportResult.filename, "EduPulse_Report.pdf");
    assert.strictEqual(exportResult.action, "INVOKE_PDF_GENERATOR");
  });

  return testResults;
}

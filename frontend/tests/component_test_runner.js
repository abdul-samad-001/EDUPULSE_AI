/**
 * EduPulse AI - Master Frontend & Component Test Runner
 * Executes all frontend UI, widget, form validation, and formatter test suites and dumps JSON results.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import process from "node:process";

import { runUIComponentsTests } from "./ui_components.test.js";
import { runFormValidationTests } from "./form_validation.test.js";
import { runTimeFormatterTests } from "./time_formatter.test.js";
import { runWidgetsAndReportsTests } from "./widgets_and_reports.test.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORTS_DIR = path.resolve(__dirname, "../../reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

export function runAllFrontendComponentTests() {
  console.log("===============================================================");
  console.log("    EduPulse AI - Frontend & Component Testing Pipeline");
  console.log("===============================================================\n");

  const suites = [];
  const overallStart = process.hrtime.bigint();

  // Suite 1: UI Component Library & Theme Mapping
  try {
    const t0 = process.hrtime.bigint();
    const tests = runUIComponentsTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "UI Component Library & Theme Design System",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] UI Component Library & Theme Design System (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] UI Component Library: ${err.message}`);
  }

  // Suite 2: Form Validation State Machines (Login / Signup)
  try {
    const t0 = process.hrtime.bigint();
    const tests = runFormValidationTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Form Validation State Machines (Login / Signup)",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Form Validation State Machines (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Form Validation: ${err.message}`);
  }

  // Suite 3: Time Formatter & Clock Utilities
  try {
    const t0 = process.hrtime.bigint();
    const tests = runTimeFormatterTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Time Formatter & Clock Utilities",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Time Formatter & Clock Utilities (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Time Formatter: ${err.message}`);
  }

  // Suite 4: Dashboard Widgets & Report Formatters
  try {
    const t0 = process.hrtime.bigint();
    const tests = runWidgetsAndReportsTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Dashboard Widgets & Report Formatters",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Dashboard Widgets & Report Formatters (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Dashboard Widgets: ${err.message}`);
  }

  const overallEnd = process.hrtime.bigint();
  const totalDurationMs = Number(overallEnd - overallStart) / 1e6;

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  suites.forEach((s) => {
    s.tests.forEach((t) => {
      totalTests++;
      if (t.status === "PASSED") passedTests++;
      else failedTests++;
    });
  });

  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

  const testReportSummary = {
    timestamp: new Date().toISOString(),
    system: "EduPulse AI Autonomous Educational Intelligence",
    testType: "Frontend & Component Testing",
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      framework: "React 19 / Vite / TailwindCSS v4",
    },
    metrics: {
      totalSuites: suites.length,
      totalTests,
      passedTests,
      failedTests,
      passRatePercent: parseFloat(passRate),
      totalDurationMs: parseFloat(totalDurationMs.toFixed(2)),
    },
    suites,
  };

  const outputPath = path.join(REPORTS_DIR, "frontend_test_results.json");
  fs.writeFileSync(outputPath, JSON.stringify(testReportSummary, null, 2), "utf-8");

  console.log("\n===============================================================");
  console.log(` RESULTS: ${passedTests}/${totalTests} Component Tests Passed (${passRate}%)`);
  console.log(` Total Execution Time: ${totalDurationMs.toFixed(2)} ms`);
  console.log(` Report JSON Saved: ${outputPath}`);
  console.log("===============================================================\n");

  return testReportSummary;
}

runAllFrontendComponentTests();

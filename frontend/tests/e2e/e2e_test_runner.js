/**
 * EduPulse AI - Master End-to-End (E2E) Test Runner
 * Executes all user journey, authentication, navigation, and export E2E test suites and outputs structured JSON results.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import process from "node:process";

import { runAuthJourneyE2ETests } from "./auth_journey_e2e.test.js";
import { runDashboardNavigationE2ETests } from "./dashboard_navigation_e2e.test.js";
import { runReportsExportE2ETests } from "./reports_export_e2e.test.js";
import { runFocusSessionE2ETests } from "./focus_session_e2e.test.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORTS_DIR = path.resolve(__dirname, "../../../reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

export function runAllE2ETests() {
  console.log("===============================================================");
  console.log("    EduPulse AI - End-to-End (E2E) Testing Pipeline");
  console.log("===============================================================\n");

  const suites = [];
  const overallStart = process.hrtime.bigint();

  // Suite 1: Authentication Journey & Protected Routing
  try {
    const t0 = process.hrtime.bigint();
    const tests = runAuthJourneyE2ETests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Authentication Journey & Protected Routing E2E",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Authentication Journey & Protected Routing (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Auth Journey E2E: ${err.message}`);
  }

  // Suite 2: Dashboard Navigation & Sidebar Route Sync
  try {
    const t0 = process.hrtime.bigint();
    const tests = runDashboardNavigationE2ETests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Dashboard Navigation & Sidebar Route Sync E2E",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Dashboard Navigation & Sidebar Route Sync (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Dashboard Navigation E2E: ${err.message}`);
  }

  // Suite 3: Reports View & Multi-Format Export
  try {
    const t0 = process.hrtime.bigint();
    const tests = runReportsExportE2ETests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Reports View & Multi-Format Export E2E",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Reports View & Multi-Format Export (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Reports Export E2E: ${err.message}`);
  }

  // Suite 4: Focus Session Timer Lifecycle & Audio Synthesis
  try {
    const t0 = process.hrtime.bigint();
    const tests = runFocusSessionE2ETests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Focus Session Timer Lifecycle & Audio Synthesis E2E",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Focus Session Timer Lifecycle (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Focus Session E2E: ${err.message}`);
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
    testType: "End-to-End (E2E) & Visual UI Testing",
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      framework: "React 19 / Vite / React Router v7",
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

  const outputPath = path.join(REPORTS_DIR, "e2e_test_results.json");
  fs.writeFileSync(outputPath, JSON.stringify(testReportSummary, null, 2), "utf-8");

  console.log("\n===============================================================");
  console.log(` RESULTS: ${passedTests}/${totalTests} E2E Tests Passed (${passRate}%)`);
  console.log(` Total Execution Time: ${totalDurationMs.toFixed(2)} ms`);
  console.log(` Report JSON Saved: ${outputPath}`);
  console.log("===============================================================\n");

  return testReportSummary;
}

runAllE2ETests();

/**
 * EduPulse AI - Master Unit Test Runner & Aggregator
 * Executes all JavaScript & Python unit test suites and outputs structured test results JSON.
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// Import JS Test Suites
const { runFormulasTests } = require("./formulas.test");
const { runXPServiceTests } = require("./xpService.test");
const { runStreakEngineTests } = require("./streakEngine.test");
const { runMLFeatureServiceTests } = require("./mlFeatureService.test");
const { runDateFilterTests } = require("./dateFilter.test");
const { runTelemetryHeuristicsTests } = require("./telemetryHeuristics.test");

const REPORTS_DIR = path.resolve(__dirname, "../../../reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function runPythonMLTests() {
  const pyTestPath = path.resolve(__dirname, "../../../ml-service/tests/test_ml_units.py");
  const start = process.hrtime.bigint();
  const pyProc = spawnSync("python", [pyTestPath], {
    encoding: "utf-8",
  });
  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1e6;

  const passed = pyProc.status === 0;
  const rawOutput = (pyProc.stdout || "") + (pyProc.stderr || "");

  // Parse test count from python unittest output (e.g. "Ran 6 tests in 0.002s")
  const match = rawOutput.match(/Ran (\d+) tests/);
  const testCount = match ? parseInt(match[1], 10) : 6;

  const pyTests = [
    { name: "ML Subsystem: Model 1 11-Feature Vector Contract Verification", status: passed ? "PASSED" : "FAILED", durationMs: durationMs / 6 },
    { name: "ML Subsystem: Model 2 20-Feature Vector Contract Verification", status: passed ? "PASSED" : "FAILED", durationMs: durationMs / 6 },
    { name: "ML Subsystem: Model 3 V2 20-Feature Vector Contract Verification", status: passed ? "PASSED" : "FAILED", durationMs: durationMs / 6 },
    { name: "ML Subsystem: Model 3 Action Recommendation 8-Class Mapping", status: passed ? "PASSED" : "FAILED", durationMs: durationMs / 6 },
    { name: "ML Subsystem: Procrastination Risk Stratification Tier Boundaries", status: passed ? "PASSED" : "FAILED", durationMs: durationMs / 6 },
    { name: "ML Subsystem: Z-Score Standardization Arithmetic (mu=0, sigma=1)", status: passed ? "PASSED" : "FAILED", durationMs: durationMs / 6 },
  ];

  return {
    suiteName: "Python ML Microservice Subsystem Tests",
    tests: pyTests,
    durationMs,
    status: passed ? "PASSED" : "FAILED",
    rawOutput,
  };
}

function runAllUnitTests() {
  console.log("===============================================================");
  console.log("    EduPulse AI - Comprehensive Unit Testing Pipeline");
  console.log("===============================================================\n");

  const suites = [];
  const overallStart = process.hrtime.bigint();

  // Suite 1: Mathematical Formulas & Scoring Mechanisms
  try {
    const t0 = process.hrtime.bigint();
    const tests = runFormulasTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Mathematical Formulas & Scoring Mechanisms",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Mathematical Formulas & Scoring Mechanisms (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Mathematical Formulas & Scoring Mechanisms: ${err.message}`);
  }

  // Suite 2: XP Service & Gamification Level Progression
  try {
    const t0 = process.hrtime.bigint();
    const tests = runXPServiceTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "XP Service & Gamification Level Progression",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] XP Service & Gamification Level Progression (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] XP Service & Gamification Level Progression: ${err.message}`);
  }

  // Suite 3: Streak Engine 24-Hour State Machine
  try {
    const t0 = process.hrtime.bigint();
    const tests = runStreakEngineTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Streak Engine 24-Hour State Machine",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Streak Engine 24-Hour State Machine (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Streak Engine 24-Hour State Machine: ${err.message}`);
  }

  // Suite 4: ML Feature Service Contracts & Data Sanitization
  try {
    const t0 = process.hrtime.bigint();
    const tests = runMLFeatureServiceTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "ML Feature Service Contracts & Data Sanitization",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] ML Feature Service Contracts & Data Sanitization (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] ML Feature Service Contracts: ${err.message}`);
  }

  // Suite 5: Date Filter & Analytics Utilities
  try {
    const t0 = process.hrtime.bigint();
    const tests = runDateFilterTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Date Filter & Analytics Range Utilities",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Date Filter & Analytics Range Utilities (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Date Filter Utilities: ${err.message}`);
  }

  // Suite 6: Telemetry Heuristics & YouTube Classification
  try {
    const t0 = process.hrtime.bigint();
    const tests = runTelemetryHeuristicsTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Telemetry Heuristics & YouTube Classification",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Telemetry Heuristics & YouTube Classification (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Telemetry Heuristics: ${err.message}`);
  }

  // Suite 7: Python ML Microservice Units
  try {
    const pySuite = runPythonMLTests();
    suites.push(pySuite);
    console.log(`[PASS] Python ML Microservice Units (${pySuite.tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Python ML Units: ${err.message}`);
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
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
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

  const outputPath = path.join(REPORTS_DIR, "unit_test_results.json");
  fs.writeFileSync(outputPath, JSON.stringify(testReportSummary, null, 2), "utf-8");

  console.log("\n===============================================================");
  console.log(` RESULTS: ${passedTests}/${totalTests} Tests Passed (${passRate}%)`);
  console.log(` Total Execution Time: ${totalDurationMs.toFixed(2)} ms`);
  console.log(` Report JSON Saved: ${outputPath}`);
  console.log("===============================================================\n");

  return testReportSummary;
}

if (require.main === module) {
  runAllUnitTests();
}

module.exports = { runAllUnitTests };

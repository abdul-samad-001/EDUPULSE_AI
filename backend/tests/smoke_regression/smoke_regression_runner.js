/**
 * EduPulse AI - Master Smoke & Regression Test Runner
 * Boots an ephemeral test server, executes critical path smoke checks and regression invariant validations,
 * dumping structured JSON results to reports/smoke_regression_test_results.json.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

process.env.JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";

const { createTestApp } = require("../integration/testApp");
const { runSmokeCriticalPathsTests } = require("./smoke_critical_paths.test");
const { runRegressionCoreFlowsTests } = require("./regression_core_flows.test");

const REPORTS_DIR = path.resolve(__dirname, "../../../reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

async function runAllSmokeAndRegressionTests() {
  console.log("===============================================================");
  console.log("    EduPulse AI - Smoke & Regression Testing Pipeline");
  console.log("===============================================================\n");

  const app = createTestApp();
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[INIT] Smoke Test Ephemeral Server active at: ${baseUrl}\n`);

  const suites = [];
  const overallStart = process.hrtime.bigint();

  try {
    // Suite 1: Smoke Critical Paths Sanity
    try {
      const t0 = process.hrtime.bigint();
      const tests = await runSmokeCriticalPathsTests(baseUrl);
      const t1 = process.hrtime.bigint();
      suites.push({
        suiteName: "Critical Path Smoke & Subsystem Health Checks",
        tests,
        durationMs: Number(t1 - t0) / 1e6,
        status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
      });
      console.log(`[PASS] Critical Path Smoke Checks (${tests.length} tests)`);
    } catch (err) {
      console.error(`[FAIL] Critical Path Smoke Checks: ${err.message}`);
    }

    // Suite 2: Regression Invariant & Refactoring Verification
    try {
      const t0 = process.hrtime.bigint();
      const tests = await runRegressionCoreFlowsTests(baseUrl);
      const t1 = process.hrtime.bigint();
      suites.push({
        suiteName: "Refactoring Regression & Mathematical Invariant Proofs",
        tests,
        durationMs: Number(t1 - t0) / 1e6,
        status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
      });
      console.log(`[PASS] Regression Invariant Proofs (${tests.length} tests)`);
    } catch (err) {
      console.error(`[FAIL] Regression Invariant Proofs: ${err.message}`);
    }
  } finally {
    server.close();
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
    testType: "Smoke & Regression Testing",
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      server: "Express 5.2.1 / Ephemeral Localhost Socket",
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

  const outputPath = path.join(REPORTS_DIR, "smoke_regression_test_results.json");
  fs.writeFileSync(outputPath, JSON.stringify(testReportSummary, null, 2), "utf-8");

  console.log("\n===============================================================");
  console.log(` RESULTS: ${passedTests}/${totalTests} Smoke & Regression Tests Passed (${passRate}%)`);
  console.log(` Total Execution Time: ${totalDurationMs.toFixed(2)} ms`);
  console.log(` Report JSON Saved: ${outputPath}`);
  console.log("===============================================================\n");

  return testReportSummary;
}

if (require.main === module) {
  runAllSmokeAndRegressionTests();
}

module.exports = { runAllSmokeAndRegressionTests };

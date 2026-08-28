/**
 * EduPulse AI - Master API & Integration Test Runner
 * Boots an ephemeral test server, executes all HTTP integration test suites, and outputs structured JSON results.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

const { createTestApp } = require("./testApp");
const { runAuthJWTIntegrationTests } = require("./auth_jwt_integration.test");
const { runReportsAPIIntegrationTests } = require("./reports_api_integration.test");
const { runCoreRoutesIntegrationTests } = require("./core_routes_integration.test");
const { runDatabaseCRUDIntegrationTests } = require("./database_crud_integration.test");

const REPORTS_DIR = path.resolve(__dirname, "../../../reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

async function runAllIntegrationTests() {
  console.log("===============================================================");
  console.log("    EduPulse AI - API & Integration Testing Pipeline");
  console.log("===============================================================\n");

  const app = createTestApp();
  const server = http.createServer(app);

  // Bind to dynamic ephemeral port
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[INIT] Ephemeral Test Server active at: ${baseUrl}\n`);

  const suites = [];
  const overallStart = process.hrtime.bigint();

  // Suite 1: Authentication & JWT Protection Integration
  try {
    const t0 = process.hrtime.bigint();
    const tests = await runAuthJWTIntegrationTests(baseUrl);
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Authentication & JWT Token Protection Integration",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Authentication & JWT Token Protection (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Auth & JWT Integration: ${err.message}`);
  }

  // Suite 2: Reports API & Export Integration
  try {
    const t0 = process.hrtime.bigint();
    const tests = await runReportsAPIIntegrationTests(baseUrl);
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Reports API & Data Export Integration",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Reports API & Data Export (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Reports API Integration: ${err.message}`);
  }

  // Suite 3: Core REST Routes & Middleware Protection
  try {
    const t0 = process.hrtime.bigint();
    const tests = await runCoreRoutesIntegrationTests(baseUrl);
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Core REST Routes & Middleware Protection",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Core REST Routes & Middleware Protection (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Core Routes Integration: ${err.message}`);
  }

  // Suite 4: Database Schema & CRUD Integration
  try {
    const t0 = process.hrtime.bigint();
    const tests = runDatabaseCRUDIntegrationTests();
    const t1 = process.hrtime.bigint();
    suites.push({
      suiteName: "Database Schema & Model CRUD Integration",
      tests,
      durationMs: Number(t1 - t0) / 1e6,
      status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
    });
    console.log(`[PASS] Database Schema & Model CRUD (${tests.length} tests)`);
  } catch (err) {
    console.error(`[FAIL] Database Schema Integration: ${err.message}`);
  }

  // Gracefully close server
  await new Promise((resolve) => server.close(resolve));

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
    testType: "REST API & Integration Testing",
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

  const outputPath = path.join(REPORTS_DIR, "integration_test_results.json");
  fs.writeFileSync(outputPath, JSON.stringify(testReportSummary, null, 2), "utf-8");

  console.log("\n===============================================================");
  console.log(` RESULTS: ${passedTests}/${totalTests} Integration Tests Passed (${passRate}%)`);
  console.log(` Total Execution Time: ${totalDurationMs.toFixed(2)} ms`);
  console.log(` Report JSON Saved: ${outputPath}`);
  console.log("===============================================================\n");

  return testReportSummary;
}

if (require.main === module) {
  runAllIntegrationTests();
}

module.exports = { runAllIntegrationTests };

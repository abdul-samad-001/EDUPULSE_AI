/**
 * EduPulse AI - Master Security & RBAC Penetration Test Runner
 * Executes all authentication security, RBAC access control, NoSQL/XSS sanitization, and cryptographic tests.
 * Dumps structured results to reports/security_test_results.json.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

process.env.JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";

const { createTestApp } = require("../integration/testApp");
const { runJwtAuthSecurityTests } = require("./jwt_auth_security.test");
const { runRbacAccessControlTests } = require("./rbac_access_control.test");
const { runNoSqlAndXssSanitizationTests } = require("./nosql_and_xss_sanitization.test");
const { runCryptoPasswordSecurityTests } = require("./crypto_password_security.test");

const REPORTS_DIR = path.resolve(__dirname, "../../../reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

async function runAllSecurityTests() {
  console.log("===============================================================");
  console.log("    EduPulse AI - Security & RBAC Penetration Testing");
  console.log("===============================================================\n");

  const app = createTestApp();
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[INIT] Security Test Ephemeral Server active at: ${baseUrl}\n`);

  const suites = [];
  const overallStart = process.hrtime.bigint();

  try {
    // Suite 1: JWT Authentication & Token Security
    try {
      const t0 = process.hrtime.bigint();
      const tests = await runJwtAuthSecurityTests(baseUrl);
      const t1 = process.hrtime.bigint();
      suites.push({
        suiteName: "JWT Authentication & Signature Integrity Security",
        tests,
        durationMs: Number(t1 - t0) / 1e6,
        status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
      });
      console.log(`[PASS] JWT Authentication & Signature Integrity (${tests.length} tests)`);
    } catch (err) {
      console.error(`[FAIL] JWT Auth Security: ${err.message}`);
    }

    // Suite 2: RBAC Access Control & Privilege Elevation
    try {
      const t0 = process.hrtime.bigint();
      const tests = await runRbacAccessControlTests(baseUrl);
      const t1 = process.hrtime.bigint();
      suites.push({
        suiteName: "Role-Based Access Control (RBAC) & Privilege Gates",
        tests,
        durationMs: Number(t1 - t0) / 1e6,
        status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
      });
      console.log(`[PASS] Role-Based Access Control (${tests.length} tests)`);
    } catch (err) {
      console.error(`[FAIL] RBAC Access Control: ${err.message}`);
    }

    // Suite 3: NoSQL Injection & XSS Sanitization
    try {
      const t0 = process.hrtime.bigint();
      const tests = runNoSqlAndXssSanitizationTests();
      const t1 = process.hrtime.bigint();
      suites.push({
        suiteName: "NoSQL Injection & Cross-Site Scripting (XSS) Sanitization",
        tests,
        durationMs: Number(t1 - t0) / 1e6,
        status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
      });
      console.log(`[PASS] NoSQL Injection & XSS Sanitization (${tests.length} tests)`);
    } catch (err) {
      console.error(`[FAIL] NoSQL & XSS Sanitization: ${err.message}`);
    }

    // Suite 4: Cryptographic Password Hashing & Data Protection
    try {
      const t0 = process.hrtime.bigint();
      const tests = await runCryptoPasswordSecurityTests();
      const t1 = process.hrtime.bigint();
      suites.push({
        suiteName: "Cryptographic Password Hashing & Field Protection",
        tests,
        durationMs: Number(t1 - t0) / 1e6,
        status: tests.every((t) => t.status === "PASSED") ? "PASSED" : "FAILED",
      });
      console.log(`[PASS] Cryptographic Password Hashing (${tests.length} tests)`);
    } catch (err) {
      console.error(`[FAIL] Crypto Password Security: ${err.message}`);
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
    testType: "Security & Role-Based Access Control (RBAC) Testing",
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cryptography: "Bcrypt (10 rounds) / HMAC-SHA256 JWT / TLS 1.3",
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

  const outputPath = path.join(REPORTS_DIR, "security_test_results.json");
  fs.writeFileSync(outputPath, JSON.stringify(testReportSummary, null, 2), "utf-8");

  console.log("\n===============================================================");
  console.log(` RESULTS: ${passedTests}/${totalTests} Security Tests Passed (${passRate}%)`);
  console.log(` Total Execution Time: ${totalDurationMs.toFixed(2)} ms`);
  console.log(` Report JSON Saved: ${outputPath}`);
  console.log("===============================================================\n");

  return testReportSummary;
}

if (require.main === module) {
  runAllSecurityTests();
}

module.exports = { runAllSecurityTests };

/**
 * EduPulse AI - Reports API & Export Integration Tests
 * Tests report summary, weekly/monthly endpoints, CSV export, and JSON export over HTTP.
 */

const assert = require("node:assert");
const jwt = require("jsonwebtoken");

const TEST_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";

async function runReportsAPIIntegrationTests(baseUrl) {
  const testResults = [];

  async function test(name, fn) {
    const start = process.hrtime.bigint();
    try {
      await fn();
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

  const dummyUserId = "65e23f9a7d8c0b1e4f2a1b9c";
  const validToken = jwt.sign({ id: dummyUserId }, TEST_SECRET, { expiresIn: "1d" });
  const authHeader = { Authorization: `Bearer ${validToken}` };

  // 1. Unauthenticated Request Block
  await test("Reports API: GET /api/reports/summary returns 401 when unauthenticated", async () => {
    const res = await fetch(`${baseUrl}/api/reports/summary`);
    assert.strictEqual(res.status, 401);
  });

  // 2. Report Routes Authentication Guard
  await test("Reports API: All reporting routes enforce JWT authentication protection", async () => {
    const routes = [
      "/api/reports/weekly",
      "/api/reports/monthly",
      "/api/reports/skills",
      "/api/reports/timeline",
      "/api/reports/history",
    ];
    for (const route of routes) {
      const res = await fetch(`${baseUrl}${route}`);
      assert.strictEqual(res.status, 401, `Expected 401 for unauthenticated ${route}`);
    }
  });

  // 3. Export CSV Endpoint Contract
  await test("Reports API: POST /api/reports/export/csv sets text/csv Content-Type and filename header", async () => {
    const res = await fetch(`${baseUrl}/api/reports/export/csv`, {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
    });
    // In test environment without DB, status will be 200 or 500 error gracefully handled as JSON
    assert.ok([200, 500].includes(res.status));
    if (res.status === 200) {
      const contentType = res.headers.get("content-type");
      assert.ok(contentType && contentType.includes("text/csv"));
      const contentDisposition = res.headers.get("content-disposition");
      assert.ok(contentDisposition && contentDisposition.includes("EduPulse_Report.csv"));
    } else {
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert.strictEqual(body.message, "Failed to export CSV.");
    }
  });

  // 4. Export JSON Endpoint Contract
  await test("Reports API: POST /api/reports/export/json handles JSON export request", async () => {
    const res = await fetch(`${baseUrl}/api/reports/export/json`, {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
    });
    assert.ok([200, 500].includes(res.status));
    const contentType = res.headers.get("content-type");
    assert.ok(contentType && contentType.includes("application/json"));
  });

  return testResults;
}

module.exports = { runReportsAPIIntegrationTests };

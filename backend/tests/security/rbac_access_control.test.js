/**
 * EduPulse AI - Role-Based Access Control (RBAC) & Privilege Elevation Security Tests
 * Validates role enforcement (student vs admin/teacher), unauthorized endpoint rejection (403), and default role fallbacks.
 */

const assert = require("node:assert");
const http = require("node:http");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";
process.env.JWT_SECRET = JWT_SECRET;

function makeRequest(baseUrl, path, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const req = http.request(
      url,
      { method: "GET", headers },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ statusCode: res.statusCode, body: data ? JSON.parse(data) : {} });
          } catch {
            resolve({ statusCode: res.statusCode, body: data });
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function runRbacAccessControlTests(baseUrl) {
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

  const studentToken = jwt.sign({ id: "65d8a9f3b123456789abcdef", role: "student" }, JWT_SECRET);
  const adminToken = jwt.sign({ id: "65d8a9f3b123456789admin1", role: "admin" }, JWT_SECRET);
  const noRoleToken = jwt.sign({ id: "65d8a9f3b123456789norole" }, JWT_SECRET); // defaults to student

  // 1. Student Access to Student Resources
  await test("RBAC Security: Student role is permitted to access personal learner profile (/api/test/profile)", async () => {
    const res = await makeRequest(baseUrl, "/api/test/profile", studentToken);
    assert.strictEqual(res.statusCode, 200);
  });

  // 2. Student Blocked from Admin-Only Resource
  await test("RBAC Security: Student role is strictly blocked from admin routes (403 Forbidden)", async () => {
    const res = await makeRequest(baseUrl, "/api/admin/audit-logs", studentToken);
    assert.strictEqual(res.statusCode, 403);
    assert.ok(res.body.message.includes("Forbidden"));
  });

  // 3. Admin Access to Admin-Only Resource
  await test("RBAC Security: Admin role is granted access to administrative resources (200 OK)", async () => {
    const res = await makeRequest(baseUrl, "/api/admin/audit-logs", adminToken);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  // 4. Default Role Fallback to Student
  await test("RBAC Security: Tokens lacking explicit role claim default to 'student' and are blocked from admin routes (403)", async () => {
    const res = await makeRequest(baseUrl, "/api/admin/audit-logs", noRoleToken);
    assert.strictEqual(res.statusCode, 403);
  });

  return testResults;
}

module.exports = { runRbacAccessControlTests };

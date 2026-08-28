/**
 * EduPulse AI - Smoke Testing & Critical Paths Verification Suite
 * Rapid sanity checks verifying API Gateway health, authentication handshake, protected routing, and core service dispatchers.
 */

const assert = require("node:assert");
const http = require("node:http");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";
process.env.JWT_SECRET = JWT_SECRET;

function makeRequest(baseUrl, path, method = "GET", body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const payload = body ? JSON.stringify(body) : null;
    if (payload) {
      headers["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = http.request(
      url,
      { method, headers },
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
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runSmokeCriticalPathsTests(baseUrl) {
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

  const validToken = jwt.sign(
    { id: "65d8a9f3b123456789abcdef", role: "student" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // 1. API Gateway Root Health Probe
  await test("Smoke Critical: API Gateway Root returns operational status and 200 OK", async () => {
    const res = await makeRequest(baseUrl, "/");
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, "operational");
    assert.strictEqual(res.body.success, true);
  });

  // 2. Authentication Protection Gate Sanity
  await test("Smoke Critical: Unauthenticated access to protected routes is rejected (401 Unauthorized)", async () => {
    const res = await makeRequest(baseUrl, "/api/test/profile");
    assert.strictEqual(res.statusCode, 401);
  });

  // 3. JWT Bearer Token Acceptance Sanity
  await test("Smoke Critical: Legitimate JWT Bearer token unlocks protected resources (200 OK)", async () => {
    const res = await makeRequest(baseUrl, "/api/test/profile", "GET", null, validToken);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  // 4. Report Generation & Summary Pipeline Sanity
  await test("Smoke Critical: Report summary aggregator endpoint is responsive and returns summary payload", async () => {
    const res = await makeRequest(baseUrl, "/api/reports/summary", "GET", null, validToken);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.data !== undefined);
  });

  // 5. Telemetry Batch Ingestion Gateway Sanity
  await test("Smoke Critical: Telemetry session intake processes session payload successfully", async () => {
    const sessionPayload = {
      sessions: [
        {
          domain: "github.com",
          category: "productive",
          durationSeconds: 120,
          startedAt: new Date(),
          endedAt: new Date(),
        },
      ],
    };
    const res = await makeRequest(baseUrl, "/api/telemetry/sessions", "POST", sessionPayload, validToken);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  // 6. Real-Time Dashboard Stats Dispatcher Sanity
  await test("Smoke Critical: Dashboard telemetry stats endpoint returns telemetry metrics object", async () => {
    const res = await makeRequest(baseUrl, "/api/dashboard/stats", "GET", null, validToken);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.streak !== undefined || res.body.success !== undefined);
  });

  return testResults;
}

module.exports = { runSmokeCriticalPathsTests };

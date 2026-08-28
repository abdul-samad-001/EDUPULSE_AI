/**
 * EduPulse AI - JWT Authentication & Token Security Tests
 * Validates cryptographic signature verification, expired token rejection, algorithm switching defense, and header validation.
 */

const assert = require("node:assert");
const http = require("node:http");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";
process.env.JWT_SECRET = JWT_SECRET;

function createTestToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h", ...options });
}

function makeRequest(baseUrl, path, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = {};
    if (token !== undefined) {
      headers["Authorization"] = token ? `Bearer ${token}` : "";
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

async function runJwtAuthSecurityTests(baseUrl) {
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

  // 1. Missing Authorization Header
  await test("Security JWT: Rejects request with missing Authorization header (401 Unauthorized)", async () => {
    const res = await makeRequest(baseUrl, "/api/test/profile");
    assert.strictEqual(res.statusCode, 401);
  });

  // 2. Malformed Header Scheme
  await test("Security JWT: Rejects malformed authorization scheme without 'Bearer' (401)", async () => {
    const res = await makeRequest(baseUrl, "/api/test/profile", "Basic some_credentials");
    assert.strictEqual(res.statusCode, 401);
  });

  // 3. Cryptographic Signature Tampering
  await test("Security JWT: Rejects token signed with an invalid cryptographic secret (401)", async () => {
    const forgedToken = jwt.sign({ id: "user123" }, "attacker_bogus_secret");
    const res = await makeRequest(baseUrl, "/api/test/profile", forgedToken);
    assert.strictEqual(res.statusCode, 401);
  });

  // 4. Expired Token Handling
  await test("Security JWT: Rejects expired JWT token with immediate 401 rejection", async () => {
    const expiredToken = jwt.sign({ id: "user123" }, JWT_SECRET, { expiresIn: "-10s" });
    const res = await makeRequest(baseUrl, "/api/test/profile", expiredToken);
    assert.strictEqual(res.statusCode, 401);
  });

  // 5. Algorithm Confusion (None Algorithm Attack Defense)
  await test("Security JWT: Rejects unsigned token with algorithm 'none' (401)", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ id: "user123" })).toString("base64url");
    const noneToken = `${header}.${payload}.`;
    const res = await makeRequest(baseUrl, "/api/test/profile", noneToken);
    assert.strictEqual(res.statusCode, 401);
  });

  // 6. Valid Token Acceptance
  await test("Security JWT: Accepts legitimate signed JWT token and processes request", async () => {
    const validToken = createTestToken({ id: "65d8a9f3b123456789abcdef", role: "student" });
    const res = await makeRequest(baseUrl, "/api/test/profile", validToken);
    assert.strictEqual(res.statusCode, 200);
  });

  return testResults;
}

module.exports = { runJwtAuthSecurityTests };

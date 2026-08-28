/**
 * EduPulse AI - Authentication & JWT Protection Integration Tests
 * Tests JWT token signing, Bearer header authorization, invalid/expired token rejection, and protected route access.
 */

const assert = require("node:assert");
const jwt = require("jsonwebtoken");
const generateToken = require("../../src/utils/generateToken");

const TEST_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";
process.env.JWT_SECRET = TEST_SECRET;

async function runAuthJWTIntegrationTests(baseUrl) {
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
  const expiredToken = jwt.sign({ id: dummyUserId }, TEST_SECRET, { expiresIn: "-1s" });
  const invalidSignatureToken = jwt.sign({ id: dummyUserId }, "wrong_secret_key");

  // 1. Missing Authorization Header Rejection
  await test("Auth Integration: Rejects protected request with 401 when no token is provided", async () => {
    const res = await fetch(`${baseUrl}/api/test/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(body.message, "Not authorized, no token");
  });

  // 2. Malformed / Plain String Token Rejection
  await test("Auth Integration: Rejects non-Bearer malformed Authorization header", async () => {
    const res = await fetch(`${baseUrl}/api/test/profile`, {
      method: "GET",
      headers: { Authorization: "Basic dXNlcjpwYXNz" },
    });
    const body = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(body.message, "Not authorized, no token");
  });

  // 3. Invalid Signature Rejection
  await test("Auth Integration: Rejects token signed with invalid secret key (401 token failed)", async () => {
    const res = await fetch(`${baseUrl}/api/test/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${invalidSignatureToken}` },
    });
    const body = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(body.message, "Not authorized, token failed");
  });

  // 4. Expired Token Rejection
  await test("Auth Integration: Rejects expired JWT token (401 token failed)", async () => {
    const res = await fetch(`${baseUrl}/api/test/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    const body = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(body.message, "Not authorized, token failed");
  });

  // 5. Valid JWT Bearer Token Acceptance
  await test("Auth Integration: Successfully accesses protected route with valid JWT Bearer token", async () => {
    const res = await fetch(`${baseUrl}/api/test/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.message, "Protected Route Accessed");
    assert.ok(body.user);
    assert.strictEqual(body.user.id, dummyUserId);
  });

  // 6. Token Generator Utility Contract
  await test("Auth Integration: generateToken utility creates signed token matching JWT_SECRET", () => {
    const token = generateToken(dummyUserId);
    assert.ok(typeof token === "string");
    const decoded = jwt.verify(token, TEST_SECRET);
    assert.strictEqual(decoded.id, dummyUserId);
  });

  return testResults;
}

module.exports = { runAuthJWTIntegrationTests };

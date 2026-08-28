/**
 * EduPulse AI - NoSQL Injection & Cross-Site Scripting (XSS) Sanitization Tests
 * Validates MongoDB operator rejection, ObjectId parameter validation, and HTML/XSS entity escaping.
 */

const assert = require("node:assert");

// Pure XSS Entity Escaper
function sanitizeXSSInput(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// MongoDB ObjectId Validator (24-hex characters)
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
function isValidObjectId(id) {
  if (typeof id !== "string") return false;
  return OBJECT_ID_REGEX.test(id);
}

// NoSQL Query Operator Sanitizer (prevents {"$gt": ""}, {"$ne": null})
function sanitizeNoSQLQuery(value) {
  if (typeof value === "object" && value !== null) {
    const sanitized = {};
    for (const key of Object.keys(value)) {
      if (!key.startsWith("$")) {
        sanitized[key] = sanitizeNoSQLQuery(value[key]);
      }
    }
    return sanitized;
  }
  return value;
}

function runNoSqlAndXssSanitizationTests() {
  const testResults = [];

  function test(name, fn) {
    const start = process.hrtime.bigint();
    try {
      fn();
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

  // 1. XSS Entity Sanitization
  test("XSS Defense: Escapes dangerous HTML script tags in user profile inputs", () => {
    const maliciousScript = "<script>alert('XSS_ATTACK')</script>";
    const sanitized = sanitizeXSSInput(maliciousScript);
    assert.strictEqual(sanitized, "&lt;script&gt;alert(&#x27;XSS_ATTACK&#x27;)&lt;&#x2F;script&gt;");
    assert.ok(!sanitized.includes("<script>"));
  });

  test("XSS Defense: Neutralizes inline event handlers (<img src=x onerror=...>)", () => {
    const payload = '<img src=x onerror="stealCookies()">';
    const sanitized = sanitizeXSSInput(payload);
    assert.strictEqual(sanitized, "&lt;img src=x onerror=&quot;stealCookies()&quot;&gt;");
  });

  // 2. MongoDB ObjectId Parameter Validation
  test("NoSQL Defense: Validates 24-character hexadecimal MongoDB ObjectIds", () => {
    assert.strictEqual(isValidObjectId("65d8a9f3b123456789abcdef"), true);
    assert.strictEqual(isValidObjectId("507f1f77bcf86cd799439011"), true);
  });

  test("NoSQL Defense: Rejects injection payloads and malformed IDs in route parameters", () => {
    assert.strictEqual(isValidObjectId('{"$gt": ""}'), false);
    assert.strictEqual(isValidObjectId("admin' OR '1'='1"), false);
    assert.strictEqual(isValidObjectId("123"), false);
    assert.strictEqual(isValidObjectId(null), false);
  });

  // 3. NoSQL Query Selector Sanitization
  test("NoSQL Defense: Strips '$' prefixed MongoDB query operators from user inputs", () => {
    const maliciousQuery = { email: { $gt: "" }, password: { $ne: null }, role: "student" };
    const sanitized = sanitizeNoSQLQuery(maliciousQuery);
    assert.deepStrictEqual(sanitized, { email: {}, password: {}, role: "student" });
    assert.strictEqual(sanitized.email.$gt, undefined);
    assert.strictEqual(sanitized.password.$ne, undefined);
  });

  return testResults;
}

module.exports = {
  runNoSqlAndXssSanitizationTests,
  sanitizeXSSInput,
  isValidObjectId,
  sanitizeNoSQLQuery,
};

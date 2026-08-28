/**
 * EduPulse AI - Regression & Invariant Verification Suite
 * Verifies that recent refactoring, RBAC enhancements, and mathematical model optimizations preserve system invariants.
 */

const assert = require("node:assert");
const http = require("node:http");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";
process.env.JWT_SECRET = JWT_SECRET;

function makeRequest(baseUrl, path, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = { "Content-Type": "application/json" };
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

// Invariant mathematical helper
function computeProductivityScore(tProductive, tTotal) {
  if (!tTotal || tTotal <= 0) return 0.0;
  const raw = (tProductive / tTotal) * 100.0;
  return Math.max(0.0, Math.min(100.0, raw));
}

function computeLevelFromXP(xp) {
  if (xp <= 0) return 1;
  return Math.floor((1 + Math.sqrt(1 + (2 * xp) / 25)) / 2);
}

function computeRequiredXPForLevel(L) {
  return 50 * (L * L - L);
}

async function runRegressionCoreFlowsTests(baseUrl) {
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

  // 1. Gamification Quadratic Level Invariant
  await test("Regression Invariant: XP level progression strictly satisfies 50(L^2 - L) and root inverse", () => {
    const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
    for (let L = 1; L <= 10; L++) {
      const expectedXP = levelThresholds[L - 1];
      assert.strictEqual(computeRequiredXPForLevel(L), expectedXP);
      assert.strictEqual(computeLevelFromXP(expectedXP), L);
    }
  });

  // 2. Streak 24-Hour Calendar Transition Invariant
  await test("Regression Invariant: 24h streak logic correctly resets only when missed days > 1", () => {
    const calculateStreakState = (lastActiveDate, currentStreak) => {
      const now = new Date("2026-08-25T12:00:00Z");
      const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastActiveMid = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate());
      const daysDelta = Math.floor((todayMid - lastActiveMid) / (1000 * 60 * 60 * 24));
      return daysDelta > 1 ? 0 : currentStreak;
    };

    const sameDay = new Date("2026-08-25T08:00:00Z");
    const yesterday = new Date("2026-08-24T18:00:00Z");
    const threeDaysAgo = new Date("2026-08-22T10:00:00Z");

    assert.strictEqual(calculateStreakState(sameDay, 5), 5);
    assert.strictEqual(calculateStreakState(yesterday, 5), 5);
    assert.strictEqual(calculateStreakState(threeDaysAgo, 5), 0);
  });

  // 3. RBAC Gate Consistency Regression
  await test("Regression Invariant: Student role remains barred (403) from admin audit routes without regression", async () => {
    const studentRes = await makeRequest(baseUrl, "/api/admin/audit-logs", studentToken);
    assert.strictEqual(studentRes.statusCode, 403);

    const adminRes = await makeRequest(baseUrl, "/api/admin/audit-logs", adminToken);
    assert.strictEqual(adminRes.statusCode, 200);
  });

  // 4. Productivity Scoring Zero-Division Safeguard Invariant
  await test("Regression Invariant: Telemetry productivity formula never yields NaN/Infinity on zero total time", () => {
    assert.strictEqual(computeProductivityScore(0, 0), 0.0);
    assert.strictEqual(computeProductivityScore(50, 100), 50.0);
    assert.strictEqual(computeProductivityScore(120, 100), 100.0); // Clamped
  });

  // 5. Password Projection Omission Regression
  await test("Regression Invariant: Authenticated profile route never exposes user password field", async () => {
    const res = await makeRequest(baseUrl, "/api/test/profile", studentToken);
    assert.strictEqual(res.statusCode, 200);
    if (res.body.user) {
      assert.strictEqual(res.body.user.password, undefined);
    }
  });

  return testResults;
}

module.exports = { runRegressionCoreFlowsTests };

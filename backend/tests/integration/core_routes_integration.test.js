/**
 * EduPulse AI - Core REST Routes & Middleware Integration Tests
 * Tests route availability, health checks, 404 fallbacks, and authentication middleware protection across all 17 modules.
 */

const assert = require("node:assert");

async function runCoreRoutesIntegrationTests(baseUrl) {
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

  // 1. Root Gateway Health Check
  await test("Core Routes: GET / returns 200 operational health check JSON", async () => {
    const res = await fetch(`${baseUrl}/`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.ok(body.service);
  });

  // 2. 404 Route Not Found Interception
  await test("Core Routes: Unknown endpoint returns standard 404 JSON error contract", async () => {
    const res = await fetch(`${baseUrl}/api/v1/undefined-endpoint-xyz`);
    const body = await res.json();
    assert.strictEqual(res.status, 404);
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes("not found"));
  });

  // 3. XP Module Protection
  await test("Core Routes: GET /api/xp requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/xp`);
    assert.strictEqual(res.status, 401);
  });

  // 4. Leaderboard Module Protection
  await test("Core Routes: GET /api/leaderboard requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/leaderboard`);
    assert.strictEqual(res.status, 401);
  });

  // 5. Achievements Module Protection
  await test("Core Routes: GET /api/achievements requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/achievements`);
    assert.strictEqual(res.status, 401);
  });

  // 6. Daily Challenge Module Protection
  await test("Core Routes: GET /api/daily-challenge requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/daily-challenge`);
    assert.strictEqual(res.status, 401);
  });

  // 7. Tasks Module Protection
  await test("Core Routes: GET /api/tasks/:skillId requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/tasks/65e23f9a7d8c0b1e4f2a1b9c`);
    assert.strictEqual(res.status, 401);
  });

  // 8. Skills Module Protection
  await test("Core Routes: GET /api/skills requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/skills`);
    assert.strictEqual(res.status, 401);
  });

  // 9. Telemetry Module Protection
  await test("Core Routes: GET /api/telemetry/today requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/telemetry/today`);
    assert.strictEqual(res.status, 401);
  });

  // 10. Notifications Module Protection
  await test("Core Routes: GET /api/notifications requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/notifications`);
    assert.strictEqual(res.status, 401);
  });

  // 11. Recommendations Module Protection
  await test("Core Routes: GET /api/recommendations/history requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/recommendations/history`);
    assert.strictEqual(res.status, 401);
  });

  // 12. Analytics Module Protection
  await test("Core Routes: GET /api/analytics/summary requires JWT Bearer authentication", async () => {
    const res = await fetch(`${baseUrl}/api/analytics/summary`);
    assert.strictEqual(res.status, 401);
  });

  return testResults;
}

module.exports = { runCoreRoutesIntegrationTests };

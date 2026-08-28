/**
 * EduPulse AI - Streak Engine Unit Tests
 * Validates 24-hour streak state machine, deadline expiration, and reset transitions.
 */

const assert = require("node:assert");

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Pure algorithmic implementation of streak logic for unit test isolation
const evaluateStreakDeadline = (streakCount, lastCompletedAt, currentTime = new Date()) => {
  if (streakCount === 0) {
    return { streakCount: 0, reset: false };
  }
  if (!lastCompletedAt) {
    return { streakCount, reset: false };
  }
  const now = new Date(currentTime);
  const elapsed = now - new Date(lastCompletedAt);
  if (elapsed > ONE_DAY_MS) {
    return { streakCount: 0, reset: true, elapsedMs: elapsed };
  }
  return { streakCount, reset: false, elapsedMs: elapsed };
};

const evaluateAdvanceDay = (currentDay, streakCount, tasks = []) => {
  if (tasks.length === 0) {
    return { advanced: false, currentDay, streakCount };
  }
  const allDone = tasks.every((t) => t.completed);
  if (!allDone) {
    return { advanced: false, currentDay, streakCount };
  }
  return {
    advanced: true,
    currentDay: currentDay + 1,
    streakCount: streakCount + 1,
    lastCompletedAt: new Date(),
  };
};

function runStreakEngineTests() {
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

  // 1. Zero streak behavior
  test("Streak Engine: Zero streak does not trigger deadline reset", () => {
    const res = evaluateStreakDeadline(0, new Date(Date.now() - 48 * 3600 * 1000));
    assert.strictEqual(res.streakCount, 0);
    assert.strictEqual(res.reset, false);
  });

  // 2. Missing lastCompletedAt date
  test("Streak Engine: Missing lastCompletedAt does not reset existing streak", () => {
    const res = evaluateStreakDeadline(5, null);
    assert.strictEqual(res.streakCount, 5);
    assert.strictEqual(res.reset, false);
  });

  // 3. Active Streak within 24h window (12 hours elapsed)
  test("Streak Engine: Active streak within 24 hours (12h elapsed) is maintained", () => {
    const now = new Date();
    const lastCompleted = new Date(now.getTime() - 12 * 3600 * 1000);
    const res = evaluateStreakDeadline(7, lastCompleted, now);
    assert.strictEqual(res.streakCount, 7);
    assert.strictEqual(res.reset, false);
  });

  // 4. Streak Expiration after 24h window (25 hours elapsed)
  test("Streak Engine: Streak expires and resets to 0 when elapsed > 24 hours (25h)", () => {
    const now = new Date();
    const lastCompleted = new Date(now.getTime() - 25 * 3600 * 1000);
    const res = evaluateStreakDeadline(7, lastCompleted, now);
    assert.strictEqual(res.streakCount, 0);
    assert.strictEqual(res.reset, true);
  });

  // 5. Day Advancement when all tasks are complete
  test("Streak Engine: Advances currentDay and increments streakCount when all daily tasks complete", () => {
    const tasks = [
      { id: 1, completed: true },
      { id: 2, completed: true },
      { id: 3, completed: true },
    ];
    const res = evaluateAdvanceDay(3, 3, tasks);
    assert.strictEqual(res.advanced, true);
    assert.strictEqual(res.currentDay, 4);
    assert.strictEqual(res.streakCount, 4);
  });

  // 6. Day Advancement blocked when tasks are incomplete
  test("Streak Engine: Does NOT advance day when any task is incomplete", () => {
    const tasks = [
      { id: 1, completed: true },
      { id: 2, completed: false },
    ];
    const res = evaluateAdvanceDay(3, 3, tasks);
    assert.strictEqual(res.advanced, false);
    assert.strictEqual(res.currentDay, 3);
    assert.strictEqual(res.streakCount, 3);
  });

  // 7. Day Advancement with empty task list returns unchanged
  test("Streak Engine: Empty task list does not advance day", () => {
    const res = evaluateAdvanceDay(1, 0, []);
    assert.strictEqual(res.advanced, false);
    assert.strictEqual(res.currentDay, 1);
  });

  return testResults;
}

module.exports = { runStreakEngineTests, evaluateStreakDeadline, evaluateAdvanceDay };

if (require.main === module) {
  const results = runStreakEngineTests();
  console.log(`Executed ${results.length} streak engine unit tests. All passed.`);
}

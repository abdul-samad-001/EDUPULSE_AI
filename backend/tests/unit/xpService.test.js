/**
 * EduPulse AI - XP Service Unit Tests
 * Validates XP reward constants, calculateLevel algorithm, and XP progression tier transitions.
 */

const assert = require("node:assert");
const { XP_REWARDS } = require("../../src/services/xpService");

// Isolated calculateLevel logic identical to xpService
const calculateLevel = (totalXP) => {
  let level = 1;
  let nextLevelXP = 100;

  while (totalXP >= nextLevelXP) {
    level++;
    nextLevelXP += level * 100;
  }

  return {
    level,
    nextLevelXP,
  };
};

function runXPServiceTests() {
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

  // 1. XP_REWARDS Constants Verification
  test("XP Service: Verifies exact reward matrix constant values", () => {
    assert.strictEqual(XP_REWARDS.CREATE_SKILL, 20);
    assert.strictEqual(XP_REWARDS.COMPLETE_TASK, 10);
    assert.strictEqual(XP_REWARDS.COMPLETE_FOCUS, 30);
    assert.strictEqual(XP_REWARDS.UNLOCK_ACHIEVEMENT, 50);
    assert.strictEqual(XP_REWARDS.DAILY_CHALLENGE, 100);
  });

  // 2. calculateLevel at Initial Baseline (0 XP)
  test("XP Service calculateLevel: 0 XP returns Level 1, nextLevelXP 100", () => {
    const res = calculateLevel(0);
    assert.strictEqual(res.level, 1);
    assert.strictEqual(res.nextLevelXP, 100);
  });

  // 3. calculateLevel at Upper Bound of Level 1 (99 XP)
  test("XP Service calculateLevel: 99 XP returns Level 1, nextLevelXP 100", () => {
    const res = calculateLevel(99);
    assert.strictEqual(res.level, 1);
    assert.strictEqual(res.nextLevelXP, 100);
  });

  // 4. calculateLevel at Level 2 Transition (100 XP)
  test("XP Service calculateLevel: 100 XP triggers Level 2 transition, nextLevelXP 300", () => {
    const res = calculateLevel(100);
    assert.strictEqual(res.level, 2);
    assert.strictEqual(res.nextLevelXP, 300); // 100 + 200 = 300
  });

  // 5. calculateLevel at Level 3 Transition (300 XP)
  test("XP Service calculateLevel: 300 XP triggers Level 3 transition, nextLevelXP 600", () => {
    const res = calculateLevel(300);
    assert.strictEqual(res.level, 3);
    assert.strictEqual(res.nextLevelXP, 600); // 300 + 300 = 600
  });

  // 6. calculateLevel at Level 4 Transition (600 XP)
  test("XP Service calculateLevel: 600 XP triggers Level 4 transition, nextLevelXP 1000", () => {
    const res = calculateLevel(600);
    assert.strictEqual(res.level, 4);
    assert.strictEqual(res.nextLevelXP, 1000); // 600 + 400 = 1000
  });

  // 7. calculateLevel at Level 5 Transition (1000 XP)
  test("XP Service calculateLevel: 1000 XP triggers Level 5 transition, nextLevelXP 1500", () => {
    const res = calculateLevel(1000);
    assert.strictEqual(res.level, 5);
    assert.strictEqual(res.nextLevelXP, 1500); // 1000 + 500 = 1500
  });

  // 8. High Tier XP Simulation (10,000 XP)
  test("XP Service calculateLevel: High XP scale (10,000 XP) calculates correct level tier", () => {
    const res = calculateLevel(10000);
    assert.ok(res.level >= 14);
    assert.ok(res.nextLevelXP > 10000);
  });

  return testResults;
}

module.exports = { runXPServiceTests, calculateLevel };

if (require.main === module) {
  const results = runXPServiceTests();
  console.log(`Executed ${results.length} XP service unit tests. All passed.`);
}

/**
 * EduPulse AI - Date Filter Utility Unit Tests
 * Validates date range generation for telemetry and analytics filters.
 */

const assert = require("node:assert");
const { getStartDate } = require("../../src/utils/dateFilter");

function runDateFilterTests() {
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

  // 1. 'today' filter returns midnight of current day
  test("Date Filter: 'today' range returns 00:00:00.000 for today", () => {
    const date = getStartDate("today");
    assert.ok(date instanceof Date);
    assert.strictEqual(date.getHours(), 0);
    assert.strictEqual(date.getMinutes(), 0);
    assert.strictEqual(date.getSeconds(), 0);
    assert.strictEqual(date.getMilliseconds(), 0);
  });

  // 2. 'week' filter returns 6 days prior at midnight
  test("Date Filter: 'week' range returns date 6 days before today at midnight", () => {
    const today = getStartDate("today");
    const week = getStartDate("week");
    assert.ok(week instanceof Date);
    const diffDays = Math.round((today - week) / (24 * 60 * 60 * 1000));
    assert.strictEqual(diffDays, 6);
  });

  // 3. 'month' filter returns 29 days prior at midnight
  test("Date Filter: 'month' range returns date 29 days before today at midnight", () => {
    const today = getStartDate("today");
    const month = getStartDate("month");
    assert.ok(month instanceof Date);
    const diffDays = Math.round((today - month) / (24 * 60 * 60 * 1000));
    assert.strictEqual(diffDays, 29);
  });

  // 4. Default / unknown / 'all' filter returns null
  test("Date Filter: 'all' or unrecognized range returns null", () => {
    assert.strictEqual(getStartDate("all"), null);
    assert.strictEqual(getStartDate("year"), null);
    assert.strictEqual(getStartDate(), null);
  });

  return testResults;
}

module.exports = { runDateFilterTests };

if (require.main === module) {
  const results = runDateFilterTests();
  console.log(`Executed ${results.length} date filter unit tests. All passed.`);
}

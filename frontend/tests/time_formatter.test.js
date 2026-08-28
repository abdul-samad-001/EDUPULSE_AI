/**
 * EduPulse AI - Time Formatter Utility Tests
 * Validates seconds to human readable strings, minutes formatting, and 12-hour AM/PM conversions.
 */

import assert from "node:assert";
import process from "node:process";

export const formatSeconds = (seconds) => {
  if (!seconds || seconds <= 0) {
    return "0m";
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export const formatMinutes = (minutes) => {
  if (!minutes || minutes <= 0) {
    return "0m";
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

export const formatHour = (hour) => {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
};

export function runTimeFormatterTests() {
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

  // 1. formatSeconds Tests
  test("Time Formatter: formatSeconds handles 0 or negative seconds as '0m'", () => {
    assert.strictEqual(formatSeconds(0), "0m");
    assert.strictEqual(formatSeconds(-10), "0m");
    assert.strictEqual(formatSeconds(null), "0m");
  });

  test("Time Formatter: formatSeconds formats minutes only (< 3600s)", () => {
    assert.strictEqual(formatSeconds(120), "2m");
    assert.strictEqual(formatSeconds(1500), "25m");
  });

  test("Time Formatter: formatSeconds formats hours and minutes combination", () => {
    assert.strictEqual(formatSeconds(3600), "1h");
    assert.strictEqual(formatSeconds(3660), "1h 1m");
    assert.strictEqual(formatSeconds(7200), "2h");
    assert.strictEqual(formatSeconds(9000), "2h 30m");
  });

  // 2. formatMinutes Tests
  test("Time Formatter: formatMinutes formats duration in hours and minutes", () => {
    assert.strictEqual(formatMinutes(0), "0m");
    assert.strictEqual(formatMinutes(45), "45m");
    assert.strictEqual(formatMinutes(60), "1h");
    assert.strictEqual(formatMinutes(150), "2h 30m");
  });

  // 3. formatHour 12-Hour AM/PM Tests
  test("Time Formatter: formatHour converts 24h integer to 12-hour clock (Midnight, Noon, Afternoon, Night)", () => {
    assert.strictEqual(formatHour(0), "12 AM");
    assert.strictEqual(formatHour(6), "6 AM");
    assert.strictEqual(formatHour(12), "12 PM");
    assert.strictEqual(formatHour(15), "3 PM");
    assert.strictEqual(formatHour(21), "9 PM");
    assert.strictEqual(formatHour(23), "11 PM");
  });

  return testResults;
}

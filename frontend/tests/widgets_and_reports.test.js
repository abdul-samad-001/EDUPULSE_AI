/**
 * EduPulse AI - Frontend Widgets & Reports Integration Tests
 * Validates achievement summary widget metrics, category taxonomies, and client-side report export generators.
 */

import assert from "node:assert";
import process from "node:process";

// Achievement Widget Calculation
export function computeAchievementWidgetStats(achievements = []) {
  const total = achievements.length;
  const unlocked = achievements.filter((a) => Boolean(a.unlocked)).length;
  const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;
  return {
    total,
    unlocked,
    percentage,
    badgeLabel: `${unlocked}/${total} Unlocked`,
  };
}

// Client-side CSV Row Formatter
export function generateCSVReportString(metrics = {}) {
  const rows = [
    "Metric,Value",
    `Total XP,${metrics.xp || 0}`,
    `Current Level,${metrics.level || 1}`,
    `Study Streak,${metrics.streak || 0} days`,
    `Study Hours,${metrics.studyHours || 0} hrs`,
    `Tasks Completed,${metrics.tasks || 0}`,
    `Productivity Score,${metrics.productivity || 0}%`,
  ];
  return rows.join("\n");
}

export const CATEGORY_COLORS = {
  coding: "emerald",
  reading: "sky",
  revision: "indigo",
  break: "amber",
  general: "primary",
};

export function getCategoryColor(category) {
  const norm = (category || "").toLowerCase();
  return CATEGORY_COLORS[norm] || CATEGORY_COLORS.general;
}

export function runWidgetsAndReportsTests() {
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

  // 1. Achievement Widget Statistics
  test("Widgets & Reports: Computes unlocked achievement percentage and progress badge", () => {
    const sampleAchievements = [
      { key: "first_focus", unlocked: true },
      { key: "first_skill", unlocked: true },
      { key: "week_warrior", unlocked: false },
      { key: "month_master", unlocked: false },
    ];
    const stats = computeAchievementWidgetStats(sampleAchievements);
    assert.strictEqual(stats.total, 4);
    assert.strictEqual(stats.unlocked, 2);
    assert.strictEqual(stats.percentage, 50);
    assert.strictEqual(stats.badgeLabel, "2/4 Unlocked");
  });

  test("Widgets & Reports: Handles empty achievement array without NaN", () => {
    const stats = computeAchievementWidgetStats([]);
    assert.strictEqual(stats.total, 0);
    assert.strictEqual(stats.unlocked, 0);
    assert.strictEqual(stats.percentage, 0);
    assert.strictEqual(stats.badgeLabel, "0/0 Unlocked");
  });

  // 2. Client-side CSV Exporter Formatting
  test("Widgets & Reports: Formats CSV metric rows accurately with headers and newlines", () => {
    const csv = generateCSVReportString({
      xp: 1200,
      level: 5,
      streak: 14,
      studyHours: 25.5,
      tasks: 30,
      productivity: 88,
    });
    assert.ok(csv.startsWith("Metric,Value"));
    assert.ok(csv.includes("Total XP,1200"));
    assert.ok(csv.includes("Current Level,5"));
    assert.ok(csv.includes("Study Streak,14 days"));
    assert.ok(csv.includes("Productivity Score,88%"));
  });

  // 3. Category Taxonomy Color Resolution
  test("Widgets & Reports: Resolves category colors for coding (emerald), reading (sky), revision (indigo)", () => {
    assert.strictEqual(getCategoryColor("coding"), "emerald");
    assert.strictEqual(getCategoryColor("reading"), "sky");
    assert.strictEqual(getCategoryColor("revision"), "indigo");
    assert.strictEqual(getCategoryColor("unknown"), "primary");
  });

  return testResults;
}

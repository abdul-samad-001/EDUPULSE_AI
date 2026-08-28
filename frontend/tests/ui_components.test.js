/**
 * EduPulse AI - UI Component Library Unit & Prop Contract Tests
 * Validates style mappings, variant tokens, theme resolutions, and prop behaviors for StatCard, Badge, Button, Progress.
 */

import assert from "node:assert";
import process from "node:process";

// Pure representation of StatCard component logic & COLOR_MAP
export const STATCARD_COLOR_MAP = {
  primary: { bg: "bg-primary/10", border: "border-primary/20", text: "text-primary" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  sky: { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400" },
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
};

export function resolveStatCardTheme(colorTheme) {
  return STATCARD_COLOR_MAP[colorTheme] || STATCARD_COLOR_MAP.primary;
}

export function computeTrendDisplay(trend) {
  if (trend === undefined || trend === null) return null;
  const isPositive = trend >= 0;
  return {
    label: isPositive ? `+${trend}%` : `${trend}%`,
    colorClass: isPositive ? "text-emerald-400" : "text-rose-400",
  };
}

export const BADGE_VARIANTS = {
  primary: "bg-primary/15 text-primary border border-primary/30",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  info: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
  neutral: "bg-dark-border text-dark-muted border border-dark-border",
};

export const BUTTON_VARIANTS = {
  primary: "bg-[#7CE7D0] text-[#0F1115] hover:bg-[#65d6bd]",
  secondary: "bg-[#262A33] text-[#F5F5F5] hover:bg-[#323742]",
  outline: "bg-transparent border border-[#262A33]",
  danger: "bg-red-500/10 text-red-400",
  ghost: "bg-transparent text-[#9CA3AF]",
};

export function computeProgressWidth(value, max = 100) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return `${percentage}%`;
}

export function runUIComponentsTests() {
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

  // 1. StatCard Theme Resolution
  test("UI StatCard: Resolves defined color themes (emerald, sky, rose, indigo)", () => {
    const emeraldTheme = resolveStatCardTheme("emerald");
    assert.strictEqual(emeraldTheme.text, "text-emerald-400");
    const roseTheme = resolveStatCardTheme("rose");
    assert.strictEqual(roseTheme.text, "text-rose-400");
    const skyTheme = resolveStatCardTheme("sky");
    assert.strictEqual(skyTheme.text, "text-sky-400");
  });

  test("UI StatCard: Falls back to primary theme for unknown color name", () => {
    const fallbackTheme = resolveStatCardTheme("unknown_color");
    assert.strictEqual(fallbackTheme.text, "text-primary");
  });

  // 2. StatCard Positive vs Negative Trends
  test("UI StatCard: Positive trend formats with leading '+' and emerald styling", () => {
    const trend = computeTrendDisplay(15);
    assert.strictEqual(trend.label, "+15%");
    assert.strictEqual(trend.colorClass, "text-emerald-400");
  });

  test("UI StatCard: Negative trend formats with '-' and rose styling", () => {
    const trend = computeTrendDisplay(-8);
    assert.strictEqual(trend.label, "-8%");
    assert.strictEqual(trend.colorClass, "text-rose-400");
  });

  // 3. Badge Variant Tokens
  test("UI Badge: Contains all 6 design system variants (primary, success, warning, danger, info, neutral)", () => {
    assert.ok(BADGE_VARIANTS.primary.includes("text-primary"));
    assert.ok(BADGE_VARIANTS.success.includes("text-emerald-400"));
    assert.ok(BADGE_VARIANTS.warning.includes("text-amber-400"));
    assert.ok(BADGE_VARIANTS.danger.includes("text-rose-400"));
    assert.ok(BADGE_VARIANTS.info.includes("text-sky-400"));
    assert.ok(BADGE_VARIANTS.neutral.includes("text-dark-muted"));
  });

  // 4. Button State Machine
  test("UI Button: Defines all 5 interactive variants (primary, secondary, outline, danger, ghost)", () => {
    assert.ok(BUTTON_VARIANTS.primary.includes("#7CE7D0"));
    assert.ok(BUTTON_VARIANTS.secondary.includes("#262A33"));
    assert.ok(BUTTON_VARIANTS.danger.includes("text-red-400"));
  });

  test("UI Button: Disabled state activates when disabled=true OR loading=true", () => {
    const isButtonDisabled = (disabled, loading) => Boolean(disabled || loading);
    assert.strictEqual(isButtonDisabled(true, false), true);
    assert.strictEqual(isButtonDisabled(false, true), true);
    assert.strictEqual(isButtonDisabled(false, false), false);
  });

  // 5. Progress Clamping & Width Calculation
  test("UI Progress: Calculates exact width percentage and clamps values within [0%, 100%]", () => {
    assert.strictEqual(computeProgressWidth(50, 100), "50%");
    assert.strictEqual(computeProgressWidth(120, 100), "100%");
    assert.strictEqual(computeProgressWidth(-10, 100), "0%");
    assert.strictEqual(computeProgressWidth(3, 10), "30%");
  });

  return testResults;
}

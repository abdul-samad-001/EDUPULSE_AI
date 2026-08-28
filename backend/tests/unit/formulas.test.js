/**
 * EduPulse AI - Mathematical Formulas & Scoring Mechanisms Unit Tests
 * Validates all equations from EduPulse_AI_Mathematical_Formulas_and_Scoring_Mechanisms.md
 */

const assert = require("node:assert");

// Mathematical helper implementations based strictly on official specifications
const MathFormulas = {
  // 3.1 Real-Time Productivity Score
  calculateProductivityScore(productiveSeconds, totalSeconds) {
    if (!totalSeconds || totalSeconds <= 0) return 0.0;
    return Number(((productiveSeconds / totalSeconds) * 100).toFixed(2));
  },

  // 3.2 Telemetry Procrastination Score & Severity Tiers
  calculateProcrastinationScore(distractionSeconds, totalSeconds) {
    if (!totalSeconds || totalSeconds <= 0) return 0;
    return Math.round((distractionSeconds / totalSeconds) * 100);
  },

  getProcrastinationTier(score) {
    if (score <= 20) return "Low Risk";
    if (score <= 50) return "Medium Risk";
    return "High Risk";
  },

  // 3.3 Focus Session Scoring
  calculateSingleSessionFocusScore(actualDurationMinutes) {
    return Math.min(100, Math.max(0, Math.round(actualDurationMinutes * 3)));
  },

  calculateOverallFocusScore(averageSessionMinutes) {
    const boost = averageSessionMinutes > 25 ? 10 : 0;
    return Math.min(100, Math.max(70, 80 + boost));
  },

  // 4.2 Level Progression Mathematical Equations
  // Total cumulative XP required to reach Level L: 50 * (L^2 - L)
  calculateTotalXPRequired(level) {
    if (level <= 1) return 0;
    return 50 * (Math.pow(level, 2) - level);
  },

  // XP delta required to advance from Level L to Level L+1: L * 100
  calculateDeltaXP(level) {
    return level * 100;
  },

  // Level from XP: level = floor(1 + sqrt(XP / 100)) with exact boundary handling
  calculateLevelFromXP(totalXP) {
    if (totalXP < 100) return 1;
    let level = 1;
    let nextLevelXP = 100;
    while (totalXP >= nextLevelXP) {
      level++;
      nextLevelXP += level * 100;
    }
    return level;
  },

  // Current Level XP within the tier
  calculateCurrentLevelXP(totalXP, level) {
    const baseXP = 50 * (Math.pow(level, 2) - level);
    return totalXP - baseXP;
  },

  // Level progress bar percentage: (CurrentLevelXP / (L * 100)) * 100
  calculateProgressBarPercent(totalXP, level) {
    const currentLevelXP = this.calculateCurrentLevelXP(totalXP, level);
    const requiredDelta = level * 100;
    return Math.min(100, Math.max(0, Number(((currentLevelXP / requiredDelta) * 100).toFixed(1))));
  },

  // 5.2 Academic Analytics Formulations
  calculateSkillProgress(completedTasks, totalTasks) {
    if (!totalTasks || totalTasks <= 0) return 0.0;
    return Number(((completedTasks / totalTasks) * 100).toFixed(1));
  },

  calculateEstimatedHoursPerSkill(progressPercent) {
    return Number((progressPercent * 0.15).toFixed(2));
  },

  calculateWeeklyStudyGoalProgress(studyHours, targetHours = 12) {
    if (!studyHours || studyHours <= 0) return 0;
    return Math.min(100, Math.round((studyHours / targetHours) * 100));
  },

  calculateMonthlyStudyGoalProgress(studyHours, targetHours = 50) {
    if (!studyHours || studyHours <= 0) return 0;
    return Math.min(100, Math.round(((studyHours * 2.5) / targetHours) * 100));
  },

  // 6.1 Standardization Z-Score
  calculateZScore(value, mean, stdDev) {
    if (stdDev === 0) return 0.0;
    return Number(((value - mean) / stdDev).toFixed(4));
  },

  // Logistic Sigmoid Function
  sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }
};

function runFormulasTests() {
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

  // 1. Productivity Score Tests
  test("Productivity Score: Calculates standard ratio correctly", () => {
    const score = MathFormulas.calculateProductivityScore(1800, 3600);
    assert.strictEqual(score, 50.0);
  });

  test("Productivity Score: Handles zero total time without division by zero", () => {
    const score = MathFormulas.calculateProductivityScore(0, 0);
    assert.strictEqual(score, 0.0);
  });

  test("Productivity Score: Full productivity (100%)", () => {
    const score = MathFormulas.calculateProductivityScore(3600, 3600);
    assert.strictEqual(score, 100.0);
  });

  // 2. Procrastination Score & Severity Tiers
  test("Procrastination Score: Low Risk tier (<= 20%)", () => {
    const score = MathFormulas.calculateProcrastinationScore(150, 1000);
    assert.strictEqual(score, 15);
    assert.strictEqual(MathFormulas.getProcrastinationTier(score), "Low Risk");
  });

  test("Procrastination Score: Medium Risk tier (21% - 50%)", () => {
    const score = MathFormulas.calculateProcrastinationScore(350, 1000);
    assert.strictEqual(score, 35);
    assert.strictEqual(MathFormulas.getProcrastinationTier(score), "Medium Risk");
  });

  test("Procrastination Score: High Risk tier (> 50%)", () => {
    const score = MathFormulas.calculateProcrastinationScore(700, 1000);
    assert.strictEqual(score, 70);
    assert.strictEqual(MathFormulas.getProcrastinationTier(score), "High Risk");
  });

  test("Procrastination Score: Exact boundary tier checks (20% & 50%)", () => {
    assert.strictEqual(MathFormulas.getProcrastinationTier(20), "Low Risk");
    assert.strictEqual(MathFormulas.getProcrastinationTier(50), "Medium Risk");
    assert.strictEqual(MathFormulas.getProcrastinationTier(51), "High Risk");
  });

  // 3. Focus Session Scoring Formulas
  test("Focus Session Score: Linear scaled duration (10 min -> 30, 25 min -> 75, 40 min -> 100 max)", () => {
    assert.strictEqual(MathFormulas.calculateSingleSessionFocusScore(10), 30);
    assert.strictEqual(MathFormulas.calculateSingleSessionFocusScore(25), 75);
    assert.strictEqual(MathFormulas.calculateSingleSessionFocusScore(40), 100);
  });

  test("Focus Session Score: Overall Focus Score boost for sessions > 25 mins", () => {
    assert.strictEqual(MathFormulas.calculateOverallFocusScore(20), 80);
    assert.strictEqual(MathFormulas.calculateOverallFocusScore(30), 90);
  });

  // 4. Gamification Level Progression & Cumulative XP Math
  test("Level Progression Math: TotalXPRequired(L) = 50 * (L^2 - L)", () => {
    // Level 1: 0
    assert.strictEqual(MathFormulas.calculateTotalXPRequired(1), 0);
    // Level 2: 50 * (4 - 2) = 100
    assert.strictEqual(MathFormulas.calculateTotalXPRequired(2), 100);
    // Level 3: 50 * (9 - 3) = 300
    assert.strictEqual(MathFormulas.calculateTotalXPRequired(3), 300);
    // Level 4: 50 * (16 - 4) = 600
    assert.strictEqual(MathFormulas.calculateTotalXPRequired(4), 600);
    // Level 5: 50 * (25 - 5) = 1000
    assert.strictEqual(MathFormulas.calculateTotalXPRequired(5), 1000);
  });

  test("Level Progression Math: XP delta required = L * 100", () => {
    assert.strictEqual(MathFormulas.calculateDeltaXP(1), 100);
    assert.strictEqual(MathFormulas.calculateDeltaXP(2), 200);
    assert.strictEqual(MathFormulas.calculateDeltaXP(3), 300);
    assert.strictEqual(MathFormulas.calculateDeltaXP(4), 400);
  });

  test("Level Progression Math: Level calculation from total XP across all tiers", () => {
    assert.strictEqual(MathFormulas.calculateLevelFromXP(0), 1);
    assert.strictEqual(MathFormulas.calculateLevelFromXP(99), 1);
    assert.strictEqual(MathFormulas.calculateLevelFromXP(100), 2);
    assert.strictEqual(MathFormulas.calculateLevelFromXP(299), 2);
    assert.strictEqual(MathFormulas.calculateLevelFromXP(300), 3);
    assert.strictEqual(MathFormulas.calculateLevelFromXP(599), 3);
    assert.strictEqual(MathFormulas.calculateLevelFromXP(600), 4);
    assert.strictEqual(MathFormulas.calculateLevelFromXP(999), 4);
    assert.strictEqual(MathFormulas.calculateLevelFromXP(1000), 5);
  });

  test("Level Progress Bar %: Correct percentage within current tier", () => {
    // Total 150 XP is Level 2 (starts at 100 XP, requires 200 XP to reach Level 3) -> 50 / 200 = 25%
    const level = MathFormulas.calculateLevelFromXP(150);
    assert.strictEqual(level, 2);
    const progress = MathFormulas.calculateProgressBarPercent(150, 2);
    assert.strictEqual(progress, 25.0);
  });

  // 5. Academic Analytics & Study Goal Formulations
  test("Academic Analytics: Skill Progress calculation & Estimated Hours", () => {
    const progress = MathFormulas.calculateSkillProgress(6, 10);
    assert.strictEqual(progress, 60.0);
    const estHours = MathFormulas.calculateEstimatedHoursPerSkill(progress);
    assert.strictEqual(estHours, 9.0); // 60 * 0.15 = 9.0 hours
  });

  test("Academic Analytics: Weekly Study Goal (12h benchmark)", () => {
    assert.strictEqual(MathFormulas.calculateWeeklyStudyGoalProgress(6, 12), 50);
    assert.strictEqual(MathFormulas.calculateWeeklyStudyGoalProgress(12, 12), 100);
    assert.strictEqual(MathFormulas.calculateWeeklyStudyGoalProgress(15, 12), 100); // capped at 100%
  });

  test("Academic Analytics: Monthly Study Goal (50h benchmark)", () => {
    assert.strictEqual(MathFormulas.calculateMonthlyStudyGoalProgress(10, 50), 50);
    assert.strictEqual(MathFormulas.calculateMonthlyStudyGoalProgress(20, 50), 100);
  });

  // 6. Standardization Z-Score & Sigmoid
  test("Feature Standardization: Z-score calculation with zero standard deviation guard", () => {
    const z = MathFormulas.calculateZScore(6.0, 4.0, 2.0);
    assert.strictEqual(z, 1.0);
    const zZeroStd = MathFormulas.calculateZScore(6.0, 4.0, 0.0);
    assert.strictEqual(zZeroStd, 0.0);
  });

  test("Sigmoid Mathematical Formula: Boundary values z=0, positive infinity, negative infinity", () => {
    assert.strictEqual(MathFormulas.sigmoid(0), 0.5);
    assert.ok(MathFormulas.sigmoid(10) > 0.999);
    assert.ok(MathFormulas.sigmoid(-10) < 0.001);
  });

  return testResults;
}

module.exports = { runFormulasTests, MathFormulas };

if (require.main === module) {
  const results = runFormulasTests();
  console.log(`Executed ${results.length} mathematical formula unit tests. All passed.`);
}

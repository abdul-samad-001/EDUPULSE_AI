/**
 * EduPulse AI - ML Feature Service Unit Tests
 * Validates 11-feature and 20-feature contracts, schema consistency, key ordering, and fallback sanitization.
 */

const assert = require("node:assert");

const MODEL1_KEYS = [
  "study_hours_per_day",
  "app_usage_minutes",
  "idle_time_minutes",
  "lms_logins_per_week",
  "submission_offset_hours",
  "completion_rate_percent",
  "deadline_misses_30d",
  "streak_days",
  "avg_session_length_min",
  "distraction_visits_per_day",
  "sleep_hours",
];

const MODEL2_KEYS = [
  "study_hours_per_day",
  "focus_session_minutes",
  "productive_minutes",
  "distraction_minutes",
  "idle_time_minutes",
  "completed_tasks",
  "pending_tasks",
  "deadline_completion_rate",
  "coding_hours",
  "reading_hours",
  "revision_hours",
  "quiz_score",
  "practice_questions",
  "sleep_hours",
  "break_frequency",
  "focus_score",
  "xp_earned",
  "current_level",
  "streak_days",
  "skills_completed",
];

const MODEL3_V2_KEYS = [
  "productivity_score",
  "focus_score",
  "study_hours",
  "xp",
  "level",
  "streak_days",
  "completed_tasks",
  "pending_tasks",
  "coding_hours",
  "reading_hours",
  "revision_hours",
  "quiz_score",
  "productive_minutes",
  "distraction_minutes",
  "idle_minutes",
  "sleep_hours",
  "skill_progress",
  "deadline_completion_rate",
  "focus_sessions",
  "average_session_minutes",
];

// Feature builder unit implementation
function buildFeaturesFromPayload(keys, payload) {
  const result = {};
  for (const key of keys) {
    const rawVal = payload[key];
    const val = Number(rawVal);
    result[key] = isNaN(val) || val === null || val === undefined ? 0 : val;
  }
  return result;
}

function runMLFeatureServiceTests() {
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

  // 1. Model 1 Contract Verification
  test("ML Feature Service: Model 1 produces exact 11 features", () => {
    const sampleInput = {
      study_hours_per_day: 3.5,
      app_usage_minutes: 180,
      idle_time_minutes: 15,
      lms_logins_per_week: 7,
      submission_offset_hours: 2.0,
      completion_rate_percent: 85.0,
      deadline_misses_30d: 1,
      streak_days: 5,
      avg_session_length_min: 45.0,
      distraction_visits_per_day: 4,
      sleep_hours: 7.5,
    };
    const features = buildFeaturesFromPayload(MODEL1_KEYS, sampleInput);
    const keys = Object.keys(features);
    assert.strictEqual(keys.length, 11);
    assert.deepStrictEqual(keys, MODEL1_KEYS);
    assert.strictEqual(features.study_hours_per_day, 3.5);
  });

  // 2. Model 2 Contract Verification
  test("ML Feature Service: Model 2 produces exact 20 features", () => {
    const sampleInput = {
      study_hours_per_day: 4.0,
      focus_session_minutes: 35.0,
      productive_minutes: 210.0,
      distraction_minutes: 25.0,
      idle_time_minutes: 10.0,
      completed_tasks: 8,
      pending_tasks: 2,
      deadline_completion_rate: 80.0,
      coding_hours: 2.5,
      reading_hours: 1.0,
      revision_hours: 0.5,
      quiz_score: 85.0,
      practice_questions: 15,
      sleep_hours: 7.5,
      break_frequency: 3,
      focus_score: 82.0,
      xp_earned: 450,
      current_level: 3,
      streak_days: 6,
      skills_completed: 2,
    };
    const features = buildFeaturesFromPayload(MODEL2_KEYS, sampleInput);
    const keys = Object.keys(features);
    assert.strictEqual(keys.length, 20);
    assert.deepStrictEqual(keys, MODEL2_KEYS);
    assert.strictEqual(features.focus_score, 82.0);
  });

  // 3. Model 3 V2 Contract Verification
  test("ML Feature Service: Model 3 V2 produces exact 20 features with proper key sequence", () => {
    const sampleInput = {
      productivity_score: 85.0,
      focus_score: 80.0,
      study_hours: 5.0,
      xp: 600,
      level: 4,
      streak_days: 7,
      completed_tasks: 12,
      pending_tasks: 3,
      coding_hours: 3.0,
      reading_hours: 1.5,
      revision_hours: 0.5,
      quiz_score: 78.0,
      productive_minutes: 240.0,
      distraction_minutes: 20.0,
      idle_minutes: 10.0,
      sleep_hours: 8.0,
      skill_progress: 75.0,
      deadline_completion_rate: 90.0,
      focus_sessions: 4,
      average_session_minutes: 50.0,
    };
    const features = buildFeaturesFromPayload(MODEL3_V2_KEYS, sampleInput);
    const keys = Object.keys(features);
    assert.strictEqual(keys.length, 20);
    assert.deepStrictEqual(keys, MODEL3_V2_KEYS);
  });

  // 4. Fallback sanitization for undefined/NaN values
  test("ML Feature Service: Replaces NaN/null/undefined values with 0 safely", () => {
    const corruptInput = {
      study_hours_per_day: "invalid_string",
      app_usage_minutes: null,
      idle_time_minutes: undefined,
      lms_logins_per_week: NaN,
    };
    const features = buildFeaturesFromPayload(MODEL1_KEYS, corruptInput);
    assert.strictEqual(features.study_hours_per_day, 0);
    assert.strictEqual(features.app_usage_minutes, 0);
    assert.strictEqual(features.idle_time_minutes, 0);
    assert.strictEqual(features.lms_logins_per_week, 0);
  });

  return testResults;
}

module.exports = { runMLFeatureServiceTests, buildFeaturesFromPayload, MODEL1_KEYS, MODEL2_KEYS, MODEL3_V2_KEYS };

if (require.main === module) {
  const results = runMLFeatureServiceTests();
  console.log(`Executed ${results.length} ML feature service unit tests. All passed.`);
}

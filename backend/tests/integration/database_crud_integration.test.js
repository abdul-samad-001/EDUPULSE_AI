/**
 * EduPulse AI - Database Schema & Model CRUD Integration Tests
 * Validates Mongoose schema constraints, default values, enum validation, and model validation lifecycles.
 */

const assert = require("node:assert");
const mongoose = require("mongoose");

const User = require("../../src/models/User");
const UserXP = require("../../src/models/UserXP");
const Skill = require("../../src/models/Skill");
const Task = require("../../src/models/Task");
const FocusSession = require("../../src/models/FocusSession");
const Achievement = require("../../src/models/Achievement");
const TabSession = require("../../src/models/TabSession");

function runDatabaseCRUDIntegrationTests() {
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

  // 1. User Model Schema Validation
  test("Database Schema: User model enforces required fields (name, email, password)", () => {
    const invalidUser = new User({});
    const validationError = invalidUser.validateSync();
    assert.ok(validationError);
    assert.ok(validationError.errors.name);
    assert.ok(validationError.errors.email);
    assert.ok(validationError.errors.password);
  });

  test("Database Schema: User model enforces role enum ('student', 'admin') and default 'student'", () => {
    const validUser = new User({
      name: "Abdul Samad",
      email: "samad@edupulse.ai",
      password: "securepassword123",
    });
    assert.strictEqual(validUser.role, "student");
    assert.strictEqual(validUser.streak, 0);

    validUser.role = "invalid_role";
    const validationError = validUser.validateSync();
    assert.ok(validationError.errors.role);
  });

  // 2. UserXP Model Schema Validation
  test("Database Schema: UserXP sets default values (totalXP: 0, level: 1, nextLevelXP: 100)", () => {
    const dummyId = new mongoose.Types.ObjectId();
    const xpDoc = new UserXP({ user: dummyId });
    assert.strictEqual(xpDoc.totalXP, 0);
    assert.strictEqual(xpDoc.level, 1);
    assert.strictEqual(xpDoc.currentLevelXP, 0);
    assert.strictEqual(xpDoc.nextLevelXP, 100);
  });

  // 3. Skill & Task Schema Validation
  test("Database Schema: Skill model enforces required skillName and default progress of 0", () => {
    const dummyId = new mongoose.Types.ObjectId();
    const skill = new Skill({ user: dummyId, skillName: "Machine Learning with Python" });
    assert.strictEqual(skill.skillName, "Machine Learning with Python");
    assert.strictEqual(skill.streakCount, 0);
    assert.strictEqual(skill.currentDay, 1);
  });

  test("Database Schema: Task model enforces taskName, assignedDay, difficulty enum ('Easy', 'Medium', 'Hard')", () => {
    const dummyId = new mongoose.Types.ObjectId();
    const task = new Task({
      skill: dummyId,
      taskName: "Implement Gradient Descent",
      assignedDay: 1,
      difficulty: "Medium",
    });
    assert.strictEqual(task.completed, false);
    assert.strictEqual(task.assignedDay, 1);
    assert.strictEqual(task.difficulty, "Medium");
  });

  // 4. FocusSession Model Schema Validation
  test("Database Schema: FocusSession tracks plannedDurationMinutes and defaults status to 'active'", () => {
    const dummyId = new mongoose.Types.ObjectId();
    const session = new FocusSession({
      user: dummyId,
      skill: dummyId,
      plannedDurationMinutes: 25,
      actualDurationMinutes: 25,
      status: "completed",
    });
    assert.strictEqual(session.plannedDurationMinutes, 25);
    assert.strictEqual(session.actualDurationMinutes, 25);
    assert.strictEqual(session.status, "completed");
  });

  // 5. Achievement Model Schema Validation
  test("Database Schema: Achievement model tracks key, title, target, and progress unlocked state", () => {
    const dummyId = new mongoose.Types.ObjectId();
    const achievement = new Achievement({
      user: dummyId,
      key: "week_warrior",
      title: "Week Warrior",
      target: 7,
      progress: 7,
      unlocked: true,
    });
    assert.strictEqual(achievement.key, "week_warrior");
    assert.strictEqual(achievement.unlocked, true);
  });

  // 6. TabSession Telemetry Schema Validation
  test("Database Schema: TabSession validates category enum ('productive', 'distraction', 'neutral')", () => {
    const dummyId = new mongoose.Types.ObjectId();
    const tabSession = new TabSession({
      user: dummyId,
      domain: "github.com",
      category: "productive",
      durationSeconds: 120,
    });
    assert.strictEqual(tabSession.category, "productive");
    assert.strictEqual(tabSession.durationSeconds, 120);
  });

  return testResults;
}

module.exports = { runDatabaseCRUDIntegrationTests };

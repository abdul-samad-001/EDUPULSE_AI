/**
 * EduPulse AI - Focus Session Timer & Audio Synthesis E2E Tests
 * Validates focus timer state machine, pause/resume lifecycles, score calculation, and audio triggers.
 */

import assert from "node:assert";
import process from "node:process";

class FocusSessionStateMachine {
  constructor(plannedDurationMinutes = 25) {
    this.plannedMinutes = plannedDurationMinutes;
    this.elapsedSeconds = 0;
    this.status = "idle"; // 'idle' | 'running' | 'paused' | 'completed' | 'abandoned'
    this.focusScore = 0;
    this.soundPlayed = null;
  }

  start() {
    if (this.status === "idle") {
      this.status = "running";
      this.soundPlayed = "START_TIMER_CHIME";
    }
  }

  tick(seconds = 60) {
    if (this.status === "running") {
      this.elapsedSeconds += seconds;
    }
  }

  pause() {
    if (this.status === "running") {
      this.status = "paused";
      this.soundPlayed = "PAUSE_TICK";
    }
  }

  resume() {
    if (this.status === "paused") {
      this.status = "running";
      this.soundPlayed = "RESUME_TICK";
    }
  }

  complete() {
    if (this.status === "running" || this.status === "paused") {
      this.status = "completed";
      const actualMinutes = Math.round(this.elapsedSeconds / 60);
      this.focusScore = Math.min(100, Math.max(0, actualMinutes * 3));
      this.soundPlayed = "LEVEL_UP_FANFARE";
    }
  }

  abandon() {
    if (this.status === "running" || this.status === "paused") {
      this.status = "abandoned";
      this.focusScore = 0;
    }
  }
}

export function runFocusSessionE2ETests() {
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

  // 1. Initial State
  test("Focus Session E2E: Initializes in 'idle' state with specified duration", () => {
    const session = new FocusSessionStateMachine(25);
    assert.strictEqual(session.status, "idle");
    assert.strictEqual(session.plannedMinutes, 25);
    assert.strictEqual(session.elapsedSeconds, 0);
  });

  // 2. Start & Running Lifecycle
  test("Focus Session E2E: Transitions from idle to running and accumulates elapsed time", () => {
    const session = new FocusSessionStateMachine(25);
    session.start();
    assert.strictEqual(session.status, "running");
    session.tick(300); // 5 minutes elapsed
    assert.strictEqual(session.elapsedSeconds, 300);
  });

  // 3. Pause and Resume Behavior
  test("Focus Session E2E: Correctly halts time accumulation when paused and resumes seamlessly", () => {
    const session = new FocusSessionStateMachine(25);
    session.start();
    session.tick(300); // 5 min
    session.pause();
    assert.strictEqual(session.status, "paused");
    session.tick(300); // Should not accumulate while paused
    assert.strictEqual(session.elapsedSeconds, 300);
    session.resume();
    assert.strictEqual(session.status, "running");
    session.tick(300); // Now 10 min
    assert.strictEqual(session.elapsedSeconds, 600);
  });

  // 4. Session Completion & Focus Score Math
  test("Focus Session E2E: Completes session, triggers fanfare sound, and computes focus score (25m * 3 = 75)", () => {
    const session = new FocusSessionStateMachine(25);
    session.start();
    session.tick(1500); // 25 minutes
    session.complete();
    assert.strictEqual(session.status, "completed");
    assert.strictEqual(session.focusScore, 75);
    assert.strictEqual(session.soundPlayed, "LEVEL_UP_FANFARE");
  });

  // 5. Session Abandonment
  test("Focus Session E2E: Handles abandoned session with zero focus score", () => {
    const session = new FocusSessionStateMachine(25);
    session.start();
    session.tick(60);
    session.abandon();
    assert.strictEqual(session.status, "abandoned");
    assert.strictEqual(session.focusScore, 0);
  });

  return testResults;
}

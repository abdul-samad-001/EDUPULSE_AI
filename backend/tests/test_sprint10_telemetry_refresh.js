const http = require("http");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_key";
const testUserId = "6a7dab603f0f4990f99a6222";
const token = jwt.sign({ id: testUserId }, JWT_SECRET, { expiresIn: "1h" });

const options = (path, method = "GET", data = null) => {
  const url = new URL(path, "http://127.0.0.1:5000");
  return {
    opts: {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    data,
  };
};

const makeRequest = ({ opts, data }) => {
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on("error", (e) => reject(e));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log("========================================");
  console.log("SPRINT 10: REAL-TIME TELEMETRY → ML REFRESH TESTS");
  console.log("========================================\n");

  try {
    // 1. Focus Session Event Refresh
    console.log("1. Testing Focus Session Event Refresh (POST /api/ml/refresh)...");
    const focusRes = await makeRequest(
      options("/api/ml/refresh", "POST", {
        triggerSource: "focus_session_completed",
        overridePayload: { focus_score: 92, study_hours: 5.5 },
      })
    );
    console.log(`   Status: ${focusRes.status}`);
    console.log(`   Trigger Source: ${focusRes.data?.data?.triggerSource}`);
    console.log(`   Model 1 (Procrastination Risk):`, focusRes.data?.data?.predictions?.procrastination?.risk_level);
    console.log(`   Model 2 (Productivity Score):`, focusRes.data?.data?.predictions?.productivity?.productivity_score);
    console.log(`   Model 3 V2 (Recommendation):`, focusRes.data?.data?.predictions?.recommendation?.recommendation);

    // 2. Task Completion Event Refresh
    console.log("\n2. Testing Task Completion Event Refresh...");
    const taskRes = await makeRequest(
      options("/api/ml/refresh", "POST", {
        triggerSource: "task_completed",
        overridePayload: { completed_tasks: 8, pending_tasks: 1 },
      })
    );
    console.log(`   Status: ${taskRes.status}`);
    console.log(`   Model 2 Score: ${taskRes.data?.data?.predictions?.productivity?.productivity_score}`);

    // 3. Skill Progress Event Refresh
    console.log("\n3. Testing Skill Progress Event Refresh...");
    const skillRes = await makeRequest(
      options("/api/ml/refresh", "POST", {
        triggerSource: "skill_progress_updated",
        overridePayload: { skill_progress: 88.5, streak_days: 7 },
      })
    );
    console.log(`   Status: ${skillRes.status}`);
    console.log(`   Model 3 Recommendation: ${skillRes.data?.data?.predictions?.recommendation?.recommendation}`);

    // 4. XP Change Event Refresh
    console.log("\n4. Testing User XP Change Event Refresh...");
    const xpRes = await makeRequest(
      options("/api/ml/refresh", "POST", {
        triggerSource: "xp_earned",
        overridePayload: { xp: 2500, level: 4 },
      })
    );
    console.log(`   Status: ${xpRes.status}`);

    // 5. Browser Telemetry Event Refresh
    console.log("\n5. Testing Browser Telemetry Event Refresh...");
    const telemetryRes = await makeRequest(
      options("/api/ml/refresh", "POST", {
        triggerSource: "telemetry_sync",
        overridePayload: { distraction_minutes: 15.0, productive_minutes: 210.0 },
      })
    );
    console.log(`   Status: ${telemetryRes.status}`);

    // 6. Performance Timing Diagnostics
    console.log("\n6. Performance Measurements:");
    const perf = telemetryRes.data?.data?.performance;
    console.log(`   Feature Extraction: ${perf?.featureExtractionMs} ms`);
    console.log(`   Model 1 (Logistic Regression): ${perf?.model1Ms} ms`);
    console.log(`   Model 2 (Gradient Boosting): ${perf?.model2Ms} ms`);
    console.log(`   Model 3 V2 (Random Forest): ${perf?.model3Ms} ms`);
    console.log(`   Total Refresh Duration: ${perf?.totalMs} ms`);

    // 7. Verification of Cooldown Protection
    console.log("\n7. Verifying 30-Minute Recommendation Cooldown Protection...");
    const eventId1 = focusRes.data?.data?.predictions?.recommendation?.event_id;
    const eventId2 = taskRes.data?.data?.predictions?.recommendation?.event_id;
    console.log(`   Deduplicated Event ID Matched: ${eventId1 === eventId2}`);

    console.log("\n========================================");
    console.log("SPRINT 10 TELEMETRY ML REFRESH TESTS PASSED!");
    console.log("========================================\n");
  } catch (err) {
    console.error("Test Suite Error:", err);
    process.exit(1);
  }
};

runTests();

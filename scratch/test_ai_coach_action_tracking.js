const path = require("path");
const backendNodeModules = path.join(__dirname, "../backend/node_modules");
const mongoose = require(path.join(backendNodeModules, "mongoose"));
require(path.join(backendNodeModules, "dotenv")).config({ path: path.join(__dirname, "../backend/.env") });

const User = require("../backend/src/models/User");
const Skill = require("../backend/src/models/Skill");
const FocusSession = require("../backend/src/models/FocusSession");
const RecommendationEvent = require("../backend/src/models/RecommendationEvent");
const { getUserAggregatedMetrics } = require("../backend/src/services/mlFeatureService");
const { createRecommendationEvent, respondToRecommendation, completeRecommendation } = require("../backend/src/controllers/recommendationController");
const { startFocusSession, stopFocusSession } = require("../backend/src/controllers/focusSessionController");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/edupulse";

async function runEndToEndActionTrackingTest() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // 1. Get or create test user & skill
    let user = await User.findOne({ email: "action_tracker@edupulse.ai" });
    if (!user) {
      user = await User.create({
        name: "Action Tracker Student",
        email: "action_tracker@edupulse.ai",
        password: "password123",
      });
    }

    let skill = await Skill.findOne({ user: user._id });
    if (!skill) {
      skill = await Skill.create({
        user: user._id,
        skillName: "Full Stack Coding",
        category: "Coding",
        progress: 45,
      });
    }

    console.log("\n========================================");
    console.log("AI COACH ACTION TRACKING END-TO-END TEST");
    console.log("========================================");

    // Baseline telemetry
    const initialMetrics = await getUserAggregatedMetrics(user._id);
    console.log(`\n1. Initial Baseline Telemetry:`);
    console.log(`   coding_hours: ${initialMetrics.coding_hours}`);
    console.log(`   study_hours: ${initialMetrics.study_hours}`);
    console.log(`   focus_sessions: ${initialMetrics.focus_sessions}`);

    // Step A: Create Recommendation Event (Class 3: Practice Coding)
    console.log("\n2. Generating Recommendation (Class 3: Practice Coding)...");
    const recEvent = await createRecommendationEvent(
      user._id,
      {
        recommendation_class: 3,
        recommendation: "Practice Coding",
        confidence: 0.88,
        model_type: "Random Forest",
        model_version: "v2",
      },
      { source: "action_tracking_test" }
    );
    console.log(`   Event ID: ${recEvent._id}, Status: ${recEvent.status}`);
    if (recEvent.status !== "shown") {
      recEvent.status = "shown";
      await recEvent.save();
    }

    // Step B: Accept Recommendation (CTA Click -> status: accepted)
    console.log("\n3. Student Clicks CTA: 'Start Coding Focus Session'...");
    const reqRespond = {
      user: { _id: user._id },
      params: { id: recEvent._id.toString() },
      body: { status: "accepted", actionType: "cta_click", actionTarget: "coding" },
    };
    let respondResult = null;
    const resRespond = {
      status: (code) => ({
        json: (data) => { respondResult = data; return data; }
      })
    };
    await respondToRecommendation(reqRespond, resRespond);
    console.log(`   Accept Response Status: ${respondResult?.data?.status}`);
    if (respondResult?.data?.status !== "accepted") {
      throw new Error("Failed to set recommendation status to accepted.");
    }

    // Step C: Start Coding Focus Session (category: coding)
    console.log("\n4. Starting Coding Focus Session...");
    const reqStart = {
      user: { _id: user._id },
      body: {
        skill: skill._id.toString(),
        plannedDurationMinutes: 30,
        notes: "Building REST endpoints",
        category: "coding",
        recommendationId: recEvent._id.toString(),
      },
    };
    let startResult = null;
    const resStart = {
      status: (code) => ({
        json: (data) => { startResult = data; return data; }
      })
    };
    // Clear any leftover active sessions first
    await FocusSession.updateMany({ user: user._id, status: "active" }, { status: "abandoned" });

    await startFocusSession(reqStart, resStart);
    console.log(`   Focus Session ID: ${startResult?.data?._id}, Category: ${startResult?.data?.category}`);

    // Step D: Simulate measurable session duration (e.g. 35 mins)
    console.log("\n5. Simulating 35-minute Coding Session duration...");
    const activeSession = await FocusSession.findById(startResult.data._id);
    activeSession.startedAt = new Date(Date.now() - 35 * 60 * 1000);
    await activeSession.save();

    // Step E: Stop/Complete Coding Focus Session
    console.log("\n6. Completing Coding Focus Session...");
    const reqStop = {
      user: { _id: user._id },
      body: { recommendationId: recEvent._id.toString() },
    };
    let stopResult = null;
    const resStop = {
      status: (code) => ({
        json: (data) => { stopResult = data; return data; }
      })
    };
    await stopFocusSession(reqStop, resStop);
    console.log(`   Session Status: ${stopResult?.data?.status}, Actual Duration: ${stopResult?.data?.actualDurationMinutes} mins`);

    // Step F: Verify Recommendation Event is now COMPLETED
    console.log("\n7. Verifying Recommendation Event status...");
    const updatedRecEvent = await RecommendationEvent.findById(recEvent._id);
    console.log(`   Recommendation Event Status: ${updatedRecEvent.status}`);
    if (updatedRecEvent.status !== "completed") {
      throw new Error(`Expected RecommendationEvent status to be completed, got ${updatedRecEvent.status}`);
    }

    // Step G: Verify Telemetry Update
    console.log("\n8. Verifying Telemetry Aggregation Update...");
    const updatedMetrics = await getUserAggregatedMetrics(user._id);
    console.log(`   Updated coding_hours: ${updatedMetrics.coding_hours} (Initial: ${initialMetrics.coding_hours})`);
    console.log(`   Updated study_hours: ${updatedMetrics.study_hours} (Initial: ${initialMetrics.study_hours})`);
    console.log(`   Updated focus_sessions: ${updatedMetrics.focus_sessions} (Initial: ${initialMetrics.focus_sessions})`);

    const codingHoursIncreased = updatedMetrics.coding_hours > initialMetrics.coding_hours;
    console.log(`   coding_hours Increased Correctly: ${codingHoursIncreased}`);
    if (!codingHoursIncreased) {
      throw new Error("coding_hours failed to increase after completed coding focus session.");
    }

    console.log("\n========================================");
    console.log("ACTION TRACKING END-TO-END TEST PASSED!");
    console.log("========================================");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Action Tracking Test Error:", err);
    process.exit(1);
  }
}

runEndToEndActionTrackingTest();

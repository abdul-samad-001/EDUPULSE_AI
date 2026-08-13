const path = require("path");
const backendNodeModules = path.join(__dirname, "../backend/node_modules");

const mongoose = require(path.join(backendNodeModules, "mongoose"));
require(path.join(backendNodeModules, "dotenv")).config({ path: path.join(__dirname, "../backend/.env") });

const RecommendationEvent = require("../backend/src/models/RecommendationEvent");
const FocusSession = require("../backend/src/models/FocusSession");
const Task = require("../backend/src/models/Task");
const Skill = require("../backend/src/models/Skill");
const UserXP = require("../backend/src/models/UserXP");
const TabSession = require("../backend/src/models/TabSession");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/edupulse";

const CLASS_MAP = {
  0: "Continue Current Skill",
  1: "Start Focus Session",
  2: "Take Short Break",
  3: "Practice Coding",
  4: "Revision",
  5: "Watch Learning Video",
  6: "Complete Pending Tasks",
  7: "Attempt Quiz",
};

async function runAuditAndEffectivenessAnalysis() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for Sprint 11 Step 2 Analysis...");

    const events = await RecommendationEvent.find().lean();
    console.log(`Total RecommendationEvent records found: ${events.length}`);

    const focusSessions = await FocusSession.find().lean();
    const tasks = await Task.find().lean();
    const skills = await Skill.find().lean();
    const tabSessions = await TabSession.find().lean();
    const userXPs = await UserXP.find().lean();

    console.log(`Focus Sessions: ${focusSessions.length}`);
    console.log(`Tasks: ${tasks.length}`);
    console.log(`Skills: ${skills.length}`);
    console.log(`Tab Sessions: ${tabSessions.length}`);
    console.log(`User XPs: ${userXPs.length}`);

    // Data Quality Checks
    let missingTimestamps = 0;
    let missingUserIds = 0;
    let invalidClasses = 0;
    let invalidStatuses = 0;
    const eventIdSet = new Set();
    let duplicateIds = 0;

    events.forEach((e) => {
      if (!e.shownAt) missingTimestamps++;
      if (!e.user) missingUserIds++;
      if (e.recommendationClass < 0 || e.recommendationClass > 7) invalidClasses++;
      if (!["shown", "accepted", "dismissed", "ignored", "completed"].includes(e.status)) {
        invalidStatuses++;
      }
      if (eventIdSet.has(e._id.toString())) duplicateIds++;
      else eventIdSet.add(e._id.toString());
    });

    console.log("\n--- DATA QUALITY CHECK ---");
    console.log(`Missing Timestamps: ${missingTimestamps}`);
    console.log(`Missing User IDs: ${missingUserIds}`);
    console.log(`Invalid Recommendation Classes: ${invalidClasses}`);
    console.log(`Invalid Status Values: ${invalidStatuses}`);
    console.log(`Duplicate Event IDs: ${duplicateIds}`);

    // Engagement Metrics Calculation
    const totalShown = events.length;
    let accepted = 0;
    let dismissed = 0;
    let ignored = 0;
    let completed = 0;

    events.forEach((e) => {
      if (e.status === "accepted") accepted++;
      else if (e.status === "dismissed") dismissed++;
      else if (e.status === "ignored") ignored++;
      else if (e.status === "completed") {
        completed++;
        accepted++; // Completed implies accepted
      }
    });

    const acceptanceRate = totalShown > 0 ? ((accepted / totalShown) * 100).toFixed(2) : "0.00";
    const dismissalRate = totalShown > 0 ? ((dismissed / totalShown) * 100).toFixed(2) : "0.00";
    const ignoreRate = totalShown > 0 ? ((ignored / totalShown) * 100).toFixed(2) : "0.00";
    const completionRate = totalShown > 0 ? ((completed / totalShown) * 100).toFixed(2) : "0.00";
    const completionAmongAccepted = accepted > 0 ? ((completed / accepted) * 100).toFixed(2) : "0.00";

    console.log("\n--- ENGAGEMENT METRICS ---");
    console.log(`Total Shown: ${totalShown}`);
    console.log(`Accepted: ${accepted} (${acceptanceRate}%)`);
    console.log(`Dismissed: ${dismissed} (${dismissalRate}%)`);
    console.log(`Ignored: ${ignored} (${ignoreRate}%)`);
    console.log(`Completed: ${completed} (${completionRate}%)`);
    console.log(`Completion Among Accepted: ${completionAmongAccepted}%`);

    // Class-Level Metrics
    const classMetrics = {};
    for (let c = 0; c <= 7; c++) {
      classMetrics[c] = {
        className: CLASS_MAP[c],
        total: 0,
        accepted: 0,
        dismissed: 0,
        ignored: 0,
        completed: 0,
      };
    }

    events.forEach((e) => {
      const c = e.recommendationClass ?? 6;
      if (classMetrics[c]) {
        classMetrics[c].total++;
        if (e.status === "accepted") classMetrics[c].accepted++;
        else if (e.status === "dismissed") classMetrics[c].dismissed++;
        else if (e.status === "ignored") classMetrics[c].ignored++;
        else if (e.status === "completed") {
          classMetrics[c].completed++;
          classMetrics[c].accepted++;
        }
      }
    });

    console.log("\n--- CLASS-LEVEL ANALYSIS ---");
    console.table(
      Object.entries(classMetrics).map(([c, m]) => ({
        Class: c,
        Name: m.className,
        Total: m.total,
        Accepted: m.accepted,
        Dismissed: m.dismissed,
        Ignored: m.ignored,
        Completed: m.completed,
        "Accept Rate (%)": m.total > 0 ? ((m.accepted / m.total) * 100).toFixed(1) : "0.0",
        "Comp Rate (%)": m.total > 0 ? ((m.completed / m.total) * 100).toFixed(1) : "0.0",
        "Comp Among Acc (%)": m.accepted > 0 ? ((m.completed / m.accepted) * 100).toFixed(1) : "0.0",
      }))
    );

    // Temporal & Pre/Post Behavioral Analysis
    console.log("\n--- TEMPORAL & PRE/POST BEHAVIORAL ANALYSIS ---");
    let usableTemporalEvents = 0;
    const behavioralDeltas = [];

    events.forEach((e) => {
      if (!e.shownAt || !e.user) return;
      const shownTime = new Date(e.shownAt).getTime();
      const userIdStr = e.user.toString();

      // Pre window: 30 mins before shownAt
      const preStart = shownTime - 30 * 60 * 1000;
      const preEnd = shownTime;

      // Post window: 30 mins after shownAt
      const postStart = shownTime;
      const postEnd = shownTime + 30 * 60 * 1000;

      // Telemetry in Pre Window
      const preTabs = tabSessions.filter((t) => {
        if (!t.user) return false;
        if (t.user.toString() !== userIdStr) return false;
        const tStart = new Date(t.startedAt).getTime();
        return tStart >= preStart && tStart < preEnd;
      });

      // Telemetry in Post Window
      const postTabs = tabSessions.filter((t) => {
        if (!t.user) return false;
        if (t.user.toString() !== userIdStr) return false;
        const tStart = new Date(t.startedAt).getTime();
        return tStart >= postStart && tStart < postEnd;
      });

      const preProductiveMins = preTabs
        .filter((t) => t.category === "productive")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const postProductiveMins = postTabs
        .filter((t) => t.category === "productive")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const preDistractionMins = preTabs
        .filter((t) => t.category === "distraction")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const postDistractionMins = postTabs
        .filter((t) => t.category === "distraction")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const productiveDelta = postProductiveMins - preProductiveMins;
      const distractionDelta = postDistractionMins - preDistractionMins;

      behavioralDeltas.push({
        eventId: e._id.toString(),
        userId: userIdStr,
        status: e.status,
        recommendationClass: e.recommendationClass,
        confidence: e.confidence,
        shownAt: e.shownAt,
        preProductiveMins,
        postProductiveMins,
        productiveDelta,
        preDistractionMins,
        postDistractionMins,
        distractionDelta,
        hasTelemetry: preTabs.length > 0 || postTabs.length > 0,
      });

      if (preTabs.length > 0 || postTabs.length > 0) {
        usableTemporalEvents++;
      }
    });

    console.log(`Total Usable Temporal Observations: ${usableTemporalEvents} / ${events.length}`);

    // Group Confidence Ranges
    const confidenceRanges = {
      "0.00–0.49": { total: 0, accepted: 0, completed: 0 },
      "0.50–0.69": { total: 0, accepted: 0, completed: 0 },
      "0.70–0.89": { total: 0, accepted: 0, completed: 0 },
      "0.90–1.00": { total: 0, accepted: 0, completed: 0 },
    };

    events.forEach((e) => {
      const conf = e.confidence ?? 0;
      let rangeKey = "0.00–0.49";
      if (conf >= 0.9) rangeKey = "0.90–1.00";
      else if (conf >= 0.7) rangeKey = "0.70–0.89";
      else if (conf >= 0.5) rangeKey = "0.50–0.69";

      confidenceRanges[rangeKey].total++;
      if (["accepted", "completed"].includes(e.status)) confidenceRanges[rangeKey].accepted++;
      if (e.status === "completed") confidenceRanges[rangeKey].completed++;
    });

    console.log("\n--- CONFIDENCE ANALYSIS ---");
    console.table(
      Object.entries(confidenceRanges).map(([range, r]) => ({
        Range: range,
        Total: r.total,
        Accepted: r.accepted,
        Completed: r.completed,
        "Accept Rate (%)": r.total > 0 ? ((r.accepted / r.total) * 100).toFixed(1) : "0.0",
        "Comp Rate (%)": r.total > 0 ? ((r.completed / r.total) * 100).toFixed(1) : "0.0",
      }))
    );

    await mongoose.disconnect();
    console.log("\nAudit script complete!");
  } catch (err) {
    console.error("Audit error:", err);
    process.exit(1);
  }
}

runAuditAndEffectivenessAnalysis();

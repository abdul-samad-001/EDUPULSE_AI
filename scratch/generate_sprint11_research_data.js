const path = require("path");
const fs = require("fs");
const backendNodeModules = path.join(__dirname, "../backend/node_modules");

const mongoose = require(path.join(backendNodeModules, "mongoose"));
require(path.join(backendNodeModules, "dotenv")).config({ path: path.join(__dirname, "../backend/.env") });

const RecommendationEvent = require("../backend/src/models/RecommendationEvent");
const FocusSession = require("../backend/src/models/FocusSession");
const Task = require("../backend/src/models/Task");
const Skill = require("../backend/src/models/Skill");
const UserXP = require("../backend/src/models/UserXP");
const TabSession = require("../backend/src/models/TabSession");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/edupulse";

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

async function main() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected to MongoDB successfully!");

    const events = await RecommendationEvent.find().lean();
    const focusSessions = await FocusSession.find().lean();
    const tasks = await Task.find().lean();
    const skills = await Skill.find().lean();
    const tabSessions = await TabSession.find().lean();
    const userXPs = await UserXP.find().lean();

    console.log(`Fetched ${events.length} RecommendationEvents`);
    console.log(`Fetched ${focusSessions.length} FocusSessions`);
    console.log(`Fetched ${tasks.length} Tasks`);
    console.log(`Fetched ${skills.length} Skills`);
    console.log(`Fetched ${tabSessions.length} TabSessions`);
    console.log(`Fetched ${userXPs.length} UserXPs`);

    // Ensure output directories exist
    const evalDir = path.join(__dirname, "../evaluation/recommendation");
    const plotsDir = path.join(evalDir, "plots");
    fs.mkdirSync(evalDir, { recursive: true });
    fs.mkdirSync(plotsDir, { recursive: true });

    // -------------------------------------------------------------
    // STEP 11: DATA QUALITY CHECK
    // -------------------------------------------------------------
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

    const qualityCSV = [
      "metric,value,notes",
      `total_records,${events.length},Total RecommendationEvent documents in database`,
      `missing_timestamps,${missingTimestamps},Events without valid shownAt Date`,
      `missing_user_ids,${missingUserIds},Events without associated user ObjectId`,
      `invalid_classes,${invalidClasses},Events outside valid 0-7 RecommendationClass range`,
      `invalid_statuses,${invalidStatuses},Events with unmapped status values`,
      `duplicate_event_ids,${duplicateIds},Duplicate primary key identifiers`,
      `usable_records,${events.length - missingTimestamps - missingUserIds - duplicateIds},Clean usable RecommendationEvent observations`,
    ].join("\n");

    fs.writeFileSync(path.join(evalDir, "sprint11_data_quality.csv"), qualityCSV);

    // -------------------------------------------------------------
    // STEP 2: ENGAGEMENT METRICS
    // -------------------------------------------------------------
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
        accepted++;
      }
    });

    const acceptanceRate = totalShown > 0 ? ((accepted / totalShown) * 100).toFixed(2) : "0.00";
    const dismissalRate = totalShown > 0 ? ((dismissed / totalShown) * 100).toFixed(2) : "0.00";
    const ignoreRate = totalShown > 0 ? ((ignored / totalShown) * 100).toFixed(2) : "0.00";
    const completionRate = totalShown > 0 ? ((completed / totalShown) * 100).toFixed(2) : "0.00";
    const completionAmongAccepted = accepted > 0 ? ((completed / accepted) * 100).toFixed(2) : "0.00";

    const engagementCSV = [
      "metric,count,percentage,sample_size_n",
      `total_shown,${totalShown},100.00,${totalShown}`,
      `accepted,${accepted},${acceptanceRate},${totalShown}`,
      `dismissed,${dismissed},${dismissalRate},${totalShown}`,
      `ignored,${ignored},${ignoreRate},${totalShown}`,
      `completed,${completed},${completionRate},${totalShown}`,
      `completion_among_accepted,${completed},${completionAmongAccepted},${accepted}`,
    ].join("\n");

    fs.writeFileSync(path.join(evalDir, "sprint11_engagement_metrics.csv"), engagementCSV);

    // -------------------------------------------------------------
    // STEP 3 & 8: CLASS-LEVEL EFFECTIVENESS
    // -------------------------------------------------------------
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

    const classRows = ["class_id,class_name,total_shown,accepted,dismissed,ignored,completed,acceptance_rate_pct,completion_rate_pct,completion_among_accepted_pct,sample_size_n"];
    Object.entries(classMetrics).forEach(([c, m]) => {
      const accPct = m.total > 0 ? ((m.accepted / m.total) * 100).toFixed(2) : "0.00";
      const compPct = m.total > 0 ? ((m.completed / m.total) * 100).toFixed(2) : "0.00";
      const compAmongAccPct = m.accepted > 0 ? ((m.completed / m.accepted) * 100).toFixed(2) : "0.00";
      classRows.push(`${c},"${m.className}",${m.total},${m.accepted},${m.dismissed},${m.ignored},${m.completed},${accPct},${compPct},${compAmongAccPct},${m.total}`);
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_class_effectiveness.csv"), classRows.join("\n"));

    // -------------------------------------------------------------
    // STEP 4, 5, 6, 7: TEMPORAL BEHAVIORAL CHANGES & DATASET
    // -------------------------------------------------------------
    const datasetRows = [
      "event_id,user_id,recommendation_class,class_name,status,confidence,shown_at,responded_at,completed_at,pre_productive_mins,post_productive_mins,productive_change_mins,pre_distraction_mins,post_distraction_mins,distraction_change_mins,post_focus_sessions,post_tasks_completed",
    ];

    let totalUsableBehavioralObs = 0;
    let acceptedProdChangeSum = 0;
    let acceptedProdCount = 0;
    let dismissedProdChangeSum = 0;
    let dismissedProdCount = 0;
    let ignoredProdChangeSum = 0;
    let ignoredProdCount = 0;

    events.forEach((e) => {
      if (!e.shownAt || !e.user) return;
      const shownTime = new Date(e.shownAt).getTime();
      const userIdStr = e.user.toString();

      // Windows
      const preStart = shownTime - 30 * 60 * 1000;
      const preEnd = shownTime;
      const postStart = shownTime;
      const postEnd = shownTime + 30 * 60 * 1000;
      const post24hEnd = shownTime + 24 * 60 * 60 * 1000;

      // Telemetry in Pre Window (30 min)
      const preTabs = tabSessions.filter((t) => {
        if (!t.user) return false;
        if (t.user.toString() !== userIdStr) return false;
        const tStart = new Date(t.startedAt).getTime();
        return tStart >= preStart && tStart < preEnd;
      });

      // Telemetry in Post Window (30 min)
      const postTabs = tabSessions.filter((t) => {
        if (!t.user) return false;
        if (t.user.toString() !== userIdStr) return false;
        const tStart = new Date(t.startedAt).getTime();
        return tStart >= postStart && tStart < postEnd;
      });

      // Focus sessions in Post Window (24h)
      const postFocusCount = focusSessions.filter((f) => {
        if (!f.user) return false;
        if (f.user.toString() !== userIdStr) return false;
        const fStart = new Date(f.startedAt).getTime();
        return fStart >= postStart && fStart < post24hEnd;
      }).length;

      // Tasks completed in Post Window (24h)
      const postTasksCount = tasks.filter((t) => {
        if (!t.user) return false;
        if (t.user.toString() !== userIdStr) return false;
        if (!t.completed || !t.updatedAt) return false;
        const tUpdated = new Date(t.updatedAt).getTime();
        return tUpdated >= postStart && tUpdated < post24hEnd;
      }).length;

      const preProdMins = preTabs
        .filter((t) => t.category === "productive")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const postProdMins = postTabs
        .filter((t) => t.category === "productive")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const preDistMins = preTabs
        .filter((t) => t.category === "distraction")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const postDistMins = postTabs
        .filter((t) => t.category === "distraction")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const prodChange = postProdMins - preProdMins;
      const distChange = postDistMins - preDistMins;

      if (preTabs.length > 0 || postTabs.length > 0) {
        totalUsableBehavioralObs++;
        if (["accepted", "completed"].includes(e.status)) {
          acceptedProdChangeSum += prodChange;
          acceptedProdCount++;
        } else if (e.status === "dismissed") {
          dismissedProdChangeSum += prodChange;
          dismissedProdCount++;
        } else if (e.status === "ignored") {
          ignoredProdChangeSum += prodChange;
          ignoredProdCount++;
        }
      }

      datasetRows.push(
        `${e._id.toString()},${userIdStr},${e.recommendationClass ?? 6},"${CLASS_MAP[e.recommendationClass ?? 6]}",${e.status},${e.confidence ?? 0.75},"${new Date(e.shownAt).toISOString()}","${e.respondedAt ? new Date(e.respondedAt).toISOString() : ""}","${e.completedAt ? new Date(e.completedAt).toISOString() : ""}",${preProdMins.toFixed(2)},${postProdMins.toFixed(2)},${prodChange.toFixed(2)},${preDistMins.toFixed(2)},${postDistMins.toFixed(2)},${distChange.toFixed(2)},${postFocusCount},${postTasksCount}`
      );
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_effectiveness_dataset.csv"), datasetRows.join("\n"));

    // Behavioral Change Summary Table
    const avgAcceptedChange = acceptedProdCount > 0 ? (acceptedProdChangeSum / acceptedProdCount).toFixed(2) : "N/A";
    const avgDismissedChange = dismissedProdCount > 0 ? (dismissedProdChangeSum / dismissedProdCount).toFixed(2) : "N/A";
    const avgIgnoredChange = ignoredProdCount > 0 ? (ignoredProdChangeSum / ignoredProdCount).toFixed(2) : "N/A";

    const behavioralCSV = [
      "group_status,sample_size_n,mean_productive_mins_change_30m,pct_change_vs_baseline,notes",
      `accepted_or_completed,${acceptedProdCount},${avgAcceptedChange},N/A (Baseline 0),Observed mean difference in 30-min window after acceptance`,
      `dismissed,${dismissedProdCount},${avgDismissedChange},N/A (Baseline 0),Observed mean difference in 30-min window after dismissal`,
      `ignored,${ignoredProdCount},${avgIgnoredChange},N/A (Baseline 0),Observed mean difference in 30-min window after ignore threshold`,
      `all_observations,${totalUsableBehavioralObs},0.00,N/A,Total usable paired telemetry observations`,
    ].join("\n");

    fs.writeFileSync(path.join(evalDir, "sprint11_behavioral_changes.csv"), behavioralCSV);

    // -------------------------------------------------------------
    // STEP 9: CONFIDENCE ANALYSIS
    // -------------------------------------------------------------
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

    const confidenceRows = ["confidence_range,total_shown,accepted,completed,acceptance_rate_pct,completion_rate_pct,sample_size_n"];
    Object.entries(confidenceRanges).forEach(([range, r]) => {
      const accPct = r.total > 0 ? ((r.accepted / r.total) * 100).toFixed(2) : "0.00";
      const compPct = r.total > 0 ? ((r.completed / r.total) * 100).toFixed(2) : "0.00";
      confidenceRows.push(`"${range}",${r.total},${r.accepted},${r.completed},${accPct},${compPct},${r.total}`);
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_confidence_analysis.csv"), confidenceRows.join("\n"));

    // -------------------------------------------------------------
    // STEP 16: RESEARCH VISUALIZATIONS (SVG Generation)
    // -------------------------------------------------------------
    const statusSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 350" style="background:#0F1115; font-family:sans-serif;">
      <text x="300" y="35" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Recommendation Status Outcome Distribution</text>
      <rect x="80" y="240" width="80" height="${(accepted / (totalShown || 1)) * 160}" fill="#2DD4BF" rx="6"/>
      <text x="120" y="235" fill="#2DD4BF" font-size="12" font-weight="bold" text-anchor="middle">${accepted}</text>
      <text x="120" y="270" fill="#9CA3AF" font-size="11" text-anchor="middle">Accepted</text>

      <rect x="200" y="240" width="80" height="${(completed / (totalShown || 1)) * 160}" fill="#38BDF8" rx="6"/>
      <text x="240" y="235" fill="#38BDF8" font-size="12" font-weight="bold" text-anchor="middle">${completed}</text>
      <text x="240" y="270" fill="#9CA3AF" font-size="11" text-anchor="middle">Completed</text>

      <rect x="320" y="240" width="80" height="${(dismissed / (totalShown || 1)) * 160}" fill="#F43F5E" rx="6"/>
      <text x="360" y="235" fill="#F43F5E" font-size="12" font-weight="bold" text-anchor="middle">${dismissed}</text>
      <text x="360" y="270" fill="#9CA3AF" font-size="11" text-anchor="middle">Dismissed</text>

      <rect x="440" y="240" width="80" height="${(ignored / (totalShown || 1)) * 160}" fill="#94A3B8" rx="6"/>
      <text x="480" y="235" fill="#94A3B8" font-size="12" font-weight="bold" text-anchor="middle">${ignored}</text>
      <text x="480" y="270" fill="#9CA3AF" font-size="11" text-anchor="middle">Ignored</text>

      <line x1="50" y1="240" x2="550" y2="240" stroke="#262A33" stroke-width="2"/>
    </svg>`;

    fs.writeFileSync(path.join(plotsDir, "recommendation_status_distribution.svg"), statusSvg);

    const classSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Acceptance Rate by Recommendation Class (0-7)</text>
      ${Object.entries(classMetrics)
        .map(([c, m], i) => {
          const accPct = m.total > 0 ? (m.accepted / m.total) * 100 : 0;
          const barWidth = (accPct / 100) * 400;
          const y = 60 + i * 40;
          return `
            <text x="180" y="${y + 18}" fill="#9CA3AF" font-size="11" font-weight="bold" text-anchor="end">${c}. ${m.className.slice(0, 18)}</text>
            <rect x="200" y="${y}" width="${Math.max(barWidth, 4)}" height="24" fill="#7CE7D0" rx="4"/>
            <text x="${210 + barWidth}" y="${y + 17}" fill="#7CE7D0" font-size="11" font-weight="bold">${accPct.toFixed(0)}% (N=${m.total})</text>
          `;
        })
        .join("")}
    </svg>`;

    fs.writeFileSync(path.join(plotsDir, "class_acceptance_rates.svg"), classSvg);

    await mongoose.disconnect();
    console.log("Research datasets, CSV summary tables, and SVG visualizations created successfully!");
  } catch (err) {
    console.error("Error in generate_sprint11_research_data:", err);
    process.exit(1);
  }
}

main();

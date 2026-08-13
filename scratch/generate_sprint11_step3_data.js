const path = require("path");
const fs = require("fs");
const backendNodeModules = path.join(__dirname, "../backend/node_modules");

const mongoose = require(path.join(backendNodeModules, "mongoose"));
require(path.join(backendNodeModules, "dotenv")).config({ path: path.join(__dirname, "../backend/.env") });

const RecommendationEvent = require("../backend/src/models/RecommendationEvent");
const FocusSession = require("../backend/src/models/FocusSession");
const Task = require("../backend/src/models/Task");
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

function getSampleSizeFlag(n) {
  if (n >= 30) return "adequate for descriptive analysis";
  if (n >= 10) return "small sample — interpret cautiously";
  if (n >= 1) return "very small sample — insufficient for reliable class-level generalization";
  return "no observed data";
}

async function main() {
  try {
    console.log("Connecting to MongoDB Atlas for Sprint 11 Step 3 Analysis...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected successfully!");

    const events = await RecommendationEvent.find().lean();
    const focusSessions = await FocusSession.find().lean();
    const tasks = await Task.find().lean();
    const tabSessions = await TabSession.find().lean();

    const evalDir = path.join(__dirname, "../evaluation/recommendation");
    const plotsDir = path.join(evalDir, "plots");
    fs.mkdirSync(evalDir, { recursive: true });
    fs.mkdirSync(plotsDir, { recursive: true });

    // -------------------------------------------------------------
    // CLASS DATA ACCUMULATION (CLASSES 0–7)
    // -------------------------------------------------------------
    const classStats = {};
    for (let c = 0; c <= 7; c++) {
      classStats[c] = {
        classId: c,
        className: CLASS_MAP[c],
        total: 0,
        accepted: 0,
        dismissed: 0,
        ignored: 0,
        completed: 0,
        confidences: [],
        preProdMinsList: [],
        postProdMinsList: [],
        prodChangesList: [],
        preDistMinsList: [],
        postDistMinsList: [],
        distChangesList: [],
        acceptedProdChanges: [],
        nonAcceptedProdChanges: [],
        post24hTasksList: [],
        post24hFocusList: [],
      };
    }

    events.forEach((e) => {
      const c = e.recommendationClass ?? 6;
      if (!classStats[c]) return;

      const cs = classStats[c];
      cs.total++;
      if (e.confidence !== undefined && e.confidence !== null) {
        cs.confidences.push(e.confidence);
      }

      if (e.status === "accepted") cs.accepted++;
      else if (e.status === "dismissed") cs.dismissed++;
      else if (e.status === "ignored") cs.ignored++;
      else if (e.status === "completed") {
        cs.completed++;
        cs.accepted++;
      }

      if (!e.shownAt || !e.user) return;
      const shownTime = new Date(e.shownAt).getTime();
      const userIdStr = e.user.toString();

      const preStart = shownTime - 30 * 60 * 1000;
      const preEnd = shownTime;
      const postStart = shownTime;
      const postEnd = shownTime + 30 * 60 * 1000;
      const post24hEnd = shownTime + 24 * 60 * 60 * 1000;

      const preTabs = tabSessions.filter((t) => {
        if (!t.user) return false;
        if (t.user.toString() !== userIdStr) return false;
        const tStart = new Date(t.startedAt).getTime();
        return tStart >= preStart && tStart < preEnd;
      });

      const postTabs = tabSessions.filter((t) => {
        if (!t.user) return false;
        if (t.user.toString() !== userIdStr) return false;
        const tStart = new Date(t.startedAt).getTime();
        return tStart >= postStart && tStart < postEnd;
      });

      const postFocusCount = focusSessions.filter((f) => {
        if (!f.user) return false;
        if (f.user.toString() !== userIdStr) return false;
        const fStart = new Date(f.startedAt).getTime();
        return fStart >= postStart && fStart < post24hEnd;
      }).length;

      const postTasksCount = tasks.filter((t) => {
        if (!t.user) return false;
        if (t.user.toString() !== userIdStr) return false;
        if (!t.completed || !t.updatedAt) return false;
        const tUpdated = new Date(t.updatedAt).getTime();
        return tUpdated >= postStart && tUpdated < post24hEnd;
      }).length;

      const preProd = preTabs
        .filter((t) => t.category === "productive")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const postProd = postTabs
        .filter((t) => t.category === "productive")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const preDist = preTabs
        .filter((t) => t.category === "distraction")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const postDist = postTabs
        .filter((t) => t.category === "distraction")
        .reduce((sum, t) => sum + (t.durationSeconds || 0) / 60, 0);

      const prodChange = postProd - preProd;
      const distChange = postDist - preDist;

      cs.preProdMinsList.push(preProd);
      cs.postProdMinsList.push(postProd);
      cs.prodChangesList.push(prodChange);
      cs.preDistMinsList.push(preDist);
      cs.postDistMinsList.push(postDist);
      cs.distChangesList.push(distChange);
      cs.post24hTasksList.push(postTasksCount);
      cs.post24hFocusList.push(postFocusCount);

      if (["accepted", "completed"].includes(e.status)) {
        cs.acceptedProdChanges.push(prodChange);
      } else {
        cs.nonAcceptedProdChanges.push(prodChange);
      }
    });

    // -------------------------------------------------------------
    // CSV 1: sprint11_class_analysis.csv
    // -------------------------------------------------------------
    const classAnalysisRows = [
      "class_id,class_name,total_shown_n,accepted,dismissed,ignored,completed,acceptance_rate_pct,dismissal_rate_pct,ignore_rate_pct,completion_rate_pct,completion_among_accepted_pct,sample_size_flag",
    ];

    Object.values(classStats).forEach((cs) => {
      const n = cs.total;
      const accRate = n > 0 ? ((cs.accepted / n) * 100).toFixed(2) : "0.00";
      const dismRate = n > 0 ? ((cs.dismissed / n) * 100).toFixed(2) : "0.00";
      const ignRate = n > 0 ? ((cs.ignored / n) * 100).toFixed(2) : "0.00";
      const compRate = n > 0 ? ((cs.completed / n) * 100).toFixed(2) : "0.00";
      const compAmongAcc = cs.accepted > 0 ? ((cs.completed / cs.accepted) * 100).toFixed(2) : "0.00";
      const flag = getSampleSizeFlag(n);

      classAnalysisRows.push(
        `${cs.classId},"${cs.className}",${n},${cs.accepted},${cs.dismissed},${cs.ignored},${cs.completed},${accRate},${dismRate},${ignRate},${compRate},${compAmongAcc},"${flag}"`
      );
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_class_analysis.csv"), classAnalysisRows.join("\n"));

    // -------------------------------------------------------------
    // CSV 2: sprint11_class_behavioral_analysis.csv
    // -------------------------------------------------------------
    const behavioralRows = [
      "class_id,class_name,sample_size_n,mean_pre_prod_mins,mean_post_prod_mins,mean_productive_change_mins,mean_distraction_change_mins,mean_post_24h_tasks,mean_post_24h_focus,accepted_n,accepted_mean_prod_change,non_accepted_n,non_accepted_mean_prod_change",
    ];

    Object.values(classStats).forEach((cs) => {
      const n = cs.total;
      const meanPreProd = n > 0 ? (cs.preProdMinsList.reduce((a, b) => a + b, 0) / n).toFixed(2) : "0.00";
      const meanPostProd = n > 0 ? (cs.postProdMinsList.reduce((a, b) => a + b, 0) / n).toFixed(2) : "0.00";
      const meanProdChange = n > 0 ? (cs.prodChangesList.reduce((a, b) => a + b, 0) / n).toFixed(2) : "0.00";
      const meanDistChange = n > 0 ? (cs.distChangesList.reduce((a, b) => a + b, 0) / n).toFixed(2) : "0.00";
      const meanTasks = n > 0 ? (cs.post24hTasksList.reduce((a, b) => a + b, 0) / n).toFixed(2) : "0.00";
      const meanFocus = n > 0 ? (cs.post24hFocusList.reduce((a, b) => a + b, 0) / n).toFixed(2) : "0.00";

      const accN = cs.acceptedProdChanges.length;
      const accMeanProdChange = accN > 0 ? (cs.acceptedProdChanges.reduce((a, b) => a + b, 0) / accN).toFixed(2) : "N/A";

      const nonAccN = cs.nonAcceptedProdChanges.length;
      const nonAccMeanProdChange = nonAccN > 0 ? (cs.nonAcceptedProdChanges.reduce((a, b) => a + b, 0) / nonAccN).toFixed(2) : "N/A";

      behavioralRows.push(
        `${cs.classId},"${cs.className}",${n},${meanPreProd},${meanPostProd},${meanProdChange},${meanDistChange},${meanTasks},${meanFocus},${accN},${accMeanProdChange},${nonAccN},${nonAccMeanProdChange}`
      );
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_class_behavioral_analysis.csv"), behavioralRows.join("\n"));

    // -------------------------------------------------------------
    // CSV 3: sprint11_class_confidence_analysis.csv
    // -------------------------------------------------------------
    const confidenceRows = [
      "class_id,class_name,sample_size_n,mean_confidence,median_confidence,min_confidence,max_confidence,high_confidence_accepted_rate_pct",
    ];

    Object.values(classStats).forEach((cs) => {
      const n = cs.confidences.length;
      if (n === 0) {
        confidenceRows.push(`${cs.classId},"${cs.className}",0,0.00,0.00,0.00,0.00,0.00`);
        return;
      }

      const sortedConf = [...cs.confidences].sort((a, b) => a - b);
      const meanConf = (cs.confidences.reduce((a, b) => a + b, 0) / n).toFixed(2);
      const minConf = sortedConf[0].toFixed(2);
      const maxConf = sortedConf[n - 1].toFixed(2);
      const medianConf = (n % 2 === 1 ? sortedConf[Math.floor(n / 2)] : (sortedConf[n / 2 - 1] + sortedConf[n / 2]) / 2).toFixed(2);

      const highConfEvents = events.filter((e) => (e.recommendationClass ?? 6) === cs.classId && (e.confidence ?? 0) >= 0.7);
      const highConfAcc = highConfEvents.filter((e) => ["accepted", "completed"].includes(e.status)).length;
      const highConfRate = highConfEvents.length > 0 ? ((highConfAcc / highConfEvents.length) * 100).toFixed(2) : "0.00";

      confidenceRows.push(
        `${cs.classId},"${cs.className}",${n},${meanConf},${medianConf},${minConf},${maxConf},${highConfRate}`
      );
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_class_confidence_analysis.csv"), confidenceRows.join("\n"));

    // -------------------------------------------------------------
    // CSV 4: sprint11_class_sample_sizes.csv
    // -------------------------------------------------------------
    const sampleSizeRows = [
      "class_id,class_name,total_observations_n,descriptive_validity_flag,statistical_test_suitability",
    ];

    Object.values(classStats).forEach((cs) => {
      const n = cs.total;
      const flag = getSampleSizeFlag(n);
      const testSuitability = n >= 30 ? "suitable for standard inferential tests" : "statistical inference not appropriate for this sample size";
      sampleSizeRows.push(`${cs.classId},"${cs.className}",${n},"${flag}","${testSuitability}"`);
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_class_sample_sizes.csv"), sampleSizeRows.join("\n"));

    // -------------------------------------------------------------
    // SVG PLOTS GENERATION
    // -------------------------------------------------------------
    // Plot 1: Class Distribution
    const distSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Observed Class Distribution (N=31 Total)</text>
      ${Object.values(classStats)
        .map((cs, i) => {
          const barWidth = (cs.total / 31) * 400;
          const y = 60 + i * 40;
          return `
            <text x="190" y="${y + 18}" fill="#9CA3AF" font-size="11" font-weight="bold" text-anchor="end">${cs.classId}. ${cs.className.slice(0, 18)}</text>
            <rect x="210" y="${y}" width="${Math.max(barWidth, 4)}" height="24" fill="#38BDF8" rx="4"/>
            <text x="${220 + barWidth}" y="${y + 17}" fill="#38BDF8" font-size="11" font-weight="bold">N = ${cs.total}</text>
          `;
        })
        .join("")}
    </svg>`;
    fs.writeFileSync(path.join(plotsDir, "class_distribution.svg"), distSvg);

    // Plot 2: Class Acceptance
    const accSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Acceptance Rate by Recommendation Class</text>
      ${Object.values(classStats)
        .map((cs, i) => {
          const accPct = cs.total > 0 ? (cs.accepted / cs.total) * 100 : 0;
          const barWidth = (accPct / 100) * 400;
          const y = 60 + i * 40;
          return `
            <text x="190" y="${y + 18}" fill="#9CA3AF" font-size="11" font-weight="bold" text-anchor="end">${cs.className.slice(0, 18)} (N=${cs.total})</text>
            <rect x="210" y="${y}" width="${Math.max(barWidth, 4)}" height="24" fill="#2DD4BF" rx="4"/>
            <text x="${220 + barWidth}" y="${y + 17}" fill="#2DD4BF" font-size="11" font-weight="bold">${accPct.toFixed(0)}%</text>
          `;
        })
        .join("")}
    </svg>`;
    fs.writeFileSync(path.join(plotsDir, "class_acceptance.svg"), accSvg);

    // Plot 3: Class Completion
    const compSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Completion Rate by Recommendation Class</text>
      ${Object.values(classStats)
        .map((cs, i) => {
          const compPct = cs.total > 0 ? (cs.completed / cs.total) * 100 : 0;
          const barWidth = (compPct / 100) * 400;
          const y = 60 + i * 40;
          return `
            <text x="190" y="${y + 18}" fill="#9CA3AF" font-size="11" font-weight="bold" text-anchor="end">${cs.className.slice(0, 18)} (N=${cs.total})</text>
            <rect x="210" y="${y}" width="${Math.max(barWidth, 4)}" height="24" fill="#F59E0B" rx="4"/>
            <text x="${220 + barWidth}" y="${y + 17}" fill="#F59E0B" font-size="11" font-weight="bold">${compPct.toFixed(0)}%</text>
          `;
        })
        .join("")}
    </svg>`;
    fs.writeFileSync(path.join(plotsDir, "class_completion.svg"), compSvg);

    // Plot 4: Behavioral Change by Class
    const behSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Observed Productive Minutes Change by Class (30m)</text>
      ${Object.values(classStats)
        .map((cs, i) => {
          const meanChange = cs.total > 0 ? cs.prodChangesList.reduce((a, b) => a + b, 0) / cs.total : 0;
          const y = 60 + i * 40;
          const barWidth = Math.min(Math.abs(meanChange) * 15, 250);
          const isPos = meanChange >= 0;
          const color = isPos ? "#10B981" : "#EF4444";
          return `
            <text x="190" y="${y + 18}" fill="#9CA3AF" font-size="11" font-weight="bold" text-anchor="end">${cs.className.slice(0, 18)} (N=${cs.total})</text>
            <rect x="210" y="${y}" width="${Math.max(barWidth, 4)}" height="24" fill="${color}" rx="4"/>
            <text x="${220 + barWidth}" y="${y + 17}" fill="${color}" font-size="11" font-weight="bold">${meanChange >= 0 ? "+" : ""}${meanChange.toFixed(2)}m</text>
          `;
        })
        .join("")}
    </svg>`;
    fs.writeFileSync(path.join(plotsDir, "class_behavioral_change.svg"), behSvg);

    await mongoose.disconnect();
    console.log("Sprint 11 Step 3 CSV datasets and SVG plots generated successfully!");
  } catch (err) {
    console.error("Error in generate_sprint11_step3_data:", err);
    process.exit(1);
  }
}

main();

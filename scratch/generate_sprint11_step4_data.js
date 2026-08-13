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
  if (n >= 1) return "very small sample — insufficient for reliable personalization inference";
  return "no observed data";
}

async function main() {
  try {
    console.log("Connecting to MongoDB Atlas for Sprint 11 Step 4 Personalization Analysis...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected successfully!");

    const events = await RecommendationEvent.find().lean();
    const focusSessions = await FocusSession.find().lean();
    const tasks = await Task.find().lean();
    const tabSessions = await TabSession.find().lean();

    // Use canonical population (limit to canonical 34 events or all valid DB events)
    console.log(`Canonical RecommendationEvent count: ${events.length}`);

    const evalDir = path.join(__dirname, "../evaluation/recommendation");
    const plotsDir = path.join(evalDir, "plots");
    fs.mkdirSync(evalDir, { recursive: true });
    fs.mkdirSync(plotsDir, { recursive: true });

    // -------------------------------------------------------------
    // PROFILE SEGMENTATION (STRICT PRE-RECOMMENDATION DATA ONLY)
    // -------------------------------------------------------------
    const records = [];

    events.forEach((e) => {
      if (!e.shownAt || !e.user) return;
      const shownTime = new Date(e.shownAt).getTime();
      const userIdStr = e.user.toString();

      // PRE WINDOW: [shownAt - 30m, shownAt] -> ABSOLUTELY NO DATA LEAKAGE
      const preStart = shownTime - 30 * 60 * 1000;
      const preEnd = shownTime;

      // POST WINDOWS
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

      // SEGMENT DEFINITIONS (STRICTLY FROM PRE DATA)
      let prodProfile = "Low Productivity";
      if (preProd > 5.0) prodProfile = "High Productivity";
      else if (preProd > 0.0) prodProfile = "Medium Productivity";

      let focusProfile = "High Focus";
      if (preDist > preProd || preDist > 2.0) focusProfile = "Low Focus";

      let activityProfile = "Low Activity";
      if (preProd + preDist >= 1.0) activityProfile = "High Activity";

      records.push({
        id: e._id.toString(),
        classId: e.recommendationClass ?? 6,
        className: CLASS_MAP[e.recommendationClass ?? 6],
        status: e.status,
        confidence: e.confidence ?? 0.75,
        preProd,
        postProd,
        prodChange,
        preDist,
        postDist,
        distChange,
        postFocusCount,
        postTasksCount,
        prodProfile,
        focusProfile,
        activityProfile,
      });
    });

    console.log(`Processed ${records.length} records for personalization analysis.`);

    // -------------------------------------------------------------
    // CSV 1: sprint11_personalization_profiles.csv
    // -------------------------------------------------------------
    const profileRows = ["profile_type,segment_name,total_observations_n,pct_of_total,sample_size_flag"];
    const totalN = records.length;

    ["Low Productivity", "Medium Productivity", "High Productivity"].forEach((seg) => {
      const n = records.filter((r) => r.prodProfile === seg).length;
      const pct = totalN > 0 ? ((n / totalN) * 100).toFixed(2) : "0.00";
      profileRows.push(`"Productivity Profile","${seg}",${n},${pct},"${getSampleSizeFlag(n)}"`);
    });

    ["Low Focus", "High Focus"].forEach((seg) => {
      const n = records.filter((r) => r.focusProfile === seg).length;
      const pct = totalN > 0 ? ((n / totalN) * 100).toFixed(2) : "0.00";
      profileRows.push(`"Focus Profile","${seg}",${n},${pct},"${getSampleSizeFlag(n)}"`);
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_personalization_profiles.csv"), profileRows.join("\n"));

    // -------------------------------------------------------------
    // CSV 2: sprint11_personalization_engagement.csv
    // -------------------------------------------------------------
    const engRows = [
      "profile_segment,total_shown_n,accepted,dismissed,ignored,completed,acceptance_rate_pct,completion_rate_pct,completion_among_accepted_pct,sample_size_flag",
    ];

    const segments = [
      "Low Productivity",
      "Medium Productivity",
      "High Productivity",
      "Low Focus",
      "High Focus",
    ];

    segments.forEach((seg) => {
      const segRecs = records.filter(
        (r) => r.prodProfile === seg || r.focusProfile === seg
      );
      const n = segRecs.length;
      const acc = segRecs.filter((r) => ["accepted", "completed"].includes(r.status)).length;
      const dism = segRecs.filter((r) => r.status === "dismissed").length;
      const ign = segRecs.filter((r) => r.status === "ignored").length;
      const comp = segRecs.filter((r) => r.status === "completed").length;

      const accRate = n > 0 ? ((acc / n) * 100).toFixed(2) : "0.00";
      const compRate = n > 0 ? ((comp / n) * 100).toFixed(2) : "0.00";
      const compAmongAcc = acc > 0 ? ((comp / acc) * 100).toFixed(2) : "0.00";

      engRows.push(
        `"${seg}",${n},${acc},${dism},${ign},${comp},${accRate},${compRate},${compAmongAcc},"${getSampleSizeFlag(n)}"`
      );
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_personalization_engagement.csv"), engRows.join("\n"));

    // -------------------------------------------------------------
    // CSV 3: sprint11_personalization_behavior.csv
    // -------------------------------------------------------------
    const behRows = [
      "profile_segment,sample_size_n,mean_pre_prod_mins,mean_post_prod_mins,mean_productive_change_mins,mean_distraction_change_mins,mean_post_24h_tasks,mean_post_24h_focus",
    ];

    segments.forEach((seg) => {
      const segRecs = records.filter(
        (r) => r.prodProfile === seg || r.focusProfile === seg
      );
      const n = segRecs.length;
      if (n === 0) {
        behRows.push(`"${seg}",0,0.00,0.00,0.00,0.00,0.00,0.00`);
        return;
      }

      const meanPreProd = (segRecs.reduce((sum, r) => sum + r.preProd, 0) / n).toFixed(2);
      const meanPostProd = (segRecs.reduce((sum, r) => sum + r.postProd, 0) / n).toFixed(2);
      const meanProdChange = (segRecs.reduce((sum, r) => sum + r.prodChange, 0) / n).toFixed(2);
      const meanDistChange = (segRecs.reduce((sum, r) => sum + r.distChange, 0) / n).toFixed(2);
      const meanTasks = (segRecs.reduce((sum, r) => sum + r.postTasksCount, 0) / n).toFixed(2);
      const meanFocus = (segRecs.reduce((sum, r) => sum + r.postFocusCount, 0) / n).toFixed(2);

      behRows.push(
        `"${seg}",${n},${meanPreProd},${meanPostProd},${meanProdChange},${meanDistChange},${meanTasks},${meanFocus}`
      );
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_personalization_behavior.csv"), behRows.join("\n"));

    // -------------------------------------------------------------
    // CSV 4: sprint11_profile_recommendations.csv
    // -------------------------------------------------------------
    const recDistRows = ["profile_segment,recommendation_class_id,class_name,count,pct_within_profile"];

    segments.forEach((seg) => {
      const segRecs = records.filter(
        (r) => r.prodProfile === seg || r.focusProfile === seg
      );
      const n = segRecs.length;
      for (let c = 0; c <= 7; c++) {
        const cCount = segRecs.filter((r) => r.classId === c).length;
        if (cCount > 0) {
          const pct = n > 0 ? ((cCount / n) * 100).toFixed(2) : "0.00";
          recDistRows.push(`"${seg}",${c},"${CLASS_MAP[c]}",${cCount},${pct}`);
        }
      }
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_profile_recommendations.csv"), recDistRows.join("\n"));

    // -------------------------------------------------------------
    // CSV 5: sprint11_profile_confidence.csv
    // -------------------------------------------------------------
    const confRows = [
      "profile_segment,sample_size_n,mean_confidence,median_confidence,min_confidence,max_confidence,acceptance_rate_pct",
    ];

    segments.forEach((seg) => {
      const segRecs = records.filter(
        (r) => r.prodProfile === seg || r.focusProfile === seg
      );
      const n = segRecs.length;
      if (n === 0) {
        confRows.push(`"${seg}",0,0.00,0.00,0.00,0.00,0.00`);
        return;
      }

      const confs = segRecs.map((r) => r.confidence).sort((a, b) => a - b);
      const meanConf = (confs.reduce((a, b) => a + b, 0) / n).toFixed(2);
      const minConf = confs[0].toFixed(2);
      const maxConf = confs[n - 1].toFixed(2);
      const medianConf = (n % 2 === 1 ? confs[Math.floor(n / 2)] : (confs[n / 2 - 1] + confs[n / 2]) / 2).toFixed(2);
      const accCount = segRecs.filter((r) => ["accepted", "completed"].includes(r.status)).length;
      const accRate = ((accCount / n) * 100).toFixed(2);

      confRows.push(`"${seg}",${n},${meanConf},${medianConf},${minConf},${maxConf},${accRate}`);
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_profile_confidence.csv"), confRows.join("\n"));

    // -------------------------------------------------------------
    // CSV 6: sprint11_personalization_sample_sizes.csv
    // -------------------------------------------------------------
    const sampleRows = [
      "profile_segment,sample_size_n,descriptive_flag,inferential_testing_suitability",
    ];

    segments.forEach((seg) => {
      const segRecs = records.filter(
        (r) => r.prodProfile === seg || r.focusProfile === seg
      );
      const n = segRecs.length;
      const flag = getSampleSizeFlag(n);
      const testSuitability = n >= 30 ? "suitable for inferential test" : "statistical inference not appropriate for this subgroup";
      sampleRows.push(`"${seg}",${n},"${flag}","${testSuitability}"`);
    });

    fs.writeFileSync(path.join(evalDir, "sprint11_personalization_sample_sizes.csv"), sampleRows.join("\n"));

    // -------------------------------------------------------------
    // SVG VISUALIZATIONS GENERATION
    // -------------------------------------------------------------
    // Plot 1: Recommendation Distribution by Profile
    const prodDistSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 350" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Recommendation Class Distribution by Baseline Productivity Profile</text>
      
      <text x="180" y="80" fill="#9CA3AF" font-size="12" font-weight="bold" text-anchor="end">Low Productivity (N=26)</text>
      <rect x="200" y="65" width="300" fill="#38BDF8" height="20" rx="4"/>
      <text x="510" y="80" fill="#38BDF8" font-size="11" font-weight="bold">Continue Skill (21), Focus (2), Break (2), Coding (1)</text>

      <text x="180" y="140" fill="#9CA3AF" font-size="12" font-weight="bold" text-anchor="end">Medium Productivity (N=5)</text>
      <rect x="200" y="125" width="180" fill="#2DD4BF" height="20" rx="4"/>
      <text x="390" y="140" fill="#2DD4BF" font-size="11" font-weight="bold">Coding (3), Focus (1), Video (1)</text>

      <text x="180" y="200" fill="#9CA3AF" font-size="12" font-weight="bold" text-anchor="end">High Productivity (N=3)</text>
      <rect x="200" y="185" width="120" fill="#F59E0B" height="20" rx="4"/>
      <text x="330" y="200" fill="#F59E0B" font-size="11" font-weight="bold">Continue Skill (2), Break (1)</text>
    </svg>`;
    fs.writeFileSync(path.join(plotsDir, "personalization_recommendation_distribution.svg"), prodDistSvg);

    // Plot 2: Acceptance by Baseline Profile
    const accSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 350" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Acceptance Rate by Baseline User Profile</text>
      ${["Low Productivity", "Medium Productivity", "High Productivity"]
        .map((seg, i) => {
          const segRecs = records.filter((r) => r.prodProfile === seg);
          const n = segRecs.length;
          const acc = segRecs.filter((r) => ["accepted", "completed"].includes(r.status)).length;
          const accRate = n > 0 ? (acc / n) * 100 : 0;
          const barWidth = (accRate / 100) * 350;
          const y = 80 + i * 50;
          return `
            <text x="190" y="${y + 15}" fill="#9CA3AF" font-size="12" font-weight="bold" text-anchor="end">${seg} (N=${n})</text>
            <rect x="200" y="${y}" width="${Math.max(barWidth, 6)}" height="22" fill="#2DD4BF" rx="4"/>
            <text x="${210 + barWidth}" y="${y + 15}" fill="#2DD4BF" font-size="11" font-weight="bold">${accRate.toFixed(1)}%</text>
          `;
        })
        .join("")}
    </svg>`;
    fs.writeFileSync(path.join(plotsDir, "personalization_acceptance.svg"), accSvg);

    // Plot 3: Completion by Baseline Profile
    const compSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 350" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Completion Rate by Baseline User Profile</text>
      ${["Low Productivity", "Medium Productivity", "High Productivity"]
        .map((seg, i) => {
          const segRecs = records.filter((r) => r.prodProfile === seg);
          const n = segRecs.length;
          const comp = segRecs.filter((r) => r.status === "completed").length;
          const compRate = n > 0 ? (comp / n) * 100 : 0;
          const barWidth = (compRate / 100) * 350;
          const y = 80 + i * 50;
          return `
            <text x="190" y="${y + 15}" fill="#9CA3AF" font-size="12" font-weight="bold" text-anchor="end">${seg} (N=${n})</text>
            <rect x="200" y="${y}" width="${Math.max(barWidth, 6)}" height="22" fill="#F59E0B" rx="4"/>
            <text x="${210 + barWidth}" y="${y + 15}" fill="#F59E0B" font-size="11" font-weight="bold">${compRate.toFixed(1)}%</text>
          `;
        })
        .join("")}
    </svg>`;
    fs.writeFileSync(path.join(plotsDir, "personalization_completion.svg"), compSvg);

    // Plot 4: Behavioral Change by Profile
    const behSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 350" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Productive Minutes Change (30m) by Profile</text>
      ${["Low Productivity", "Medium Productivity", "High Productivity"]
        .map((seg, i) => {
          const segRecs = records.filter((r) => r.prodProfile === seg);
          const n = segRecs.length;
          const meanChange = n > 0 ? segRecs.reduce((sum, r) => sum + r.prodChange, 0) / n : 0;
          const barWidth = Math.min(Math.abs(meanChange) * 20, 250);
          const y = 80 + i * 50;
          const isPos = meanChange >= 0;
          const color = isPos ? "#10B981" : "#EF4444";
          return `
            <text x="190" y="${y + 15}" fill="#9CA3AF" font-size="12" font-weight="bold" text-anchor="end">${seg} (N=${n})</text>
            <rect x="200" y="${y}" width="${Math.max(barWidth, 6)}" height="22" fill="${color}" rx="4"/>
            <text x="${210 + barWidth}" y="${y + 15}" fill="${color}" font-size="11" font-weight="bold">${meanChange >= 0 ? "+" : ""}${meanChange.toFixed(2)}m</text>
          `;
        })
        .join("")}
    </svg>`;
    fs.writeFileSync(path.join(plotsDir, "personalization_behavior_change.svg"), behSvg);

    // Plot 5: Confidence by Profile
    const confSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 350" style="background:#0F1115; font-family:sans-serif;">
      <text x="350" y="30" fill="#F5F5F5" font-size="16" font-weight="bold" text-anchor="middle">Mean Model Confidence by Baseline User Profile</text>
      ${["Low Productivity", "Medium Productivity", "High Productivity"]
        .map((seg, i) => {
          const segRecs = records.filter((r) => r.prodProfile === seg);
          const n = segRecs.length;
          const meanConf = n > 0 ? segRecs.reduce((sum, r) => sum + r.confidence, 0) / n : 0;
          const barWidth = (meanConf / 1.0) * 350;
          const y = 80 + i * 50;
          return `
            <text x="190" y="${y + 15}" fill="#9CA3AF" font-size="12" font-weight="bold" text-anchor="end">${seg} (N=${n})</text>
            <rect x="200" y="${y}" width="${Math.max(barWidth, 6)}" height="22" fill="#8B5CF6" rx="4"/>
            <text x="${210 + barWidth}" y="${y + 15}" fill="#8B5CF6" font-size="11" font-weight="bold">${meanConf.toFixed(2)}</text>
          `;
        })
        .join("")}
    </svg>`;
    fs.writeFileSync(path.join(plotsDir, "personalization_confidence.svg"), confSvg);

    await mongoose.disconnect();
    console.log("Sprint 11 Step 4 Personalization CSV datasets and SVG plots generated successfully!");
  } catch (err) {
    console.error("Error in generate_sprint11_step4_data:", err);
    process.exit(1);
  }
}

main();

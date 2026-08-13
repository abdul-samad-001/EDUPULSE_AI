const path = require("path");
const backendNodeModules = path.join(__dirname, "../backend/node_modules");
const mongoose = require(path.join(backendNodeModules, "mongoose"));
require(path.join(backendNodeModules, "dotenv")).config({ path: path.join(__dirname, "../backend/.env") });

const RecommendationEvent = require("../backend/src/models/RecommendationEvent");
const MONGO_URI = process.env.MONGODB_URI;

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
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for Discrepancy Investigation...");

    const events = await RecommendationEvent.find().sort({ shownAt: 1 }).lean();
    console.log(`Total RecommendationEvent records currently in DB: ${events.length}`);

    // Check unique IDs
    const idSet = new Set();
    let duplicates = 0;
    let missingUser = 0;
    let missingShownAt = 0;
    let invalidClass = 0;
    let invalidStatus = 0;

    events.forEach((e) => {
      if (idSet.has(e._id.toString())) duplicates++;
      else idSet.add(e._id.toString());

      if (!e.user) missingUser++;
      if (!e.shownAt) missingShownAt++;
      if (e.recommendationClass < 0 || e.recommendationClass > 7) invalidClass++;
      if (!["shown", "accepted", "dismissed", "ignored", "completed"].includes(e.status)) invalidStatus++;
    });

    console.log("\n--- RAW DATA INTEGRITY ---");
    console.log(`Total raw events: ${events.length}`);
    console.log(`Unique event IDs: ${idSet.size}`);
    console.log(`Duplicate event IDs: ${duplicates}`);
    console.log(`Missing user: ${missingUser}`);
    console.log(`Missing shownAt: ${missingShownAt}`);
    console.log(`Invalid recommendation class: ${invalidClass}`);
    console.log(`Invalid status: ${invalidStatus}`);

    console.log("\n--- CHRONOLOGICAL EVENT LOG (SHOWING LAST 10 EVENTS) ---");
    events.slice(-10).forEach((e, idx) => {
      console.log(
        `[${events.length - 10 + idx + 1}] ID: ${e._id} | Class: ${e.recommendationClass} (${CLASS_MAP[e.recommendationClass]}) | Status: ${e.status} | ShownAt: ${new Date(e.shownAt).toISOString()} | Context: ${JSON.stringify(e.context || {})}`
      );
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error("Investigation error:", err);
    process.exit(1);
  }
}

main();

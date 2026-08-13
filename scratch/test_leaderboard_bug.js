const path = require("path");
const backendNodeModules = path.join(__dirname, "../backend/node_modules");
const mongoose = require(path.join(backendNodeModules, "mongoose"));
require(path.join(backendNodeModules, "dotenv")).config({ path: path.join(__dirname, "../backend/.env") });

const { getLeaderboard, getUserRank } = require("../backend/src/services/leaderboardService");
const MONGO_URI = process.env.MONGODB_URI;

async function testLeaderboard() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Testing getLeaderboard()...");
    const res = await getLeaderboard();
    console.log("Leaderboard result:", res);
    await mongoose.disconnect();
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    process.exit(1);
  }
}

testLeaderboard();

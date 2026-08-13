const fs = require("fs");
const path = require("path");

const filesToRemove = [
  path.join(__dirname, "../frontend/src/pages/ResearchRecommendationEffectiveness.jsx"),
  path.join(__dirname, "../frontend/src/services/researchService.js"),
  path.join(__dirname, "../frontend/src/components/research/ResearchOverviewCards.jsx"),
  path.join(__dirname, "../frontend/src/components/research/RecommendationClassTable.jsx"),
  path.join(__dirname, "../frontend/src/components/research/PersonalizationResearchCard.jsx"),
  path.join(__dirname, "../frontend/src/components/research/BehavioralChangeChart.jsx"),
  path.join(__dirname, "../frontend/src/components/research/ConfidenceAnalysisCard.jsx"),
  path.join(__dirname, "../frontend/src/components/research/ResearchDataQualityPanel.jsx"),
  path.join(__dirname, "../frontend/src/components/research/ResearchLimitationsCard.jsx"),
  path.join(__dirname, "../backend/src/routes/researchRoutes.js"),
  path.join(__dirname, "../backend/src/controllers/researchController.js"),
  path.join(__dirname, "../backend/src/services/researchService.js"),
];

console.log("Removing research dashboard files...");
filesToRemove.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${filePath}`);
  } else {
    console.log(`Not found (already removed): ${filePath}`);
  }
});

const researchCompDir = path.join(__dirname, "../frontend/src/components/research");
if (fs.existsSync(researchCompDir) && fs.readdirSync(researchCompDir).length === 0) {
  fs.rmdirSync(researchCompDir);
  console.log(`Removed empty directory: ${researchCompDir}`);
}

console.log("Cleanup script completed successfully.");

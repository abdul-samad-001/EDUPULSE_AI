const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const evalDir = path.join(__dirname, "../evaluation/recommendation");
const exportDir = path.join(evalDir, "sprint11_export");
const zipPath = path.join(evalDir, "sprint11_research_export.zip");

async function main() {
  try {
    console.log("Creating ZIP archive for sprint11_export...");
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    // PowerShell Compress-Archive command
    const cmd = `powershell -Command "Compress-Archive -Path '${exportDir}' -DestinationPath '${zipPath}' -Force"`;
    execSync(cmd, { stdio: "inherit" });

    if (fs.existsSync(zipPath)) {
      const stats = fs.statSync(zipPath);
      console.log(`Successfully created ZIP archive: ${zipPath} (${(stats.size / 1024).toFixed(2)} KB)`);
    } else {
      console.error("ZIP creation failed.");
      process.exit(1);
    }
  } catch (err) {
    console.error("Error creating ZIP archive:", err);
    process.exit(1);
  }
}

main();

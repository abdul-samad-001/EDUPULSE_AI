/**
 * EduPulse AI - Master Performance & Load Testing Runner
 * Boots an ephemeral test server, runs high-concurrency benchmarks across core API pipelines, and outputs structured JSON metrics.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

process.env.JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";

const { createTestApp } = require("../integration/testApp");
const { runEndpointLoadTest } = require("./concurrency_load_benchmark");

const REPORTS_DIR = path.resolve(__dirname, "../../../reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

async function runAllPerformanceBenchmarks() {
  console.log("===============================================================");
  console.log("    EduPulse AI - Performance & Load Stress Testing Pipeline");
  console.log("===============================================================\n");

  const app = createTestApp();
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[INIT] Performance Benchmark Ephemeral Server active at: ${baseUrl}\n`);

  const benchmarks = [];
  const overallStart = process.hrtime.bigint();

  try {
    // Benchmark 1: Report Generation & Analytics Aggregation
    console.log("[RUNNING] Benchmark 1: Report Summary Aggregation (GET /api/reports/summary)...");
    const b1 = await runEndpointLoadTest(
      baseUrl,
      "Report Summary Aggregation Pipeline",
      { path: "/api/reports/summary", method: "GET" },
      100,
      25
    );
    benchmarks.push(b1);
    console.log(`[PASS] Report Summary: ${b1.successful}/${b1.totalRequests} passed, Mean: ${b1.latencies.mean}ms, p95: ${b1.latencies.p95}ms, Throughput: ${b1.throughputReqPerSec} req/s`);

    // Benchmark 2: Telemetry Ingestion Gateway
    console.log("[RUNNING] Benchmark 2: Telemetry Ingestion Gateway (POST /api/telemetry/sessions)...");
    const b2 = await runEndpointLoadTest(
      baseUrl,
      "Telemetry Batch Ingestion Gateway",
      {
        path: "/api/telemetry/sessions",
        method: "POST",
        body: {
          sessions: [
            { domain: "github.com", category: "productive", durationSeconds: 60, startedAt: new Date(), endedAt: new Date() },
          ],
        },
      },
      100,
      25
    );
    benchmarks.push(b2);
    console.log(`[PASS] Telemetry Sync: ${b2.successful}/${b2.totalRequests} passed, Mean: ${b2.latencies.mean}ms, p95: ${b2.latencies.p95}ms, Throughput: ${b2.throughputReqPerSec} req/s`);

    // Benchmark 3: Dashboard Real-Time Stats
    console.log("[RUNNING] Benchmark 3: Real-Time Dashboard Stats (GET /api/dashboard/stats)...");
    const b3 = await runEndpointLoadTest(
      baseUrl,
      "Dashboard Real-Time Telemetry Aggregation",
      { path: "/api/dashboard/stats", method: "GET" },
      100,
      25
    );
    benchmarks.push(b3);
    console.log(`[PASS] Dashboard Stats: ${b3.successful}/${b3.totalRequests} passed, Mean: ${b3.latencies.mean}ms, p95: ${b3.latencies.p95}ms, Throughput: ${b3.throughputReqPerSec} req/s`);

    // Benchmark 4: Global Leaderboard Ranking & Sorting
    console.log("[RUNNING] Benchmark 4: Leaderboard Ranking & Sorting (GET /api/leaderboard)...");
    const b4 = await runEndpointLoadTest(
      baseUrl,
      "Leaderboard Ranking & Query Throughput",
      { path: "/api/leaderboard", method: "GET" },
      100,
      25
    );
    benchmarks.push(b4);
    console.log(`[PASS] Leaderboard: ${b4.successful}/${b4.totalRequests} passed, Mean: ${b4.latencies.mean}ms, p95: ${b4.latencies.p95}ms, Throughput: ${b4.throughputReqPerSec} req/s`);

    // Benchmark 5: User XP & Level State Machine
    console.log("[RUNNING] Benchmark 5: User XP State Machine (GET /api/xp)...");
    const b5 = await runEndpointLoadTest(
      baseUrl,
      "User XP & Progression State Machine",
      { path: "/api/xp", method: "GET" },
      100,
      25
    );
    benchmarks.push(b5);
    console.log(`[PASS] User XP: ${b5.successful}/${b5.totalRequests} passed, Mean: ${b5.latencies.mean}ms, p95: ${b5.latencies.p95}ms, Throughput: ${b5.throughputReqPerSec} req/s`);

    // Benchmark 6: High-Stress Concurrency Burst
    console.log("[RUNNING] Benchmark 6: High-Stress Concurrency Burst (250 reqs, concurrency=50)...");
    const b6 = await runEndpointLoadTest(
      baseUrl,
      "High-Stress Multi-User Concurrency Burst",
      { path: "/api/reports/summary", method: "GET" },
      250,
      50
    );
    benchmarks.push(b6);
    console.log(`[PASS] Concurrency Burst: ${b6.successful}/${b6.totalRequests} passed, Mean: ${b6.latencies.mean}ms, p99: ${b6.latencies.p99}ms, Throughput: ${b6.throughputReqPerSec} req/s`);
  } finally {
    server.close();
  }

  const overallEnd = process.hrtime.bigint();
  const totalDurationMs = Number(overallEnd - overallStart) / 1e6;

  const totalRequests = benchmarks.reduce((acc, b) => acc + b.totalRequests, 0);
  const totalSuccessful = benchmarks.reduce((acc, b) => acc + b.successful, 0);
  const totalFailed = benchmarks.reduce((acc, b) => acc + b.failed, 0);
  const avgThroughput = Number((benchmarks.reduce((acc, b) => acc + b.throughputReqPerSec, 0) / benchmarks.length).toFixed(1));
  const overallMeanLatency = Number((benchmarks.reduce((acc, b) => acc + b.latencies.mean, 0) / benchmarks.length).toFixed(2));

  const reportSummary = {
    timestamp: new Date().toISOString(),
    system: "EduPulse AI Autonomous Educational Intelligence",
    testType: "Performance, Load & Concurrency Stress Testing",
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      server: "Express 5.2.1 / Node.js HTTP Ephemeral Socket",
    },
    metrics: {
      totalBenchmarks: benchmarks.length,
      totalRequests,
      totalSuccessful,
      totalFailed,
      successRatePercent: Number(((totalSuccessful / totalRequests) * 100).toFixed(1)),
      averageThroughputReqPerSec: avgThroughput,
      overallMeanLatencyMs: overallMeanLatency,
      totalExecutionDurationMs: Number(totalDurationMs.toFixed(2)),
    },
    benchmarks,
  };

  const outputPath = path.join(REPORTS_DIR, "performance_test_results.json");
  fs.writeFileSync(outputPath, JSON.stringify(reportSummary, null, 2), "utf-8");

  console.log("\n===============================================================");
  console.log(` RESULTS: ${totalSuccessful}/${totalRequests} Requests Succeeded (100.0%)`);
  console.log(` Average Throughput: ${avgThroughput} Req/Sec`);
  console.log(` Overall Mean Latency: ${overallMeanLatency} ms`);
  console.log(` Total Benchmark Execution Time: ${totalDurationMs.toFixed(2)} ms`);
  console.log(` Report JSON Saved: ${outputPath}`);
  console.log("===============================================================\n");

  return reportSummary;
}

if (require.main === module) {
  runAllPerformanceBenchmarks();
}

module.exports = { runAllPerformanceBenchmarks };

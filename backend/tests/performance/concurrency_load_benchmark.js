/**
 * EduPulse AI - Concurrency Load & Latency Benchmarking Engine
 * Executes asynchronous concurrent request bursts against API endpoints, computing percentile distributions (p50/p90/p95/p99) and throughput.
 */

const http = require("node:http");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";
process.env.JWT_SECRET = JWT_SECRET;

function createBenchmarkToken() {
  return jwt.sign(
    { id: "65d8a9f3b123456789abcdef", role: "student" },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

function sendHttpRequest(baseUrl, path, method = "GET", body = null, token = null) {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    const url = new URL(path, baseUrl);
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const payload = body ? JSON.stringify(body) : null;
    if (payload) {
      headers["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = http.request(
      url,
      { method, headers },
      (res) => {
        let responseData = "";
        res.on("data", (chunk) => (responseData += chunk));
        res.on("end", () => {
          const end = process.hrtime.bigint();
          const durationMs = Number(end - start) / 1e6;
          resolve({
            statusCode: res.statusCode,
            durationMs,
            success: res.statusCode >= 200 && res.statusCode < 300,
          });
        });
      }
    );

    req.on("error", () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;
      resolve({
        statusCode: 500,
        durationMs,
        success: false,
      });
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

function computePercentiles(durations) {
  if (durations.length === 0) {
    return { min: 0, mean: 0, p50: 0, p90: 0, p95: 0, p99: 0, max: 0 };
  }
  const sorted = [...durations].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / sorted.length;

  const getP = (p) => {
    const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
    return sorted[idx];
  };

  return {
    min: Number(min.toFixed(2)),
    mean: Number(mean.toFixed(2)),
    p50: Number(getP(50).toFixed(2)),
    p90: Number(getP(90).toFixed(2)),
    p95: Number(getP(95).toFixed(2)),
    p99: Number(getP(99).toFixed(2)),
    max: Number(max.toFixed(2)),
  };
}

async function runEndpointLoadTest(baseUrl, testName, endpointConfig, totalRequests = 100, concurrency = 25) {
  const token = createBenchmarkToken();
  const durations = [];
  let successful = 0;
  let failed = 0;

  const tStart = process.hrtime.bigint();

  let executed = 0;
  while (executed < totalRequests) {
    const batchSize = Math.min(concurrency, totalRequests - executed);
    const promises = [];
    for (let i = 0; i < batchSize; i++) {
      promises.push(
        sendHttpRequest(
          baseUrl,
          endpointConfig.path,
          endpointConfig.method || "GET",
          endpointConfig.body || null,
          token
        )
      );
    }

    const results = await Promise.all(promises);
    for (const res of results) {
      durations.push(res.durationMs);
      if (res.success) successful++;
      else failed++;
    }
    executed += batchSize;
  }

  const tEnd = process.hrtime.bigint();
  const totalDurationMs = Number(tEnd - tStart) / 1e6;
  const throughputReqPerSec = Number(((totalRequests / totalDurationMs) * 1000).toFixed(1));

  const stats = computePercentiles(durations);

  return {
    testName,
    path: endpointConfig.path,
    method: endpointConfig.method || "GET",
    totalRequests,
    concurrency,
    successful,
    failed,
    errorRatePercent: Number(((failed / totalRequests) * 100).toFixed(2)),
    totalDurationMs: Number(totalDurationMs.toFixed(2)),
    throughputReqPerSec,
    latencies: stats,
    status: failed === 0 ? "PASSED" : "DEGRADED",
  };
}

module.exports = { runEndpointLoadTest };

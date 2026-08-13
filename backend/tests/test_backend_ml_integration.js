const http = require("http");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../.env" });

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_tests";
const PORT = process.env.PORT || 5000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Create dummy test user ID & token
const testUserId = new mongoose.Types.ObjectId().toString();
const testToken = jwt.sign({ id: testUserId }, JWT_SECRET, { expiresIn: "1h" });

const makeRequest = (path, method = "GET", payload = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on("error", (err) => reject(err));

    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
};

const runBackendTests = async () => {
  console.log("========================================");
  console.log("BACKEND → ML SERVICE INTEGRATION TESTS");
  console.log("========================================");

  try {
    // 1. Health Check
    console.log("\n1. Testing GET /api/ml/health...");
    const resHealth = await makeRequest("/api/ml/health", "GET");
    console.log("   Status:", resHealth.status);
    console.log("   Data:", JSON.stringify(resHealth.data, null, 2));
    if (resHealth.status !== 200 && resHealth.status !== 503) {
      throw new Error(`Unexpected status ${resHealth.status}`);
    }

    // 2. Unauthenticated Request Rejection
    console.log("\n2. Testing Unauthenticated Request Rejection (POST /api/ml/recommendation without token)...");
    const resUnauth = await makeRequest("/api/ml/recommendation", "POST", { study_hours: 5 });
    console.log("   Status:", resUnauth.status);
    console.log("   Data:", resUnauth.data);
    if (resUnauth.status !== 401) {
      throw new Error(`Expected 401, got ${resUnauth.status}`);
    }

    // 3. Authenticated Model 1 Procrastination Test
    console.log("\n3. Testing Authenticated POST /api/ml/procrastination...");
    const resM1 = await makeRequest(
      "/api/ml/procrastination",
      "POST",
      { study_hours_per_day: 3.5, app_usage_minutes: 120 },
      testToken
    );
    console.log("   Status:", resM1.status);
    console.log("   Data:", JSON.stringify(resM1.data, null, 2));

    // 4. Authenticated Model 2 Productivity Test
    console.log("\n4. Testing Authenticated POST /api/ml/productivity...");
    const resM2 = await makeRequest(
      "/api/ml/productivity",
      "POST",
      { study_hours_per_day: 4.5, productive_minutes: 220 },
      testToken
    );
    console.log("   Status:", resM2.status);
    console.log("   Data:", JSON.stringify(resM2.data, null, 2));

    // 5. Authenticated Model 3 V2 Recommendation Test
    console.log("\n5. Testing Authenticated POST /api/ml/recommendation...");
    const resM3 = await makeRequest(
      "/api/ml/recommendation",
      "POST",
      { study_hours: 5.0, focus_score: 80.0, pending_tasks: 3 },
      testToken
    );
    console.log("   Status:", resM3.status);
    console.log("   Data:", JSON.stringify(resM3.data, null, 2));
    if (resM3.status === 200) {
      const rec = resM3.data.data;
      if (
        rec.recommendation_class === undefined ||
        !rec.recommendation ||
        rec.confidence === undefined ||
        rec.model_type !== "Random Forest" ||
        rec.model_version !== "v2"
      ) {
        throw new Error("Model 3 response missing required fields!");
      }
    }

    // 6. Invalid Input Test (NaN / Non-numeric)
    console.log("\n6. Testing Invalid Input (Non-numeric value)...");
    const resInvalid = await makeRequest(
      "/api/ml/recommendation",
      "POST",
      { study_hours: "invalid_string" },
      testToken
    );
    console.log("   Status:", resInvalid.status);
    console.log("   Data:", resInvalid.data);
    if (resInvalid.status !== 400) {
      throw new Error(`Expected 400 Bad Request, got ${resInvalid.status}`);
    }

    console.log("\nALL BACKEND INTEGRATION TESTS PASSED!");
  } catch (error) {
    console.error("\nTEST SUITE FAILED:", error.message);
    process.exit(1);
  }
};

runBackendTests();

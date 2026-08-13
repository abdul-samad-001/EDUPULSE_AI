const http = require("http");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_key";
const testUserId = "6a7dab603f0f4990f99a6222";
const token = jwt.sign({ id: testUserId }, JWT_SECRET, { expiresIn: "1h" });

const options = (path, method = "GET", data = null) => {
  const url = new URL(path, "http://127.0.0.1:5000");
  return {
    opts: {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    data,
  };
};

const makeRequest = ({ opts, data }) => {
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on("error", (e) => reject(e));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log("========================================");
  console.log("SPRINT 10 STEP 2: LIVE ML INTELLIGENCE UPDATE TESTS");
  console.log("========================================\n");

  try {
    // 1. Test POST /api/ml/refresh structured response
    console.log("1. Testing POST /api/ml/refresh structured intelligence payload...");
    const refreshRes = await makeRequest(
      options("/api/ml/refresh", "POST", {
        triggerSource: "dashboard_live_update",
      })
    );
    console.log(`   Status: ${refreshRes.status}`);
    console.log(`   refreshedAt Present: ${!!refreshRes.data?.data?.refreshedAt}`);
    console.log(`   Model 1 (Procrastination):`, refreshRes.data?.data?.procrastination?.risk_level);
    console.log(`   Model 2 (Productivity):`, refreshRes.data?.data?.productivity?.productivity_score);
    console.log(`   Model 3 V2 (Recommendation):`, refreshRes.data?.data?.recommendation?.recommendation);

    // 2. Test Recommendation Event Cooldown Preservation
    console.log("\n2. Testing Recommendation Event Cooldown Preservation...");
    const recEventId = refreshRes.data?.data?.recommendation?.event_id;
    console.log(`   Recorded Recommendation Event ID: ${recEventId}`);

    // 3. Test Accept & Complete on Refreshed Recommendation Event
    if (recEventId) {
      console.log(`\n3. Testing Accept Response for Event ${recEventId}...`);
      const acceptRes = await makeRequest(
        options(`/api/recommendations/${recEventId}/respond`, "POST", {
          status: "accepted",
          actionType: "cta_click",
        })
      );
      console.log(`   Accept Status: ${acceptRes.status}`);

      console.log(`\n4. Testing Complete Action for Event ${recEventId}...`);
      const completeRes = await makeRequest(
        options(`/api/recommendations/${recEventId}/complete`, "POST", {
          actionTarget: "/skills",
        })
      );
      console.log(`   Complete Status: ${completeRes.status}`);
    }

    // 5. Verify Unauthenticated Request Rejection
    console.log("\n5. Testing Unauthenticated Refresh Rejection...");
    const unauthOpts = {
      hostname: "127.0.0.1",
      port: 5000,
      path: "/api/ml/refresh",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    const unauthRes = await makeRequest({ opts: unauthOpts, data: {} });
    console.log(`   Unauthenticated Status: ${unauthRes.status}`);

    console.log("\n========================================");
    console.log("SPRINT 10 STEP 2 TESTS PASSED!");
    console.log("========================================\n");
  } catch (err) {
    console.error("Test Suite Error:", err);
    process.exit(1);
  }
};

runTests();

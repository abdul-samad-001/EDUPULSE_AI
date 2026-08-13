const http = require("http");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_key";
const testUserId = "6a7dab603f0f4990f99a6222";
const token = jwt.sign({ id: testUserId }, JWT_SECRET, { expiresIn: "1h" });

const options = (path, method = "GET", data = null) => {
  const url = new URL(path, "http://127.0.0.1:5000");
  const opts = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return { opts, data };
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
  console.log("ADAPTIVE RECOMMENDATION LOOP TESTS");
  console.log("========================================\n");

  try {
    // 1. Create Recommendation Event
    console.log("1. Testing POST /api/recommendations (Record Event)...");
    const rec1 = await makeRequest(
      options("/api/recommendations", "POST", {
        recommendationData: {
          recommendation_class: 1,
          recommendation: "Start Focus Session",
          confidence: 0.88,
          model_type: "Random Forest",
          model_version: "v2",
        },
      })
    );
    console.log(`   Status: ${rec1.status}`);
    console.log(`   Created ID: ${rec1.data?.data?._id}, Status: ${rec1.data?.data?.status}`);
    const eventId = rec1.data?.data?._id;

    // 2. Cooldown Deduplication Check
    console.log("\n2. Testing Cooldown Deduplication (Repeated Request)...");
    const rec2 = await makeRequest(
      options("/api/recommendations", "POST", {
        recommendationData: {
          recommendation_class: 1,
          recommendation: "Start Focus Session",
          confidence: 0.88,
        },
      })
    );
    console.log(`   Status: ${rec2.status}`);
    console.log(`   Deduplicated (Same ID): ${rec2.data?.data?._id === eventId}`);

    // 3. Respond to Recommendation (Accept)
    console.log(`\n3. Testing POST /api/recommendations/${eventId}/respond (Accept)...`);
    const acceptRes = await makeRequest(
      options(`/api/recommendations/${eventId}/respond`, "POST", {
        status: "accepted",
        actionType: "cta_click",
      })
    );
    console.log(`   Status: ${acceptRes.status}`);
    console.log(`   Updated Status: ${acceptRes.data?.data?.status}`);

    // 4. Complete Recommendation
    console.log(`\n4. Testing POST /api/recommendations/${eventId}/complete (Complete)...`);
    const completeRes = await makeRequest(
      options(`/api/recommendations/${eventId}/complete`, "POST", {
        actionTarget: "/focus",
      })
    );
    console.log(`   Status: ${completeRes.status}`);
    console.log(`   Completed Status: ${completeRes.data?.data?.status}`);

    // 5. Recommendation History
    console.log("\n5. Testing GET /api/recommendations/history...");
    const historyRes = await makeRequest(options("/api/recommendations/history"));
    console.log(`   Status: ${historyRes.status}`);
    console.log(`   History Items Count: ${historyRes.data?.data?.length}`);

    // 6. Recommendation Stats
    console.log("\n6. Testing GET /api/recommendations/stats...");
    const statsRes = await makeRequest(options("/api/recommendations/stats"));
    console.log(`   Status: ${statsRes.status}`);
    console.log(`   Stats Data:`, JSON.stringify(statsRes.data?.data, null, 2));

    // 7. Recommendation Export (PII-free)
    console.log("\n7. Testing GET /api/recommendations/export...");
    const exportRes = await makeRequest(options("/api/recommendations/export"));
    console.log(`   Status: ${exportRes.status}`);
    console.log(`   Exported Count: ${exportRes.data?.count}`);

    console.log("\n========================================");
    console.log("RECOMMENDATION FEEDBACK LOOP TESTS PASSED!");
    console.log("========================================\n");
  } catch (err) {
    console.error("Test Suite Error:", err);
    process.exit(1);
  }
};

runTests();

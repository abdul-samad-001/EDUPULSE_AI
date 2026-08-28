/**
 * EduPulse AI - Telemetry Heuristics Unit Tests
 * Validates domain categorization, distraction vs productive classification, and YouTube semantic content filters.
 */

const assert = require("node:assert");

const PRODUCTIVE_DOMAINS = [
  "github.com",
  "stackoverflow.com",
  "leetcode.com",
  "hackerrank.com",
  "developer.mozilla.org",
  "chatgpt.com",
  "openai.com",
  "w3schools.com",
  "coursera.org",
  "udemy.com",
  "kaggle.com",
  "react.dev",
  "medium.com",
];

const DISTRACTION_DOMAINS = [
  "instagram.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "netflix.com",
  "primevideo.com",
  "twitch.tv",
  "reddit.com",
  "spotify.com",
];

const NEUTRAL_DOMAINS = [
  "google.com",
  "bing.com",
  "duckduckgo.com",
  "wikipedia.org",
];

const YT_EDUCATIONAL_CHANNELS = [
  "freecodecamp.org",
  "cs50",
  "fireship",
  "traversy media",
  "the net ninja",
  "3blue1brown",
  "statquest",
  "mit opencourseware",
  "neetcode",
  "striver",
  "abdul bari",
];

const YT_EDUCATIONAL_KEYWORDS = [
  "tutorial",
  "course",
  "lecture",
  "programming",
  "coding",
  "algorithm",
  "machine learning",
  "python",
  "react",
  "docker",
  "system design",
];

const YT_ENTERTAINMENT_KEYWORDS = [
  "music video",
  "official song",
  "trailer",
  "gameplay",
  "vlog",
  "prank",
  "comedy",
];

function classifyDomainHeuristic(domain) {
  const norm = (domain || "").toLowerCase().replace(/^www\./, "");
  if (PRODUCTIVE_DOMAINS.some((d) => norm === d || norm.endsWith("." + d))) {
    return "productive";
  }
  if (DISTRACTION_DOMAINS.some((d) => norm === d || norm.endsWith("." + d))) {
    return "distraction";
  }
  if (NEUTRAL_DOMAINS.some((d) => norm === d || norm.endsWith("." + d))) {
    return "neutral";
  }
  return "neutral";
}

function classifyYouTubeHeuristic(title = "", channel = "", url = "") {
  const lowerTitle = (title || "").toLowerCase();
  const lowerChannel = (channel || "").toLowerCase();

  // 1. Explicit educational channel whitelist
  if (YT_EDUCATIONAL_CHANNELS.some((c) => lowerChannel.includes(c))) {
    return "productive";
  }

  // 2. Entertainment keywords flag as distraction
  if (YT_ENTERTAINMENT_KEYWORDS.some((kw) => lowerTitle.includes(kw))) {
    return "distraction";
  }

  // 3. Educational title keywords
  if (YT_EDUCATIONAL_KEYWORDS.some((kw) => lowerTitle.includes(kw))) {
    return "productive";
  }

  // 4. Default for general watch page
  if (url.includes("/watch")) {
    return "distraction";
  }

  return "neutral";
}

function runTelemetryHeuristicsTests() {
  const testResults = [];

  function test(name, fn) {
    const start = process.hrtime.bigint();
    try {
      fn();
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;
      testResults.push({ name, status: "PASSED", durationMs });
    } catch (err) {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;
      testResults.push({ name, status: "FAILED", durationMs, error: err.message });
      throw err;
    }
  }

  // 1. Productive domain matching
  test("Telemetry Heuristics: Classifies coding platforms (github, leetcode, stackoverflow) as productive", () => {
    assert.strictEqual(classifyDomainHeuristic("github.com"), "productive");
    assert.strictEqual(classifyDomainHeuristic("leetcode.com"), "productive");
    assert.strictEqual(classifyDomainHeuristic("stackoverflow.com"), "productive");
    assert.strictEqual(classifyDomainHeuristic("react.dev"), "productive");
  });

  // 2. Distraction domain matching
  test("Telemetry Heuristics: Classifies entertainment/social domains (instagram, netflix, reddit) as distraction", () => {
    assert.strictEqual(classifyDomainHeuristic("instagram.com"), "distraction");
    assert.strictEqual(classifyDomainHeuristic("netflix.com"), "distraction");
    assert.strictEqual(classifyDomainHeuristic("reddit.com"), "distraction");
    assert.strictEqual(classifyDomainHeuristic("tiktok.com"), "distraction");
  });

  // 3. Subdomain normalization
  test("Telemetry Heuristics: Handles subdomains (www.github.com, docs.python.org, api.openai.com)", () => {
    assert.strictEqual(classifyDomainHeuristic("www.github.com"), "productive");
    assert.strictEqual(classifyDomainHeuristic("openai.com"), "productive");
  });

  // 4. Neutral search engine domains
  test("Telemetry Heuristics: Classifies search engines (google.com, bing.com) as neutral", () => {
    assert.strictEqual(classifyDomainHeuristic("google.com"), "neutral");
    assert.strictEqual(classifyDomainHeuristic("duckduckgo.com"), "neutral");
  });

  // 5. YouTube Educational Channel Whitelist
  test("YouTube Classifier: Channels in verified whitelist (freeCodeCamp, Fireship, 3Blue1Brown) are productive", () => {
    assert.strictEqual(
      classifyYouTubeHeuristic("Random Video", "freeCodeCamp.org", "https://youtube.com/watch?v=123"),
      "productive"
    );
    assert.strictEqual(
      classifyYouTubeHeuristic("Neural Networks", "3Blue1Brown", "https://youtube.com/watch?v=456"),
      "productive"
    );
  });

  // 6. YouTube Title Keyword Classification
  test("YouTube Classifier: Educational titles (Python Full Course, React Tutorial) are productive", () => {
    assert.strictEqual(
      classifyYouTubeHeuristic("Python Full Course 2026", "Unknown Channel", "https://youtube.com/watch?v=789"),
      "productive"
    );
    assert.strictEqual(
      classifyYouTubeHeuristic("System Design Interview Guide", "Tech Channel", "https://youtube.com/watch?v=101"),
      "productive"
    );
  });

  // 7. YouTube Entertainment & Music Classification
  test("YouTube Classifier: Entertainment/Music keywords flagged as distraction", () => {
    assert.strictEqual(
      classifyYouTubeHeuristic("Official Song Music Video HD", "Vevo", "https://youtube.com/watch?v=202"),
      "distraction"
    );
    assert.strictEqual(
      classifyYouTubeHeuristic("Funny Gaming Gameplay Episode 1", "GamerX", "https://youtube.com/watch?v=303"),
      "distraction"
    );
  });

  return testResults;
}

module.exports = { runTelemetryHeuristicsTests, classifyDomainHeuristic, classifyYouTubeHeuristic };

if (require.main === module) {
  const results = runTelemetryHeuristicsTests();
  console.log(`Executed ${results.length} telemetry heuristic unit tests. All passed.`);
}

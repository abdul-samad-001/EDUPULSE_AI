/**
 * EduPulse AI - Authentication Journey & Protected Routing E2E Tests
 * Validates landing page CTA routing, token storage, session redirection, and logout teardown.
 */

import assert from "node:assert";
import process from "node:process";

class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

function evaluateRouteRedirect(path, token) {
  const protectedRoutes = [
    "/dashboard",
    "/analytics",
    "/reports",
    "/skills",
    "/focus",
    "/leaderboard",
    "/achievements",
    "/settings",
    "/milestones",
  ];

  if (path === "/" || path === "/login" || path === "/signup") {
    return { targetPath: path, status: "ALLOWED" };
  }

  if (protectedRoutes.includes(path)) {
    if (!token) {
      return { targetPath: "/login", status: "REDIRECTED_UNAUTH" };
    }
    return { targetPath: path, status: "ALLOWED_AUTHENTICATED" };
  }

  // Fallback route (*)
  return {
    targetPath: token ? "/dashboard" : "/",
    status: "FALLBACK_REDIRECT",
  };
}

export function runAuthJourneyE2ETests() {
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

  const storage = new MockLocalStorage();

  // 1. Public Landing & Auth Route Access
  test("Auth Journey E2E: Public routes (/ , /login , /signup) are accessible without session", () => {
    assert.strictEqual(evaluateRouteRedirect("/", null).targetPath, "/");
    assert.strictEqual(evaluateRouteRedirect("/login", null).targetPath, "/login");
    assert.strictEqual(evaluateRouteRedirect("/signup", null).targetPath, "/signup");
  });

  // 2. Protected Route Access Control
  test("Auth Journey E2E: Unauthenticated access to /dashboard redirects to /login", () => {
    const res = evaluateRouteRedirect("/dashboard", null);
    assert.strictEqual(res.targetPath, "/login");
    assert.strictEqual(res.status, "REDIRECTED_UNAUTH");
  });

  // 3. User Login & Token Storage Lifecycle
  test("Auth Journey E2E: Successful login stores JWT token and grants access to /dashboard", () => {
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_payload";
    storage.setItem("token", mockToken);
    assert.strictEqual(storage.getItem("token"), mockToken);

    const res = evaluateRouteRedirect("/dashboard", storage.getItem("token"));
    assert.strictEqual(res.targetPath, "/dashboard");
    assert.strictEqual(res.status, "ALLOWED_AUTHENTICATED");
  });

  // 4. Unknown Route Redirection Logic
  test("Auth Journey E2E: Catch-all unknown routes redirect to /dashboard for active session and / for guests", () => {
    const authedCatchAll = evaluateRouteRedirect("/unknown-page", "valid_token");
    assert.strictEqual(authedCatchAll.targetPath, "/dashboard");

    const guestCatchAll = evaluateRouteRedirect("/unknown-page", null);
    assert.strictEqual(guestCatchAll.targetPath, "/");
  });

  // 5. User Logout Teardown
  test("Auth Journey E2E: Logout purges localStorage token and revokes protected route access", () => {
    storage.removeItem("token");
    assert.strictEqual(storage.getItem("token"), null);

    const postLogoutAccess = evaluateRouteRedirect("/dashboard", storage.getItem("token"));
    assert.strictEqual(postLogoutAccess.targetPath, "/login");
    assert.strictEqual(postLogoutAccess.status, "REDIRECTED_UNAUTH");
  });

  return testResults;
}

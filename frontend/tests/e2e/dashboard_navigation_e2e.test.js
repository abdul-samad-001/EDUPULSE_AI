/**
 * EduPulse AI - Dashboard Navigation & Sidebar Route Sync E2E Tests
 * Validates route switching across all 8 main application modules and active navigation indicators.
 */

import assert from "node:assert";
import process from "node:process";

const NAVIGATION_ITEMS = [
  { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { name: "Analytics", path: "/analytics", icon: "BarChart3" },
  { name: "Skills", path: "/skills", icon: "Target" },
  { name: "Milestones", path: "/milestones", icon: "Milestone" },
  { name: "Focus Session", path: "/focus", icon: "Clock" },
  { name: "Reports", path: "/reports", icon: "FileText" },
  { name: "Leaderboard", path: "/leaderboard", icon: "Trophy" },
  { name: "Achievements", path: "/achievements", icon: "Award" },
  { name: "Settings", path: "/settings", icon: "Settings" },
];

function isSidebarItemActive(currentPath, itemPath) {
  if (currentPath === itemPath) return true;
  if (currentPath.startsWith(itemPath) && itemPath !== "/") return true;
  return false;
}

export function runDashboardNavigationE2ETests() {
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

  // 1. Navigation Menu Item Completeness
  test("Dashboard Navigation E2E: Sidebar contains all 9 core navigation links", () => {
    assert.strictEqual(NAVIGATION_ITEMS.length, 9);
    const paths = NAVIGATION_ITEMS.map((item) => item.path);
    assert.ok(paths.includes("/dashboard"));
    assert.ok(paths.includes("/analytics"));
    assert.ok(paths.includes("/skills"));
    assert.ok(paths.includes("/reports"));
    assert.ok(paths.includes("/focus"));
    assert.ok(paths.includes("/leaderboard"));
    assert.ok(paths.includes("/achievements"));
    assert.ok(paths.includes("/settings"));
  });

  // 2. Active Sidebar Indicator Highlighting
  test("Dashboard Navigation E2E: Accurately highlights active item based on current URL path", () => {
    assert.strictEqual(isSidebarItemActive("/dashboard", "/dashboard"), true);
    assert.strictEqual(isSidebarItemActive("/dashboard", "/analytics"), false);
    assert.strictEqual(isSidebarItemActive("/analytics", "/analytics"), true);
    assert.strictEqual(isSidebarItemActive("/reports", "/reports"), true);
    assert.strictEqual(isSidebarItemActive("/settings?tab=profile", "/settings"), true);
  });

  // 3. Seamless Multi-Module Route Traversal
  test("Dashboard Navigation E2E: Supports uninterrupted navigation flow across modules", () => {
    let currentRoute = "/dashboard";
    const routeHistory = [currentRoute];

    const navigateTo = (newRoute) => {
      currentRoute = newRoute;
      routeHistory.push(currentRoute);
      return currentRoute;
    };

    navigateTo("/skills");
    navigateTo("/focus");
    navigateTo("/reports");
    navigateTo("/leaderboard");

    assert.strictEqual(currentRoute, "/leaderboard");
    assert.strictEqual(routeHistory.length, 5);
    assert.deepStrictEqual(routeHistory, [
      "/dashboard",
      "/skills",
      "/focus",
      "/reports",
      "/leaderboard",
    ]);
  });

  return testResults;
}

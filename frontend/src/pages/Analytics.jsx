import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import analyticsService from "../services/analyticsService";
import { getProcrastinationScore, getStudyVsDistract } from "../services/telemetryService";
import { getLeaderboard } from "../services/leaderboardService";

import {
  AnalyticsHero,
  ProductivityAnalyticsCard,
  FocusAnalyticsCard,
  LearningAnalyticsCard,
  ProcrastinationAnalyticsCard,
  MergedLeaderboardCard,
  WeeklySummaryCard,
  GoalTrackerWidget,
  AIAnalyticsPreviewCard,
  RecommendationPerformanceCard,
} from "../components/analytics";

import { LoadingSpinner, Card, Button } from "../components/ui";
import { AlertCircle } from "lucide-react";

function Analytics() {
  const [activeTab, setActiveTab] = useState("overview"); // overview | focus | skills_ai
  const [globalRange, setGlobalRange] = useState("Week"); // Day | Week | Month

  const [productivity, setProductivity] = useState(null);
  const [focus, setFocus] = useState(null);
  const [skills, setSkills] = useState(null);
  const [summary, setSummary] = useState(null);
  const [goals, setGoals] = useState(null);
  const [procrastination, setProcrastination] = useState(null);
  const [studyVsDistract, setStudyVsDistract] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);

      const [
        prodRes,
        focusRes,
        skillRes,
        summaryRes,
        goalRes,
        procRes,
        svdRes,
        leaderboardRes,
      ] = await Promise.all([
        analyticsService.getProductivity().catch(() => ({ data: null })),
        analyticsService.getFocus().catch(() => ({ data: null })),
        analyticsService.getSkills().catch(() => ({ data: null })),
        analyticsService.getSummary().catch(() => ({ data: null })),
        analyticsService.getGoals().catch(() => ({ data: null })),
        getProcrastinationScore().catch(() => ({ data: null })),
        getStudyVsDistract().catch(() => ({ data: null })),
        getLeaderboard().catch(() => []),
      ]);

      setProductivity(prodRes?.data || null);
      setFocus(focusRes?.data || null);
      setSkills(skillRes?.data || null);
      setSummary(summaryRes?.data || null);
      setGoals(goalRes?.data || null);
      setProcrastination(procRes?.data || null);
      setStudyVsDistract(svdRes?.data || null);
      setLeaderboardData(leaderboardRes || []);
    } catch (err) {
      console.error("Analytics Page Error:", err);
      setError("Failed to load Analytics Intelligence data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [
          prodRes,
          focusRes,
          skillRes,
          summaryRes,
          goalRes,
          procRes,
          svdRes,
          leaderboardRes,
        ] = await Promise.all([
          analyticsService.getProductivity().catch(() => ({ data: null })),
          analyticsService.getFocus().catch(() => ({ data: null })),
          analyticsService.getSkills().catch(() => ({ data: null })),
          analyticsService.getSummary().catch(() => ({ data: null })),
          analyticsService.getGoals().catch(() => ({ data: null })),
          getProcrastinationScore().catch(() => ({ data: null })),
          getStudyVsDistract().catch(() => ({ data: null })),
          getLeaderboard().catch(() => []),
        ]);

        if (isMounted) {
          setProductivity(prodRes?.data || null);
          setFocus(focusRes?.data || null);
          setSkills(skillRes?.data || null);
          setSummary(summaryRes?.data || null);
          setGoals(goalRes?.data || null);
          setProcrastination(procRes?.data || null);
          setStudyVsDistract(svdRes?.data || null);
          setLeaderboardData(leaderboardRes || []);
          setError(null);
        }
      } catch (err) {
        console.error("Analytics Page Error:", err);
        if (isMounted) {
          setError("Failed to load Analytics Intelligence data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading EduPulse Analytics Intelligence Center..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="max-w-md text-center p-8">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark-text mb-4">{error}</h2>
          <Button variant="primary" onClick={loadData}>
            Retry Loading
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-8">
      {/* 1. HERO SECTION & TABBED HUB */}
      <AnalyticsHero
        totalHours={focus?.totalFocusHours ?? 0}
        avgProductivity={productivity?.average ?? 0}
        focusScore={productivity?.average ?? 0}
        longestStreak={summary?.streak ?? 0}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        globalRange={globalRange}
        onRangeChange={setGlobalRange}
      />

      {/* 2. TAB CONTENT WITH FRAMER MOTION TRANSITIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
          className="space-y-5"
        >
          {/* TAB 1: OVERVIEW & PRODUCTIVITY */}
          {activeTab === "overview" && (
            <>
              {/* Productivity Line Chart */}
              <ProductivityAnalyticsCard productivityData={productivity} />

              {/* Focus Area & Rhythm Chart */}
              <FocusAnalyticsCard focusData={focus} />

              {/* Responsive 2-Column Summary + Goal Tracker */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                <WeeklySummaryCard summary={summary} />
                <GoalTrackerWidget goals={goals} />
              </div>
            </>
          )}

          {/* TAB 2: FOCUS & ATTENTION / PROCRASTINATION */}
          {activeTab === "focus" && (
            <>
              {/* Procrastination Signals + Merged Leaderboard in 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                <ProcrastinationAnalyticsCard
                  procrastinationData={procrastination}
                  studyVsDistract={studyVsDistract}
                />
                <MergedLeaderboardCard leaderboard={leaderboardData} />
              </div>

              {/* AI Prediction Models Preview */}
              <AIAnalyticsPreviewCard />
            </>
          )}

          {/* TAB 3: SKILL MASTERY & AI OUTCOMES */}
          {activeTab === "skills_ai" && (
            <>
              {/* Skill Mastery Bar Charts */}
              <LearningAnalyticsCard skillData={skills} />

              {/* AI Recommendation Performance */}
              <RecommendationPerformanceCard />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Analytics;
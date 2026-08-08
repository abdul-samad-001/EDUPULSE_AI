import { useEffect, useState } from "react";
import analyticsService from "../services/analyticsService";
import focusSessionService from "../services/focusSessionService";
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
} from "../components/analytics";

import { Heatmap } from "../components/heatmap";
import { LoadingSpinner, Card, Button } from "../components/ui";
import { AlertCircle } from "lucide-react";

function Analytics() {
  const [productivity, setProductivity] = useState(null);
  const [focus, setFocus] = useState(null);
  const [skills, setSkills] = useState(null);
  const [summary, setSummary] = useState(null);
  const [goals, setGoals] = useState(null);
  const [procrastination, setProcrastination] = useState(null);
  const [studyVsDistract, setStudyVsDistract] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);
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
        historyRes,
        leaderboardRes,
      ] = await Promise.all([
        analyticsService.getProductivity().catch(() => ({ data: null })),
        analyticsService.getFocus().catch(() => ({ data: null })),
        analyticsService.getSkills().catch(() => ({ data: null })),
        analyticsService.getSummary().catch(() => ({ data: null })),
        analyticsService.getGoals().catch(() => ({ data: null })),
        getProcrastinationScore().catch(() => ({ data: null })),
        getStudyVsDistract().catch(() => ({ data: null })),
        focusSessionService.getHistory().catch(() => ({ data: [] })),
        getLeaderboard().catch(() => []),
      ]);

      setProductivity(prodRes?.data || null);
      setFocus(focusRes?.data || null);
      setSkills(skillRes?.data || null);
      setSummary(summaryRes?.data || null);
      setGoals(goalRes?.data || null);
      setProcrastination(procRes?.data || null);
      setStudyVsDistract(svdRes?.data || null);
      setFocusHistory(historyRes?.data || []);
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
          historyRes,
          leaderboardRes,
        ] = await Promise.all([
          analyticsService.getProductivity().catch(() => ({ data: null })),
          analyticsService.getFocus().catch(() => ({ data: null })),
          analyticsService.getSkills().catch(() => ({ data: null })),
          analyticsService.getSummary().catch(() => ({ data: null })),
          analyticsService.getGoals().catch(() => ({ data: null })),
          getProcrastinationScore().catch(() => ({ data: null })),
          getStudyVsDistract().catch(() => ({ data: null })),
          focusSessionService.getHistory().catch(() => ({ data: [] })),
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
          setFocusHistory(historyRes?.data || []);
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
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-10">
      {/* 1. HERO SECTION */}
      <AnalyticsHero
        totalHours={focus?.totalFocusHours || 18.5}
        avgProductivity={productivity?.average || 84}
        focusScore={productivity?.average || 85}
        longestStreak={3}
      />

      {/* 2. PRODUCTIVITY ANALYTICS (LINE CHART) */}
      <ProductivityAnalyticsCard productivityData={productivity} />

      {/* 3. FOCUS ANALYTICS (AREA CHART + STATS) */}
      <FocusAnalyticsCard focusData={focus} />

      {/* 4. LEARNING ANALYTICS (BAR CHARTS) */}
      <LearningAnalyticsCard skillData={skills} />

      {/* 5. STUDY HEATMAP */}
      <Heatmap sessions={focusHistory} streak={3} />

      {/* 6. PROCRASTINATION ANALYTICS & MERGED LEADERBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <ProcrastinationAnalyticsCard
          procrastinationData={procrastination}
          studyVsDistract={studyVsDistract}
        />
        <MergedLeaderboardCard leaderboard={leaderboardData} />
      </div>

      {/* 7. COMPREHENSIVE WEEKLY SUMMARY */}
      <WeeklySummaryCard summary={summary} />

      {/* 8. GOAL TRACKER & AI ANALYTICS PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <GoalTrackerWidget goals={goals} />
        <AIAnalyticsPreviewCard />
      </div>
    </div>
  );
}

export default Analytics;
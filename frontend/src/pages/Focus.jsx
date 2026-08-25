import { useEffect, useState, useRef } from "react";
import focusSessionService from "../services/focusSessionService";
import skillService from "../services/skillService";
import achievementService from "../services/achievementService";

import {
  FocusHero,
  FocusTimer,
  FocusControls,
  FocusStats,
  WeeklyFocusChart,
  FocusInsightsWidget,
  BreakTimerCard,
  AIFocusPreviewCard,
  FocusAchievementsWidget,
  SessionHistory,
} from "../components/focus";

import { LoadingSpinner, Card, Button, toast } from "../components/ui";
import { AlertCircle } from "lucide-react";

function Focus() {
  const controlsRef = useRef(null);

  const [activeSession, setActiveSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [skills, setSkills] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [achievements, setAchievements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);

      const [
        activeRes,
        historyRes,
        skillsRes,
        statsRes,
        weeklyRes,
        insightsRes,
        achievementsRes,
      ] = await Promise.all([
        focusSessionService.getActiveSession().catch(() => ({ data: null })),
        focusSessionService.getHistory().catch(() => ({ data: [] })),
        skillService.getSkills().catch(() => []),
        focusSessionService.getStatistics().catch(() => ({ data: null })),
        focusSessionService.getWeekly().catch(() => ({ data: { weekly: [] } })),
        focusSessionService.getInsights().catch(() => ({ data: null })),
        achievementService.getAchievements().catch(() => []),
      ]);

      setActiveSession(activeRes?.data || null);
      setHistory(historyRes?.data || []);
      setSkills(skillsRes || []);
      setStatistics(statsRes?.data || null);
      setWeeklyData(weeklyRes?.data?.weekly || []);
      setInsights(insightsRes?.data || null);
      setAchievements(achievementsRes || []);
    } catch (err) {
      console.error("Focus Page Load Error:", err);
      setError("Failed to load Focus Workspace data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [
          activeRes,
          historyRes,
          skillsRes,
          statsRes,
          weeklyRes,
          insightsRes,
          achievementsRes,
        ] = await Promise.all([
          focusSessionService.getActiveSession().catch(() => ({ data: null })),
          focusSessionService.getHistory().catch(() => ({ data: [] })),
          skillService.getSkills().catch(() => []),
          focusSessionService.getStatistics().catch(() => ({ data: null })),
          focusSessionService.getWeekly().catch(() => ({ data: { weekly: [] } })),
          focusSessionService.getInsights().catch(() => ({ data: null })),
          achievementService.getAchievements().catch(() => []),
        ]);

        if (isMounted) {
          setActiveSession(activeRes?.data || null);
          setHistory(historyRes?.data || []);
          setSkills(skillsRes || []);
          setStatistics(statsRes?.data || null);
          setWeeklyData(weeklyRes?.data?.weekly || []);
          setInsights(insightsRes?.data || null);
          setAchievements(achievementsRes || []);
          setError(null);
        }
      } catch (err) {
        console.error("Focus Page Error:", err);
        if (isMounted) {
          setError("Failed to load Focus Workspace data.");
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

  const handleScrollToControls = () => {
    if (controlsRef.current) {
      controlsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStopActiveSession = async () => {
    try {
      await focusSessionService.stopSession();
      toast.success("🎉 Focus Session Completed!", {
        description: "Great focus! Your session log has been saved and XP awarded.",
      });
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error("Session Error", {
        description: "Failed to stop focus session.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading EduPulse Focus Workspace..." />
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
      <FocusHero
        streak={3}
        todayMinutes={statistics?.todayMinutes || 0}
        completedSessions={statistics?.totalSessions || history.length}
        onStartFocusClick={handleScrollToControls}
      />

      {/* 2. TODAY'S PRODUCTIVITY STATS */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-dark-muted px-1">
          Today's Productivity Stats
        </h2>
        <FocusStats history={history} stats={statistics} />
      </div>

      {/* 3. FOCUS TIMER & FOCUS CONTROLS */}
      <div ref={controlsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <FocusTimer session={activeSession} onStopSession={handleStopActiveSession} />
        <FocusControls
          session={activeSession}
          skills={skills}
          onSessionChange={loadData}
        />
      </div>

      {/* 4. WEEKLY FOCUS CHART & FOCUS INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <WeeklyFocusChart weeklyData={weeklyData} />
        <FocusInsightsWidget insights={insights} />
      </div>

      {/* 5. BREAK TIMER & AI FOCUS PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <BreakTimerCard />
        <AIFocusPreviewCard />
      </div>

      {/* 6. FOCUS ACHIEVEMENTS & SESSION HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-1">
          <FocusAchievementsWidget achievements={achievements} streak={3} />
        </div>
        <div className="lg:col-span-2">
          <SessionHistory history={history} onStartFirstSession={handleScrollToControls} />
        </div>
      </div>
    </div>
  );
}

export default Focus;
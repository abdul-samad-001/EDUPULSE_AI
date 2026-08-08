import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import { getTelemetryStats } from "../services/telemetryService";
import xpService from "../services/xpService";
import dailyChallengeService from "../services/dailyChallengeService";
import focusSessionService from "../services/focusSessionService";
import notificationService from "../services/notificationService";
import achievementService from "../services/achievementService";

import HeroSection from "../components/dashboard/HeroSection";
import QuickActions from "../components/dashboard/QuickActions";
import FocusSessionCard from "../components/dashboard/FocusSessionCard";
import DailyChallengeCard from "../components/dashboard/DailyChallengeCard";
import XPCard from "../components/dashboard/XPCard";
import AICoachPreviewCard from "../components/dashboard/AICoachPreviewCard";
import ExtensionStatusCard from "../components/dashboard/ExtensionStatusCard";
import RecentNotificationsWidget from "../components/dashboard/RecentNotificationsWidget";
import RecentSkills from "../components/dashboard/RecentSkills";
import RecentAchievementsWidget from "../components/dashboard/RecentAchievementsWidget";

import { Heatmap } from "../components/heatmap";
import { StatCard, LoadingSpinner, Card, Button } from "../components/ui";
import { Clock, CheckCircle2, Zap, Award } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const focusSectionRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState(null);
  const [telemetryStats, setTelemetryStats] = useState(null);
  const [recentSkills, setRecentSkills] = useState([]);
  const [focusHistory, setFocusHistory] = useState([]);
  const [xp, setXP] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          statsData,
          recentData,
          telemetryData,
          xpData,
          challengeData,
          historyRes,
          notificationsData,
          achievementsData,
        ] = await Promise.all([
          dashboardService.getDashboardStats().catch(() => null),
          dashboardService.getRecentSkills().catch(() => ({ skills: [] })),
          getTelemetryStats().catch(() => ({ stats: null })),
          xpService.getXP().catch(() => null),
          dailyChallengeService.getDailyChallenge().catch(() => null),
          focusSessionService.getHistory().catch(() => ({ data: [] })),
          notificationService.getNotifications().catch(() => []),
          achievementService.getAchievements().catch(() => []),
        ]);

        setStats(statsData);
        setRecentSkills(recentData?.skills || []);
        setTelemetryStats(telemetryData?.stats || null);
        setXP(xpData);
        setChallenge(challengeData);
        setFocusHistory(historyRes?.data || []);
        setNotifications(notificationsData || []);
        setAchievements(achievementsData || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleScrollToFocus = () => {
    if (focusSectionRef.current) {
      focusSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="lg" label="Loading EduPulse AI Dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="max-w-md text-center p-6">
          <h2 className="text-lg font-bold text-rose-400 mb-3">{error}</h2>
          <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
            Retry Loading
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-10">
      {/* 1. HERO SECTION */}
      <HeroSection
        user={user}
        xp={xp}
        streak={stats?.streak ?? 0}
        onStartFocus={handleScrollToFocus}
      />

      {/* 2. TODAY'S STATISTICS */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-dark-muted px-1">
          Today's Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Focus Time"
            value={`${Math.floor((telemetryStats?.productiveTime ?? 0) / 60)} min`}
            icon={Clock}
            subtext="Deep work today"
            trend={12}
            trendLabel="vs yesterday"
          />
          <StatCard
            title="Tasks Completed"
            value={stats?.completedSkills ?? 0}
            icon={CheckCircle2}
            subtext="Milestones finished"
            trend={3}
            trendLabel="this week"
          />
          <StatCard
            title="Productivity"
            value={`${telemetryStats?.productivePercentage ?? 0}%`}
            icon={Zap}
            subtext="Focus efficiency"
            trend={5}
            trendLabel="overall"
          />
          <StatCard
            title="XP Earned Today"
            value={`+${xp?.currentLevelXP ?? 0} XP`}
            icon={Award}
            subtext="Level progress"
            trend={45}
            trendLabel="daily XP"
          />
        </div>
      </div>

      {/* 3. QUICK ACTIONS & EXTENSION STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <QuickActions onStartFocusClick={handleScrollToFocus} />
        <ExtensionStatusCard />
      </div>

      {/* 4. FOCUS SESSION & DAILY CHALLENGE */}
      <div ref={focusSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <FocusSessionCard />
        <DailyChallengeCard challenge={challenge} />
      </div>

      {/* 5. STUDY HEATMAP & XP PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <Heatmap sessions={focusHistory} streak={stats?.streak ?? 0} />
        <XPCard xp={xp} />
      </div>

      {/* 6. AI COACH PREVIEW & RECENT NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <AICoachPreviewCard />
        <RecentNotificationsWidget notifications={notifications} />
      </div>

      {/* 7. RECENT SKILLS & RECENT ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <RecentSkills skills={recentSkills} />
        <RecentAchievementsWidget achievements={achievements} />
      </div>
    </div>
  );
}

export default Dashboard;
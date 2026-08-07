import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import { getTelemetryStats } from "../services/telemetryService";
import StatCard from "../components/dashboard/StatCard";
import OverallProgress from "../components/dashboard/OverallProgress";
import RecentSkills from "../components/dashboard/RecentSkills";
import FocusSessionCard from "../components/dashboard/FocusSessionCard";
import QuickAnalyticsCard from "../components/dashboard/QuickAnalyticsCard";
import XPCard from "../components/dashboard/XPCard";
import DailyChallengeCard from "../components/dashboard/DailyChallengeCard";
import LeaderboardWidget from "../components/dashboard/LeaderboardWidget";

import xpService from "../services/xpService";
import dailyChallengeService from "../services/dailyChallengeService";
import leaderboardService from "../services/leaderboardService";
import focusSessionService from "../services/focusSessionService";
import { Heatmap } from "../components/heatmap";
import { SectionHeader, Button, LoadingSpinner, Card } from "../components/ui";
import { LayoutDashboard, BookOpen, Clock, Zap, Target, Flame, Activity } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState(null);
  const [telemetryStats, setTelemetryStats] = useState(null);
  const [recentSkills, setRecentSkills] = useState([]);
  const [focusHistory, setFocusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New State
  const [xp, setXP] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [leaderboard, setLeaderBoard] = useState([]);

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
          leaderboardData,
          historyRes,
        ] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentSkills(),
          getTelemetryStats(),
          xpService.getXP(),
          dailyChallengeService.getDailyChallenge(),
          leaderboardService.getLeaderboard(),
          focusSessionService.getHistory(),
        ]);

        setStats(statsData);
        setRecentSkills(recentData.skills || []);
        setTelemetryStats(telemetryData.stats);
        setXP(xpData);
        setChallenge(challengeData);
        setLeaderBoard(leaderboardData);
        setFocusHistory(historyRes.data || []);
      } catch (err) {
        console.error("Dashboard Integration Error:", err);
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

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="lg" label="Loading EduPulse Dashboard..." />
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
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <SectionHeader
        title={`Welcome back, ${user?.name || "Learner"} 🚀`}
        subtitle="Here is your personal learning overview and productivity breakdown."
        icon={LayoutDashboard}
        action={
          <Button
            variant="primary"
            size="sm"
            icon={BookOpen}
            onClick={() => navigate("/skills")}
          >
            Manage Skills
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Skills"
          value={stats?.totalSkills ?? 0}
          icon={BookOpen}
        />
        <StatCard
          title="Completed"
          value={stats?.completedSkills ?? 0}
          icon={Target}
        />
        <StatCard
          title="Overall Progress"
          value={`${stats?.overallProgress ?? 0}%`}
          icon={Zap}
        />
        <StatCard
          title="Current Streak"
          value={`${stats?.streak ?? 0} Days`}
          icon={Flame}
        />
      </div>

      {/* Telemetry Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Focus Sessions"
          value={telemetryStats?.totalSessions ?? 0}
          icon={Clock}
        />
        <StatCard
          title="Tracked Time"
          value={`${Math.floor((telemetryStats?.totalTrackedTime ?? 0) / 60)} min`}
          icon={Activity}
        />
        <StatCard
          title="Productive Time"
          value={`${Math.floor((telemetryStats?.productiveTime ?? 0) / 60)} min`}
          icon={Zap}
        />
        <StatCard
          title="Distraction Time"
          value={`${Math.floor((telemetryStats?.distractionTime ?? 0) / 60)} min`}
          icon={Clock}
        />
        <StatCard
          title="Productivity"
          value={`${telemetryStats?.productivePercentage ?? 0}%`}
          icon={Activity}
        />
      </div>

      {/* XP Header Banner / Card */}
      {xp && <XPCard xp={xp} />}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <FocusSessionCard />
          <DailyChallengeCard challenge={challenge} />
          <OverallProgress value={stats?.overallProgress ?? 0} />
          <QuickAnalyticsCard />
          <Heatmap sessions={focusHistory} />
        </div>

        {/* Right Side */}
        <div className="space-y-4 sm:space-y-5">
          <RecentSkills skills={recentSkills} />
          <LeaderboardWidget users={leaderboard} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
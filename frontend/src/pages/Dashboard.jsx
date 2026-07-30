import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import { getTelemetryStats } from "../services/telemetryService";
import StatCard from "../components/dashboard/StatCard";
import OverallProgress from "../components/dashboard/OverallProgress";
import CategoryChart from "../components/dashboard/CategoryChart";
import RecentSkills from "../components/dashboard/RecentSkills";
import FocusSessionCard from "../components/dashboard/FocusSessionCard";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState(null);
  const [telemetryStats, setTelemetryStats] = useState(null);
  const [recentSkills, setRecentSkills] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
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

        const [statsData, recentData, chartData, telemetryData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentSkills(),
          dashboardService.getCategoryStats(),
          getTelemetryStats(),
        ]);

        console.log("Dashboard Stats:", statsData);
        console.log("Recent Skills:", recentData);
        console.log("Category Data:", chartData);

        setStats(statsData);
        setRecentSkills(recentData.skills || []);
        setCategoryData(chartData || []);
        setTelemetryStats(telemetryData.stats);
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

  useEffect(() => {
    console.log("Stats State:", stats);
    console.log("Recent Skills State:", recentSkills);
    console.log("Category State:", categoryData);
  }, [stats, recentSkills, categoryData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <h2 className="text-lg font-medium">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Dashboard 🚀
            </h1>

            <p className="text-slate-600">
              Welcome back, {user?.name}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/skills")}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-semibold shadow"
            >
              Manage Skills
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold shadow"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <StatCard
            title="Total Skills"
            value={stats?.totalSkills ?? 0}
          />

          <StatCard
            title="Completed"
            value={stats?.completedSkills ?? 0}
          />

          <StatCard
            title="Overall Progress"
            value={`${stats?.overallProgress ?? 0}%`}
          />

          <StatCard
            title="Current Streak"
            value={`🔥 ${stats?.streak ?? 0} Days`}
          />

        </div>
        {/* Telemetry Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard
          title="Focus Sessions"
          value={telemetryStats?.totalSessions ?? 0}
          />
          <StatCard
          title="Tracked Time"
          value={`${Math.floor((telemetryStats?.totalTrackedTime ?? 0) / 60)} min`}
          />

          <StatCard
          title="Productive Time"
          value={`${Math.floor((telemetryStats?.productiveTime ?? 0) / 60)} min`}
          />

          <StatCard
          title="Distraction Time"
          value={`${Math.floor((telemetryStats?.distractionTime ?? 0) / 60)} min`}
          />

          <StatCard
          title="Productivity"
          value={`${telemetryStats?.productivePercentage ?? 0}%`}
          />

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Side */}
          <div className="lg:col-span-2 space-y-8">

            <FocusSessionCard />

            <OverallProgress
              value={stats?.overallProgress ?? 0}
            />

            <CategoryChart
              data={categoryData}
            />

          </div>

          {/* Right Side */}
          <div className="space-y-8">

            <RecentSkills
              skills={recentSkills}
            />

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
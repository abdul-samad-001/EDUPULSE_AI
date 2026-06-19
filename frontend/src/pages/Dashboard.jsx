import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dashboardService from "../services/dashboardService";

import StatCard from "../components/dashboard/StatCard";
import OverallProgress from "../components/dashboard/OverallProgress";
import CategoryChart from "../components/dashboard/CategoryChart";
import RecentSkills from "../components/dashboard/RecentSkills";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState(null);
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

        const [statsData, recentData, chartData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentSkills(),
          dashboardService.getCategoryStats(),
        ]);

        // Debug Logs
        console.log("Dashboard Stats:", statsData);
        console.log("Recent Skills:", recentData);
        console.log("Category Data:", chartData);

        setStats(statsData);

        // recent-skills API returns { success, skills }
        setRecentSkills(recentData.skills || []);

        // dashboardService already transforms category data into an array
        setCategoryData(chartData || []);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Dashboard 🚀
            </h1>

            <p className="text-slate-600">
              Welcome back, {user?.name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
          <button
          onClick={() => navigate("/skills")}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-semibold tracking-wide shadow transition mr-2">
            Manage Skills Tracking
          </button>
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

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">
            <OverallProgress
              value={stats?.overallProgress ?? 0}
            />

            <CategoryChart
              data={categoryData}
            />
          </div>

          <RecentSkills
            skills={recentSkills}
          />

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
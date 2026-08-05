import { useEffect, useState } from "react";

import {
  getTelemetryStats,
  getTopWebsites,
  getWeeklyTrend,
  getHourlyProductivity,
  getStudyVsDistract,
  getAIInsights,
  getProcrastinationScore,
} from "../services/telemetryService";

import dashboardService from "../services/dashboardService";

import ProductivityPieChart from "../components/dashboard/analytics/ProductivityPieChart";
import CategoryChart from "../components/dashboard/analytics/CategoryChart";
import WeeklyTrendChart from "../components/dashboard/analytics/WeeklyTrendChart";
import HourlyProductivityChart from "../components/dashboard/analytics/HourlyProductivityChart";
import StudyVsDistractChart from "../components/dashboard/analytics/StudyVsDistractChart";
import AIInsights from "../components/dashboard/analytics/AIInsights";
import ProcrastinationCard from "../components/dashboard/analytics/ProcrastinationCard";
import TopWebsites from "../components/dashboard/analytics/TopWebsites";

function Analytics() {
  const [telemetryStats, setTelemetryStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [hourlyProductivity, setHourlyProductivity] = useState([]);
  const [studyVsDistract, setStudyVsDistract] = useState({
    productiveMinutes: 0,
    distractingMinutes: 0,
  });
  const [aiInsights, setAIInsights] = useState([]);
  const [procrastinationData, setProcrastinationData] =
    useState(null);
  const [topWebsites, setTopWebsites] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [
          chartData,
          telemetryData,
          websitesData,
          weeklyTrendData,
          hourlyData,
          studyVsDistractData,
          aiInsightsData,
          procrastinationResponse,
        ] = await Promise.all([
          dashboardService.getCategoryStats(),
          getTelemetryStats(),
          getTopWebsites(),
          getWeeklyTrend(),
          getHourlyProductivity(),
          getStudyVsDistract(),
          getAIInsights(),
          getProcrastinationScore(),
        ]);

        setCategoryData(chartData || []);
        setTelemetryStats(telemetryData.stats);
        setTopWebsites(websitesData.data || []);
        setWeeklyTrend(weeklyTrendData.data || []);
        setHourlyProductivity(hourlyData.data || []);
        setStudyVsDistract(
          studyVsDistractData.data || {
            productiveMinutes: 0,
            distractingMinutes: 0,
          }
        );
        setAIInsights(aiInsightsData.data || []);
        setProcrastinationData(
          procrastinationResponse.data
        );
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Trigger re-render by setting loading or re-executing fetch
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <h2 className="text-xl font-semibold">
            Loading Analytics...
          </h2>

          <p className="text-gray-500 mt-2">
            Fetching your productivity insights.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold mb-6">
            {error}
          </h2>

          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>

        </div>
      </div>
    );
  }

  if (
    !telemetryStats ||
    telemetryStats.totalSessions === 0
  ) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-lg">

          <div className="text-6xl mb-4">
            📊
          </div>

          <h2 className="text-2xl font-bold mb-3">
            No Analytics Available
          </h2>

          <p className="text-gray-600">
            Complete your first focus session
            to generate productivity analytics.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold">
        📊 Analytics
      </h1>

      <ProductivityPieChart
        telemetryStats={telemetryStats}
      />

      <CategoryChart
        data={categoryData}
      />

      <WeeklyTrendChart
        data={weeklyTrend}
      />

      <HourlyProductivityChart
        data={hourlyProductivity}
      />

      <StudyVsDistractChart
        data={studyVsDistract}
      />

      <AIInsights
        insights={aiInsights}
      />

      <ProcrastinationCard
        data={procrastinationData}
      />

      <TopWebsites
        websites={topWebsites}
      />

    </div>
  );
}

export default Analytics;
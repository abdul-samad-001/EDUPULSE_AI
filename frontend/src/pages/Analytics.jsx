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

import { SectionHeader, LoadingSpinner, EmptyState, Button, Card } from "../components/ui";
import { BarChart3, AlertCircle } from "lucide-react";

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
  const [procrastinationData, setProcrastinationData] = useState(null);
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
        setProcrastinationData(procrastinationResponse.data);
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
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Fetching your productivity insights..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="max-w-md text-center p-8">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark-text mb-4">{error}</h2>
          <Button variant="primary" onClick={handleRetry}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!telemetryStats || telemetryStats.totalSessions === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <EmptyState
          icon={BarChart3}
          title="No Analytics Available"
          description="Complete your first focus session to generate productivity analytics."
          className="max-w-lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Analytics & Insights 📊"
        subtitle="Deep dive into your focus, web habits, procrastination trends, and AI recommendations."
        icon={BarChart3}
      />

      <ProductivityPieChart telemetryStats={telemetryStats} />

      <CategoryChart data={categoryData} />

      <WeeklyTrendChart data={weeklyTrend} />

      <HourlyProductivityChart data={hourlyProductivity} />

      <StudyVsDistractChart data={studyVsDistract} />

      <AIInsights insights={aiInsights} />

      <ProcrastinationCard data={procrastinationData} />

      <TopWebsites websites={topWebsites} />
    </div>
  );
}

export default Analytics;
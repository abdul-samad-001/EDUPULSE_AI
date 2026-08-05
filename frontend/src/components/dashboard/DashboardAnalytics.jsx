import ProductivityPieChart from "./analytics/ProductivityPieChart";
import CategoryChart from "./analytics/CategoryChart";
import WeeklyTrendChart from "./analytics/WeeklyTrendChart";
import HourlyProductivityChart from "./analytics/HourlyProductivityChart";
import StudyVsDistractChart from "./analytics/StudyVsDistractChart";
import AIInsights from "./analytics/AIInsights";
import ProcrastinationCard from "./analytics/ProcrastinationCard";
import TopWebsites from "./analytics/TopWebsites";

function DashboardAnalytics({
  telemetryStats,
  categoryData,
  weeklyTrend,
  hourlyProductivity,
  studyVsDistract,
  aiInsights,
  procrastinationData,
  topWebsites,
}) {
  return (
    <>

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

    </>
  );
}

export default DashboardAnalytics;
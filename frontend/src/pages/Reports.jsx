import { useEffect, useState } from "react";
import ReportSummaryCard from "../components/reports/ReportSummaryCard";
import DownloadReportButton from "../components/reports/DownloadReportButton";
import WeeklyTrendChart from "../components/dashboard/analytics/WeeklyTrendChart";
import TopWebsites from "../components/dashboard/analytics/TopWebsites";
import AIInsights from "../components/dashboard/analytics/AIInsights";
import SkillProgressCard from "../components/reports/SkillProgressCard";
import AIReportCard from "../components/reports/AIReportCard";

import {
  getReportSummary,
  getWeeklyReport,
  getMonthlyReport,
  getSkillProgress,
  getAIReport,
} from "../services/reportService";
function Reports() {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [skills, setSkills] = useState([]);
  const [ai, setAI] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [
        summaryData,
        weeklyData,
        monthlyData,
        skillData,
        aiData,
      ] = await Promise.all([
        getReportSummary(),
        getWeeklyReport(),
        getMonthlyReport(),
        getSkillProgress(),
        getAIReport(),
      ]);

      setSummary(summaryData);
      setWeekly(weeklyData);
      setMonthly(monthlyData);
      setSkills(skillData);
      setAI(aiData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        📄 Reports
      </h1>
      <DownloadReportButton />
      <ReportSummaryCard stats={summary.stats} />
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">
          Weekly Trend
        </h2>

        <WeeklyTrendChart data={weekly.weeklyTrend} />
      </div>
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <TopWebsites websites={monthly.websites} />
      </div>
      <div className="mt-8">
        <SkillProgressCard skills={skills} />
      </div>
      <div className="mt-8">
        <AIInsights
          productivityScore={ai.productivityScore}
          insights={ai.insights}
          recommendation={ai.recommendation}
        />
      </div>
      <div className="mt-8">
        <AIReportCard ai={ai} />
      </div>

    </div>
  );
}

export default Reports;
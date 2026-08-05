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
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

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
    } catch (err) {
      console.error(err);
      setError("Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      } catch (err) {
        console.error(err);
        setError("Unable to load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <h2 className="text-xl font-semibold">
            Loading Reports...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-2xl font-bold mb-6">
            {error}
          </h2>

          <button
            onClick={fetchReports}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold">
        📄 Reports
      </h1>

      <DownloadReportButton />

      <ReportSummaryCard
        stats={summary?.stats}
      />

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">
          Weekly Trend
        </h2>

        <WeeklyTrendChart
          data={weekly?.weeklyTrend || []}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <TopWebsites
          websites={monthly?.websites || []}
        />
      </div>

      <SkillProgressCard
        skills={skills || []}
      />

      <AIInsights
        productivityScore={ai?.productivityScore}
        insights={ai?.insights || []}
        recommendation={ai?.recommendation}
      />

      <AIReportCard
        ai={ai}
      />

    </div>
  );
}

export default Reports;
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

import { SectionHeader, LoadingSpinner, Card, Button } from "../components/ui";
import { FileText, AlertCircle } from "lucide-react";

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
        <LoadingSpinner size="lg" label="Generating detailed reports..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="max-w-md text-center p-8">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark-text mb-4">{error}</h2>
          <Button variant="primary" onClick={fetchReports}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Reports & Analytics Export 📄"
        subtitle="Review weekly, monthly performance, skill growth, and download report summaries."
        icon={FileText}
        action={<DownloadReportButton />}
      />

      <ReportSummaryCard stats={summary?.stats} />

      <Card title="Weekly Trend" className="w-full">
        <WeeklyTrendChart data={weekly?.weeklyTrend || []} />
      </Card>

      <Card className="w-full">
        <TopWebsites websites={monthly?.websites || []} />
      </Card>

      <SkillProgressCard skills={skills || []} />

      <AIInsights
        productivityScore={ai?.productivityScore}
        insights={ai?.insights || []}
        recommendation={ai?.recommendation}
      />

      <AIReportCard ai={ai} />
    </div>
  );
}

export default Reports;
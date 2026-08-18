import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  getReportSummary,
  getWeeklyReport,
  getMonthlyReport,
  getSkillProgress,
  getAIReport,
  getTimeline,
  getReportHistory,
} from "../services/reportService";

import {
  ReportsHero,
  ReportSummaryCards,
  StudyPerformanceCard,
  LearningTimelineWidget,
  SkillProgressReportCard,
  WeeklyReviewCard,
  MonthlyReviewCard,
  AIReportPreviewCard,
  ExportCenterWidget,
  ReportHistoryWidget,
  AchievementSummaryWidget,
} from "../components/reports";

import { LoadingSpinner, Card, Button, EmptyState } from "../components/ui";
import { AlertCircle, FileText } from "lucide-react";

function Reports() {
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [skills, setSkills] = useState([]);
  const [ai, setAI] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [history, setHistory] = useState([]);

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
        timelineData,
        historyData,
      ] = await Promise.all([
        getReportSummary().catch(() => null),
        getWeeklyReport().catch(() => null),
        getMonthlyReport().catch(() => null),
        getSkillProgress().catch(() => []),
        getAIReport().catch(() => null),
        getTimeline().catch(() => []),
        getReportHistory().catch(() => []),
      ]);

      setSummary(summaryData);
      setWeekly(weeklyData);
      setMonthly(monthlyData);
      setSkills(skillData || []);
      setAI(aiData);
      setTimeline(timelineData || []);
      setHistory(historyData || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load reports intelligence center.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      try {
        const [
          summaryData,
          weeklyData,
          monthlyData,
          skillData,
          aiData,
          timelineData,
          historyData,
        ] = await Promise.all([
          getReportSummary().catch(() => null),
          getWeeklyReport().catch(() => null),
          getMonthlyReport().catch(() => null),
          getSkillProgress().catch(() => []),
          getAIReport().catch(() => null),
          getTimeline().catch(() => []),
          getReportHistory().catch(() => []),
        ]);

        if (isMounted) {
          setSummary(summaryData);
          setWeekly(weeklyData);
          setMonthly(monthlyData);
          setSkills(skillData || []);
          setAI(aiData);
          setTimeline(timelineData || []);
          setHistory(historyData || []);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Unable to load reports intelligence center.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Generating detailed reports intelligence center..." />
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
            Retry Loading Reports
          </Button>
        </Card>
      </div>
    );
  }

  const hasData = summary || (skills && skills.length > 0) || (timeline && timeline.length > 0);

  if (!hasData) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        <ReportsHero />
        <Card className="p-8 text-center">
          <EmptyState
            title="No reports generated yet."
            description="Start focus sessions and complete learning skills to unlock detailed intelligence reports."
            icon={FileText}
            actionLabel="Generate Report"
            onAction={fetchReports}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* 1. HERO SECTION WITH TAB NAVIGATION */}
      <ReportsHero
        totalReports={history?.length || 3}
        studyHours={Math.round((summary?.stats?.productiveTime || 1110) / 60)}
        skillsCompleted={skills?.filter((s) => s.progress === 100)?.length || 4}
        xpEarned={750}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 2. TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* KPI STAT CARDS */}
            <ReportSummaryCards
              summary={{
                studyHours: Math.round((summary?.stats?.productiveTime || 1110) / 60),
                sessions: summary?.stats?.totalSessions || 24,
                tasks: 28,
                skills: skills?.length || 5,
                achievements: 6,
                xp: 750,
                productivity: summary?.stats?.productivePercentage || 84,
              }}
            />

            {/* PERFORMANCE & TIMELINE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
              <StudyPerformanceCard
                performanceData={{
                  productivity: summary?.stats?.productivePercentage || 84,
                  focusScore: 88,
                  completionRate: 76,
                  consistency: "92%",
                }}
              />
              <LearningTimelineWidget timelineEvents={timeline} />
            </div>
          </motion.div>
        )}

        {activeTab === "periodic" && (
          <motion.div
            key="periodic"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
              <WeeklyReviewCard weekly={weekly} />
              <MonthlyReviewCard monthly={monthly} />
            </div>
          </motion.div>
        )}

        {activeTab === "skills_ai" && (
          <motion.div
            key="skills_ai"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-7">
                <SkillProgressReportCard skillsProgress={skills} />
              </div>
              <div className="lg:col-span-5">
                <AIReportPreviewCard aiReport={ai} />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "export_history" && (
          <motion.div
            key="export_history"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <ExportCenterWidget />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
              <ReportHistoryWidget history={history} />
              <AchievementSummaryWidget />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Reports;
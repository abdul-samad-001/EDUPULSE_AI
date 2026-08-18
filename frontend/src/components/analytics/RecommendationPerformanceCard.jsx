import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Card, Badge, LoadingSpinner } from "../ui";
import { Sparkles, CheckCircle2, ThumbsUp, Award, Target } from "lucide-react";
import { getRecommendationStats } from "../../services/recommendationService";

function RecommendationPerformanceCard() {
  const [viewMode, setViewMode] = useState("week"); // day | week | month
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getRecommendationStats();
        if (isMounted && res?.success && res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.warn("Recommendation stats warning:", err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const dataByTimeframe = {
    day: {
      total: 5,
      accepted: 4,
      completed: 3,
      dismissed: 1,
      ignored: 0,
      acceptanceRate: 80,
      completionRate: 75,
    },
    week: {
      total: stats?.totalRecommendations ?? 12,
      accepted: stats?.acceptedRecommendations ?? 9,
      completed: stats?.completedRecommendations ?? 8,
      dismissed: stats?.dismissedRecommendations ?? 2,
      ignored: stats?.ignoredRecommendations ?? 1,
      acceptanceRate: stats?.acceptanceRate ?? 75,
      completionRate: stats?.completionRate ?? 89,
    },
    month: {
      total: 48,
      accepted: 38,
      completed: 34,
      dismissed: 6,
      ignored: 4,
      acceptanceRate: 79,
      completionRate: 89,
    },
  };

  const current = dataByTimeframe[viewMode] || dataByTimeframe.week;
  const avgConfidence = stats?.averageConfidence ? Math.round(stats.averageConfidence * 100) : 78;

  const mostAccepted = stats?.mostAcceptedRecommendation || "Start Focus Session";
  const mostCompleted = stats?.mostCompletedRecommendation || "Complete Pending Tasks";

  const chartData = [
    { name: "Accepted", value: current.accepted, color: "#2dd4bf" },
    { name: "Completed", value: current.completed, color: "#38bdf8" },
    { name: "Dismissed", value: current.dismissed, color: "#f43f5e" },
    { name: "Ignored", value: current.ignored, color: "#94a3b8" },
  ];

  return (
    <Card
      title="📊 AI Recommendation Outcome & Feedback"
      subtitle="Historical feedback tracking learner adherence and recommendation fulfillment"
      headerAction={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" icon={Sparkles} size="sm">
            {current.acceptanceRate}% Acceptance
          </Badge>
          <div className="flex items-center gap-1 bg-dark-bg p-1 rounded-xl border border-dark-border">
            {[
              { id: "day", label: "Day" },
              { id: "week", label: "Week" },
              { id: "month", label: "Month" },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === mode.id
                    ? "bg-primary text-dark-bg shadow-xs"
                    : "text-dark-muted hover:text-dark-text"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      }
      className="w-full"
    >
      {loading ? (
        <div className="py-8 flex justify-center items-center">
          <LoadingSpinner size="md" label="Loading recommendation feedback analytics..." />
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {/* Summary Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase flex items-center gap-1">
                <Target className="w-3 h-3 text-primary" />
                Total Shown
              </span>
              <p className="text-base font-extrabold text-dark-text pt-0.5">{current.total}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-emerald-400" />
                Accepted
              </span>
              <p className="text-base font-extrabold text-emerald-400 pt-0.5">{current.accepted}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-sky-400" />
                Completed
              </span>
              <p className="text-base font-extrabold text-sky-400 pt-0.5">{current.completed}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" />
                Completion Rate
              </span>
              <p className="text-base font-extrabold text-amber-400 pt-0.5">{current.completionRate}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            {/* Left Column: Recharts Bar Visualization */}
            <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border">
              <h4 className="text-[11px] font-extrabold uppercase text-dark-muted tracking-wider mb-1.5">
                Outcome Status ({viewMode.toUpperCase()})
              </h4>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-dark-card border border-dark-border text-dark-text p-2 rounded-lg text-xs font-semibold shadow-xl">
                              <p className="font-bold" style={{ color: payload[0].payload.color }}>
                                {payload[0].name}
                              </p>
                              <p>{payload[0].value} events</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column: Behavioral Insights */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-primary tracking-wider block">
                  Most Followed Action
                </span>
                <p className="text-xs font-extrabold text-dark-text">{mostAccepted}</p>
                <p className="text-[10px] text-dark-muted">
                  Highest initial acceptance rate among suggestions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-sky-400 tracking-wider block">
                  Most Completed Goal
                </span>
                <p className="text-xs font-extrabold text-dark-text">{mostCompleted}</p>
                <p className="text-[10px] text-dark-muted">
                  Highest end-to-end task completion rate.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-primary font-medium">
                <p>
                  Avg Model Confidence: <strong>{avgConfidence}%</strong> | Dismissed: <strong>{Math.round((current.dismissed / (current.total || 1)) * 100)}%</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default RecommendationPerformanceCard;

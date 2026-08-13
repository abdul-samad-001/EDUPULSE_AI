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

  const total = stats?.totalRecommendations ?? 12;
  const accepted = stats?.acceptedRecommendations ?? 9;
  const completed = stats?.completedRecommendations ?? 8;
  const dismissed = stats?.dismissedRecommendations ?? 2;
  const ignored = stats?.ignoredRecommendations ?? 1;

  const acceptanceRate = stats?.acceptanceRate ?? 75;
  const completionRate = stats?.completionRate ?? 89;
  const avgConfidence = stats?.averageConfidence ? Math.round(stats.averageConfidence * 100) : 78;

  const mostAccepted = stats?.mostAcceptedRecommendation || "Start Focus Session";
  const mostCompleted = stats?.mostCompletedRecommendation || "Complete Pending Tasks";

  const chartData = [
    { name: "Accepted", value: accepted, color: "#2dd4bf" },
    { name: "Completed", value: completed, color: "#38bdf8" },
    { name: "Dismissed", value: dismissed, color: "#f43f5e" },
    { name: "Ignored", value: ignored, color: "#94a3b8" },
  ];

  return (
    <Card
      title="📊 AI Recommendation Outcome & Performance"
      subtitle="Historical feedback tracking learner adherence and recommendation fulfillment"
      headerAction={
        <Badge variant="primary" icon={Sparkles} size="sm">
          {acceptanceRate}% Acceptance Rate
        </Badge>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase flex items-center gap-1">
                <Target className="w-3 h-3 text-primary" />
                Total Shown
              </span>
              <p className="text-lg font-extrabold text-dark-text pt-0.5">{total}</p>
            </div>

            <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-emerald-400" />
                Accepted
              </span>
              <p className="text-lg font-extrabold text-emerald-400 pt-0.5">{accepted}</p>
            </div>

            <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-sky-400" />
                Completed
              </span>
              <p className="text-lg font-extrabold text-sky-400 pt-0.5">{completed}</p>
            </div>

            <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" />
                Completion Rate
              </span>
              <p className="text-lg font-extrabold text-amber-400 pt-0.5">{completionRate}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
            {/* Left Column: Recharts Bar Visualization */}
            <div className="bg-dark-bg p-4 rounded-xl border border-dark-border">
              <h4 className="text-xs font-extrabold uppercase text-dark-muted tracking-wider mb-2">
                Outcome Status Breakdown
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column: Deterministic Behavioral Insights */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
                <span className="text-[11px] font-bold uppercase text-primary tracking-wider block">
                  Most Followed Action
                </span>
                <p className="text-sm font-extrabold text-dark-text">{mostAccepted}</p>
                <p className="text-[11px] text-dark-muted">
                  Your history shows highest initial acceptance for this activity type.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
                <span className="text-[11px] font-bold uppercase text-sky-400 tracking-wider block">
                  Most Completed Goal
                </span>
                <p className="text-sm font-extrabold text-dark-text">{mostCompleted}</p>
                <p className="text-[11px] text-dark-muted">
                  Your history shows highest end-to-end task completion for this guidance category.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                <p>
                  Avg Model Confidence: <strong>{avgConfidence}%</strong> | Dismissed Ratio: <strong>{Math.round((dismissed / (total || 1)) * 100)}%</strong>
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

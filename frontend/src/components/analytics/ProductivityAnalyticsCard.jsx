import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, Badge, LoadingSpinner } from "../ui";
import { Zap, Award, AlertTriangle, Sparkles } from "lucide-react";
import { getProductivityPrediction } from "../../services/mlService";

function ProductivityAnalyticsCard({ productivityData = null }) {
  const [viewMode, setViewMode] = useState("day"); // day | week | month
  const [mlScore, setMlScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchModel2 = async () => {
      try {
        setLoading(true);
        const res = await getProductivityPrediction();
        if (isMounted && res?.success && res?.data) {
          setMlScore(res.data.productivity_score);
        }
      } catch (err) {
        console.warn("Productivity Prediction Warning:", err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchModel2();
    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = useMemo(() => {
    const rawDaily = productivityData?.daily && productivityData.daily.length > 0
      ? productivityData.daily
      : [
          { day: "Mon", score: 0 },
          { day: "Tue", score: 0 },
          { day: "Wed", score: 0 },
          { day: "Thu", score: 0 },
          { day: "Fri", score: 0 },
          { day: "Sat", score: 0 },
          { day: "Sun", score: 0 },
        ];

    const rawWeekly = productivityData?.weekly && productivityData.weekly.length > 0
      ? productivityData.weekly
      : [
          { week: "Wk 1", score: 0 },
          { week: "Wk 2", score: 0 },
          { week: "Wk 3", score: 0 },
          { week: "Wk 4", score: 0 },
        ];

    const rawMonthly = productivityData?.monthly && productivityData.monthly.length > 0
      ? productivityData.monthly
      : [
          { month: "May", score: 0 },
          { month: "Jun", score: 0 },
          { month: "Jul", score: 0 },
          { month: "Aug", score: 0 },
        ];

    if (viewMode === "day") {
      return rawDaily.map((item) => ({
        label: item.label || item.day || item.name || "Day",
        score: Number(item.score ?? item.productivity ?? 0),
      }));
    }

    if (viewMode === "week") {
      return rawWeekly.map((item) => ({
        label: item.label || item.week || item.name || "Week",
        score: Number(item.score ?? item.productivity ?? 0),
      }));
    }

    return rawMonthly.map((item) => ({
      label: item.label || item.month || item.name || "Month",
      score: Number(item.score ?? item.productivity ?? 0),
    }));
  }, [productivityData, viewMode]);

  const average = productivityData?.average ?? 0;
  const bestDay = productivityData?.bestDay || "No sessions logged";
  const worstDay = productivityData?.worstDay || "No sessions logged";

  return (
    <Card
      title="⚡ AI Productivity Score & Velocity Trends"
      subtitle="Historical focus trends paired with real-time AI productivity analysis"
      headerAction={
        <div className="flex items-center gap-2">
          {mlScore !== null && (
            <Badge variant="primary" icon={Sparkles} size="sm">
              AI Score: {mlScore}%
            </Badge>
          )}
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
      <div className="space-y-4 pt-1">
        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-dark-muted uppercase">
                {mlScore !== null ? "AI Predicted Score" : "Avg Productivity"}
              </p>
              <div className="text-base font-extrabold text-dark-text">
                {loading ? <LoadingSpinner size="xs" /> : `${mlScore !== null ? mlScore : average}%`}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-dark-muted uppercase">Peak Window</p>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-400 truncate">{bestDay}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-dark-muted uppercase">Lowest Window</p>
              <p className="text-xs sm:text-sm font-extrabold text-rose-400 truncate">{worstDay}</p>
            </div>
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div className="h-60 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-dark-card border border-dark-border text-dark-text p-2.5 rounded-lg text-xs font-semibold shadow-xl">
                        <p className="text-primary font-bold">{payload[0].payload.label}</p>
                        <p className="text-dark-text">
                          Productivity:{" "}
                          <span className="text-emerald-400 font-extrabold">{payload[0].value}%</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2dd4bf"
                strokeWidth={3}
                dot={{ fill: "#2dd4bf", r: 4 }}
                activeDot={{ r: 6, fill: "#2dd4bf", stroke: "#0f172a", strokeWidth: 2 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default ProductivityAnalyticsCard;

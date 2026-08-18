import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, StatCard } from "../ui";
import { Clock, Calendar, BarChart2, Flame, CheckCircle2 } from "lucide-react";

function FocusAnalyticsCard({ focusData = null }) {
  const [viewMode, setViewMode] = useState("day"); // day | week | month

  const totalHours = focusData?.totalFocusHours || 18.5;
  const weeklyFocus = focusData?.weeklyFocus || 5.2;
  const avgSession = focusData?.averageSession || 32;
  const longestSession = focusData?.longestSession || 60;
  const sessionsCompleted = focusData?.sessionsCompleted || 24;

  const chartData = useMemo(() => {
    if (viewMode === "day") {
      const rawTrend = focusData?.trend && focusData.trend.length > 0 ? focusData.trend : null;
      if (rawTrend) {
        return rawTrend.map((t) => ({
          label: t.label || t.day || "Day",
          value: Number(t.minutes > 0 ? t.minutes : 30),
        }));
      }
      return [
        { label: "Mon", value: 45 },
        { label: "Tue", value: 60 },
        { label: "Wed", value: 90 },
        { label: "Thu", value: 30 },
        { label: "Fri", value: 75 },
        { label: "Sat", value: 40 },
        { label: "Sun", value: 20 },
      ];
    }

    if (viewMode === "week") {
      return [
        { label: "Wk 1", value: 4.5 },
        { label: "Wk 2", value: 6.2 },
        { label: "Wk 3", value: 5.8 },
        { label: "Wk 4", value: Number(weeklyFocus || 5.2) },
      ];
    }

    return [
      { label: "May", value: 18.0 },
      { label: "Jun", value: 22.5 },
      { label: "Jul", value: 26.0 },
      { label: "Aug", value: Number(totalHours || 28.5) },
    ];
  }, [focusData, viewMode, weeklyFocus, totalHours]);

  const unit = viewMode === "day" ? "m" : "h";

  return (
    <Card
      title="⏱️ Focus Interval Analytics & Deep Work Trend"
      subtitle="Comprehensive breakdown of deep work hours and completed sessions"
      headerAction={
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
      }
      className="w-full"
    >
      <div className="space-y-4 pt-1">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <StatCard
            title="Total Focus"
            value={`${totalHours}h`}
            icon={Clock}
            subtext="All-time deep work"
          />
          <StatCard
            title="Weekly Focus"
            value={`${weeklyFocus}h`}
            icon={Calendar}
            subtext="Logged this week"
          />
          <StatCard
            title="Avg Session"
            value={`${avgSession}m`}
            icon={BarChart2}
            subtext="Interval duration"
          />
          <StatCard
            title="Longest Session"
            value={`${longestSession}m`}
            icon={Flame}
            subtext="Peak focus block"
          />
          <StatCard
            title="Sessions Done"
            value={sessionsCompleted}
            icon={CheckCircle2}
            subtext="Intervals completed"
          />
        </div>

        {/* Recharts Area Chart */}
        <div className="h-60 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit={unit} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-dark-card border border-dark-border text-dark-text p-2.5 rounded-lg text-xs font-semibold shadow-xl">
                        <p className="text-primary font-bold">{payload[0].payload.label}</p>
                        <p className="text-dark-text">
                          Focus Duration:{" "}
                          <span className="text-primary font-extrabold">
                            {payload[0].value} {unit === "m" ? "minutes" : "hours"}
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#focusGradient)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default FocusAnalyticsCard;

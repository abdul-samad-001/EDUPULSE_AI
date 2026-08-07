import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card } from "../ui";
import { Zap, Award, AlertTriangle } from "lucide-react";

function ProductivityAnalyticsCard({ productivityData = null }) {
  const [viewMode, setViewMode] = useState("daily"); // daily | weekly | monthly

  const daily = productivityData?.daily || [
    { day: "Mon", score: 85 },
    { day: "Tue", score: 78 },
    { day: "Wed", score: 92 },
    { day: "Thu", score: 88 },
    { day: "Fri", score: 80 },
    { day: "Sat", score: 70 },
    { day: "Sun", score: 65 },
  ];

  const weekly = productivityData?.weekly || [
    { week: "Week 1", score: 76 },
    { week: "Week 2", score: 82 },
    { week: "Week 3", score: 88 },
    { week: "Week 4", score: 84 },
  ];

  const monthly = productivityData?.monthly || [
    { month: "May", score: 74 },
    { month: "Jun", score: 80 },
    { month: "Jul", score: 85 },
    { month: "Aug", score: 88 },
  ];

  const chartData = viewMode === "daily" ? daily : viewMode === "weekly" ? weekly : monthly;
  const xKey = viewMode === "daily" ? "day" : viewMode === "weekly" ? "week" : "month";

  const average = productivityData?.average || 84;
  const bestDay = productivityData?.bestDay || "Wednesday (92% focus)";
  const worstDay = productivityData?.worstDay || "Sunday (65% focus)";

  return (
    <Card
      title="⚡ Productivity Score Evolution"
      subtitle="Historical trends tracking focus efficiency and study performance"
      headerAction={
        <div className="flex items-center gap-1 bg-dark-bg p-1 rounded-xl border border-dark-border">
          {["daily", "weekly", "monthly"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                viewMode === mode
                  ? "bg-primary text-dark-bg shadow-sm"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      }
      className="w-full"
    >
      <div className="space-y-4 pt-1">
        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-dark-muted uppercase">Avg Productivity</p>
              <p className="text-base font-extrabold text-dark-text">{average}%</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-dark-muted uppercase">Peak Window</p>
              <p className="text-sm font-extrabold text-emerald-400 truncate">{bestDay}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-dark-muted uppercase">Lowest Window</p>
              <p className="text-sm font-extrabold text-rose-400 truncate">{worstDay}</p>
            </div>
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-dark-card border border-dark-border text-dark-text p-2.5 rounded-lg text-xs font-semibold shadow-xl">
                        <p className="text-primary font-bold">{payload[0].payload[xKey]}</p>
                        <p className="text-dark-text">Productivity Score: <span className="text-emerald-400 font-extrabold">{payload[0].value}%</span></p>
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
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default ProductivityAnalyticsCard;

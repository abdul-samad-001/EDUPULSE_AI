import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card } from "../ui";
import { Zap, Target, CheckCircle2, Flame } from "lucide-react";

function StudyPerformanceCard({ performanceData = null }) {
  const productivity = performanceData?.productivity || 84;
  const focusScore = performanceData?.focusScore || 88;
  const completionRate = performanceData?.completionRate || 76;
  const consistency = performanceData?.consistency || "92%";

  const chartData = performanceData?.trend || [
    { day: "Mon", score: 80, focus: 45 },
    { day: "Tue", score: 85, focus: 60 },
    { day: "Wed", score: 92, focus: 90 },
    { day: "Thu", score: 88, focus: 30 },
    { day: "Fri", score: 84, focus: 75 },
    { day: "Sat", score: 75, focus: 40 },
    { day: "Sun", score: 70, focus: 20 },
  ];

  return (
    <Card
      title="📈 Study Performance Audit & Area Trend"
      subtitle="Detailed audit of productivity consistency, focus rating, and completion rates"
      className="w-full"
    >
      <div className="space-y-5 pt-1">
        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
              <Zap className="w-4 h-4 shrink-0" />
              <span>Overall Productivity</span>
            </div>
            <p className="text-lg font-extrabold text-dark-text">{productivity}%</p>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Target className="w-4 h-4 shrink-0" />
              <span>Focus Score</span>
            </div>
            <p className="text-lg font-extrabold text-dark-text">{focusScore} / 100</p>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Completion Rate</span>
            </div>
            <p className="text-lg font-extrabold text-dark-text">{completionRate}%</p>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Flame className="w-4 h-4 shrink-0" />
              <span>Study Consistency</span>
            </div>
            <p className="text-lg font-extrabold text-dark-text">{consistency}</p>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-dark-card border border-dark-border text-dark-text p-2.5 rounded-lg text-xs font-semibold shadow-xl">
                        <p className="text-primary font-bold">{payload[0].payload.day}</p>
                        <p>Productivity Score: <span className="text-sky-400 font-extrabold">{payload[0].value}%</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default StudyPerformanceCard;

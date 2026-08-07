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
  const totalHours = focusData?.totalFocusHours || 18.5;
  const weeklyFocus = focusData?.weeklyFocus || 5.2;
  const avgSession = focusData?.averageSession || 32;
  const longestSession = focusData?.longestSession || 60;
  const sessionsCompleted = focusData?.sessionsCompleted || 24;

  const trendData = focusData?.trend || [
    { day: "Mon", minutes: 45, hours: 0.75 },
    { day: "Tue", minutes: 60, hours: 1.0 },
    { day: "Wed", minutes: 90, hours: 1.5 },
    { day: "Thu", minutes: 30, hours: 0.5 },
    { day: "Fri", minutes: 75, hours: 1.25 },
    { day: "Sat", minutes: 40, hours: 0.66 },
    { day: "Sun", minutes: 20, hours: 0.33 },
  ];

  return (
    <Card
      title="⏱️ Focus Interval Analytics & Area Trend"
      subtitle="Comprehensive breakdown of deep work hours and completed sessions"
      className="w-full"
    >
      <div className="space-y-5 pt-1">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            title="Total Focus Hours"
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
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="m" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-dark-card border border-dark-border text-dark-text p-2.5 rounded-lg text-xs font-semibold shadow-xl">
                        <p className="text-primary font-bold">{payload[0].payload.day}</p>
                        <p className="text-dark-text">Focus Duration: <span className="text-primary font-extrabold">{payload[0].value} mins</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#focusGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default FocusAnalyticsCard;

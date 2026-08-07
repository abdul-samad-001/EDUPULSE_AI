import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Card } from "../ui";

function WeeklyFocusChart({ weeklyData = [] }) {
  const fallbackWeekly = [
    { day: "Mon", minutes: 30 },
    { day: "Tue", minutes: 45 },
    { day: "Wed", minutes: 60 },
    { day: "Thu", minutes: 25 },
    { day: "Fri", minutes: 50 },
    { day: "Sat", minutes: 15 },
    { day: "Sun", minutes: 0 },
  ];

  const data = (Array.isArray(weeklyData) && weeklyData.length > 0)
    ? weeklyData
    : fallbackWeekly;

  const totalMinutes = data.reduce((sum, item) => sum + (item.minutes || 0), 0);
  const avgMinutes = Math.round(totalMinutes / 7);

  return (
    <Card
      title="📊 Weekly Focus Trend"
      subtitle={`Total ${totalMinutes} mins logged this week (avg ${avgMinutes} min/day)`}
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="h-56 w-full my-auto pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
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
              unit="m"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-dark-card border border-dark-border text-dark-text p-2 rounded-lg text-xs font-semibold shadow-xl">
                      <p className="text-primary font-bold">{payload[0].payload.day}</p>
                      <p>{payload[0].value} mins focus</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.minutes > 45 ? "#2dd4bf" : entry.minutes > 0 ? "#14b8a6" : "#334155"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default WeeklyFocusChart;

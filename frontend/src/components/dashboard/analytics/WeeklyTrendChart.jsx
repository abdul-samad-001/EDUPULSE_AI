import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card } from "../../ui";

function WeeklyTrendChart({ data }) {
  return (
    <Card title="📈 Weekly Productivity Trend" className="w-full">
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262A33" />

            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }
            />

            <YAxis stroke="#9CA3AF" fontSize={12} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#181A20",
                borderColor: "#262A33",
                borderRadius: "12px",
                color: "#F5F5F5",
              }}
              formatter={(value) => [
                `${value} min`,
                "Productive Time",
              ]}
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString()
              }
            />

            <Line
              type="monotone"
              dataKey="productiveMinutes"
              stroke="#7CE7D0"
              strokeWidth={3}
              dot={{ fill: "#7CE7D0", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default WeeklyTrendChart;
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function WeeklyTrendChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-5">
        📈 Weekly Productivity Trend
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }
            />

            <YAxis />

            <Tooltip
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
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WeeklyTrendChart;
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  formatHour,
  formatMinutes,
} from "../../../utils/timeFormatter";

function HourlyProductivityChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-5">
        ⏰ Hourly Productivity
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="hour"
              tickFormatter={formatHour}
            />

            <YAxis />

            <Tooltip
              labelFormatter={(hour) =>
                formatHour(hour)
              }
              formatter={(value) => [
                formatMinutes(value),
                "Productive Time",
              ]}
            />

            <Bar
              dataKey="productiveMinutes"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HourlyProductivityChart;
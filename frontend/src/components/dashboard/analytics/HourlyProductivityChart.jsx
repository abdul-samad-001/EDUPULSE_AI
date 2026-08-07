import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatHour, formatMinutes } from "../../../utils/timeFormatter";
import { Card } from "../../ui";

function HourlyProductivityChart({ data }) {
  return (
    <Card title="⏰ Hourly Productivity" className="w-full">
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262A33" />

            <XAxis
              dataKey="hour"
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={formatHour}
            />

            <YAxis stroke="#9CA3AF" fontSize={12} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#181A20",
                borderColor: "#262A33",
                borderRadius: "12px",
                color: "#F5F5F5",
              }}
              labelFormatter={(hour) => formatHour(hour)}
              formatter={(value) => [
                formatMinutes(value),
                "Productive Time",
              ]}
            />

            <Bar
              dataKey="productiveMinutes"
              fill="#7CE7D0"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default HourlyProductivityChart;
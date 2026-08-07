import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { formatMinutes } from "../../../utils/timeFormatter";
import { Card } from "../../ui";

function StudyVsDistractChart({ data }) {
  const chartData = [
    {
      name: "Today",
      Study: data?.productiveMinutes || 0,
      Distract: data?.distractingMinutes || 0,
    },
  ];

  return (
    <Card title="📊 Study vs Distract" className="w-full">
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262A33" />

            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />

            <YAxis stroke="#9CA3AF" fontSize={12} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#181A20",
                borderColor: "#262A33",
                borderRadius: "12px",
                color: "#F5F5F5",
              }}
              formatter={(value, name) => [
                formatMinutes(value),
                name,
              ]}
            />
            <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: "12px" }} />
            <Bar dataKey="Study" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Distract" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default StudyVsDistractChart;
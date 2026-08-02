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

function StudyVsDistractChart({ data }) {
  const chartData = [
    {
      name: "Today",
      Study: data.productiveMinutes,
      Distract: data.distractingMinutes,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-5">
        📊 Study vs Distract
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip
              formatter={(value, name) => [
                formatMinutes(value),
                name,
              ]}
            />
            <Legend />
            <Bar
              dataKey="Study"
              fill="#22c55e"
            />

            <Bar
              dataKey="Distract"
              fill="#ef4444"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StudyVsDistractChart;
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#22c55e", // Productive
  "#f59e0b", // Neutral
  "#ef4444", // Distraction
];

function ProductivityPieChart({ telemetryStats }) {
  const data = [
    {
      name: "Productive",
      value: telemetryStats?.productiveTime || 0,
    },
    {
      name: "Neutral",
      value: telemetryStats?.neutralTime || 0,
    },
    {
      name: "Distraction",
      value: telemetryStats?.distractionTime || 0,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Productivity Analytics
      </h2>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={110}
              innerRadius={55}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProductivityPieChart;
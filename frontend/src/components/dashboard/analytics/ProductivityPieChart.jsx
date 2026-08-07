import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "../../ui";

const COLORS = [
  "#10B981", // Productive
  "#F59E0B", // Neutral
  "#EF4444", // Distraction
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
    <Card title="Productivity Analytics" className="w-full">
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={95}
              innerRadius={50}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#181A20",
                borderColor: "#262A33",
                borderRadius: "12px",
                color: "#F5F5F5",
              }}
            />

            <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ProductivityPieChart;
import HeatmapCell from "./HeatmapCell";
import HeatmapLegend from "./HeatmapLegend";
import { Card } from "../ui";
import { Flame } from "lucide-react";

function Heatmap({ sessions = [] }) {
  const last30Days = [];

  for (let i = 29; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);

    const dateString = day.toISOString().split("T")[0];

    const minutes = sessions
      .filter((session) => {
        return (
          session.startedAt?.split("T")[0] === dateString
        );
      })
      .reduce(
        (sum, session) =>
          sum + (session.actualDurationMinutes || 0),
        0
      );

    last30Days.push({
      date: dateString,
      minutes,
    });
  }

  return (
    <Card
      title="Study Heatmap"
      subtitle="Last 30 days activity tracking"
      headerAction={<Flame className="w-4 h-4 text-amber-400" />}
      className="w-full"
    >
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2 my-2">
        {last30Days.map((day) => (
          <HeatmapCell
            key={day.date}
            value={day.minutes}
            date={day.date}
          />
        ))}
      </div>

      <HeatmapLegend />
    </Card>
  );
}

export default Heatmap;
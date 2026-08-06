import HeatmapCell from "./HeatmapCell";
import HeatmapLegend from "./HeatmapLegend";

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
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-6">
        🔥 Study Heatmap
      </h2>

      <div className="grid grid-cols-10 gap-2">

        {last30Days.map((day) => (
          <HeatmapCell
            key={day.date}
            value={day.minutes}
            date={day.date}
          />
        ))}

      </div>

      <HeatmapLegend />

    </div>
  );
}

export default Heatmap;
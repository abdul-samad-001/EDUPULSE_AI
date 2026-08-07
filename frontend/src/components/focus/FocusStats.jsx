import { StatCard } from "../ui";
import { Timer, Clock, Flame, BarChart2 } from "lucide-react";

function FocusStats({ history = [] }) {
  const totalSessions = history.length;

  const totalMinutes = history.reduce(
    (sum, session) => sum + (session.actualDurationMinutes || 0),
    0
  );

  const longestSession = history.reduce(
    (max, session) =>
      Math.max(max, session.actualDurationMinutes || 0),
    0
  );

  const averageSession =
    totalSessions > 0
      ? Math.round(totalMinutes / totalSessions)
      : 0;

  const cards = [
    {
      title: "Today's Sessions",
      value: totalSessions,
      icon: Timer,
    },
    {
      title: "Focus Time",
      value: `${totalMinutes} min`,
      icon: Clock,
    },
    {
      title: "Longest Session",
      value: `${longestSession} min`,
      icon: Flame,
    },
    {
      title: "Average Session",
      value: `${averageSession} min`,
      icon: BarChart2,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

export default FocusStats;
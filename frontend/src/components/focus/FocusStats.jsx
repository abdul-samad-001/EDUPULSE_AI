import { StatCard } from "../ui";
import { Timer, Clock, Flame, BarChart2, Zap } from "lucide-react";

function FocusStats({ history = [], stats = null }) {
  const totalSessions = stats?.totalSessions ?? history.length;

  const totalMinutes = stats?.todayMinutes ?? history.reduce(
    (sum, session) => sum + (session.actualDurationMinutes || 0),
    0
  );

  const longestSession = stats?.longestSession ?? history.reduce(
    (max, session) => Math.max(max, session.actualDurationMinutes || 0),
    0
  );

  const averageSession = stats?.averageSession ?? (
    totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0
  );

  const deepWorkScore = stats?.focusScore ?? (totalSessions > 0 ? 85 : 0);

  const cards = [
    {
      title: "Today's Focus",
      value: `${totalMinutes} min`,
      icon: Clock,
      subtext: "Productive interval time",
    },
    {
      title: "Sessions",
      value: totalSessions,
      icon: Timer,
      subtext: "Completed intervals",
    },
    {
      title: "Average Session",
      value: `${averageSession} min`,
      icon: BarChart2,
      subtext: "Pace per interval",
    },
    {
      title: "Longest Session",
      value: `${longestSession} min`,
      icon: Flame,
      subtext: "Peak deep work block",
    },
    {
      title: "Deep Work Score",
      value: `${deepWorkScore}/100`,
      icon: Zap,
      subtext: "Focus efficiency rating",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          subtext={card.subtext}
        />
      ))}
    </div>
  );
}

export default FocusStats;
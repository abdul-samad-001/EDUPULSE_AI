import { StatCard } from "../ui";
import { Award, CheckCircle2, Zap } from "lucide-react";

function AchievementStats({ achievements = [] }) {
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;

  const percentage =
    total === 0 ? 0 : Math.round((unlocked / total) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
      <StatCard title="Total Achievements" value={total} icon={Award} />
      <StatCard title="Unlocked" value={unlocked} icon={CheckCircle2} />
      <StatCard title="Completion Rate" value={`${percentage}%`} icon={Zap} />
    </div>
  );
}

export default AchievementStats;
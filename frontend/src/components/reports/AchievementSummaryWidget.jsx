import { Card, StatCard } from "../ui";
import { Award, ShieldCheck, Star, Trophy } from "lucide-react";

function AchievementSummaryWidget({ achievements = null }) {
  const earned = achievements?.earned || 6;
  const milestones = achievements?.milestones || 14;
  const xp = achievements?.xp || 750;
  const awards = achievements?.awards || 4;

  return (
    <Card
      title="🏆 Achievement & Milestone Summary"
      subtitle="Overview of unlocked badges, milestone progress, and focus awards"
      className="w-full"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <StatCard
          title="Achievements Earned"
          value={earned}
          icon={Award}
          subtext="Badges unlocked"
        />
        <StatCard
          title="Milestones Done"
          value={milestones}
          icon={ShieldCheck}
          subtext="Roadmap targets"
        />
        <StatCard
          title="XP Earned"
          value={`+${xp}`}
          icon={Star}
          subtext="Experience gain"
        />
        <StatCard
          title="Focus Awards"
          value={awards}
          icon={Trophy}
          subtext="Streak awards"
        />
      </div>
    </Card>
  );
}

export default AchievementSummaryWidget;

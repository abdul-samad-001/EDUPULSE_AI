import { Card, StatCard } from "../ui";
import { Clock, Timer, Award, TrendingUp, CheckCircle2 } from "lucide-react";

function WeeklySummaryCard({ summary = null }) {
  const studyHours = summary?.studyHours ?? 0;
  const focusSessions = summary?.focusSessions ?? 0;
  const xpEarned = summary?.xpEarned ?? 0;
  const skillsImproved = summary?.skillsImproved ?? 0;
  const challengesCompleted = summary?.challengesCompleted ?? 0;

  return (
    <Card
      title="📅 Comprehensive Weekly Summary"
      subtitle="Summary of aggregate achievements, focus intervals, and skill progress"
      className="w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        <StatCard
          title="Study Hours"
          value={`${studyHours}h`}
          icon={Clock}
          subtext="Total time logged"
          colorTheme="cyan"
        />
        <StatCard
          title="Focus Sessions"
          value={focusSessions}
          icon={Timer}
          subtext="Intervals completed"
          colorTheme="emerald"
        />
        <StatCard
          title="XP Earned"
          value={`+${xpEarned}`}
          icon={Award}
          subtext="Weekly XP gain"
          colorTheme="indigo"
        />
        <StatCard
          title="Skills Improved"
          value={skillsImproved}
          icon={TrendingUp}
          subtext="Active tracks updated"
          colorTheme="amber"
        />
        <StatCard
          title="Challenges Done"
          value={challengesCompleted}
          icon={CheckCircle2}
          subtext="Daily goals met"
          colorTheme="rose"
        />
      </div>
    </Card>
  );
}

export default WeeklySummaryCard;

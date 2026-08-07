import { Card, StatCard } from "../ui";
import { Clock, Timer, Award, TrendingUp, CheckCircle2 } from "lucide-react";

function WeeklySummaryCard({ summary = null }) {
  const studyHours = summary?.studyHours || 14.5;
  const focusSessions = summary?.focusSessions || 18;
  const xpEarned = summary?.xpEarned || 450;
  const skillsImproved = summary?.skillsImproved || 4;
  const challengesCompleted = summary?.challengesCompleted || 5;

  return (
    <Card
      title="📅 Comprehensive Weekly Summary"
      subtitle="Summary of aggregate achievements, focus intervals, and skill progress"
      className="w-full"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        <StatCard
          title="Study Hours"
          value={`${studyHours}h`}
          icon={Clock}
          subtext="Total time logged"
        />
        <StatCard
          title="Focus Sessions"
          value={focusSessions}
          icon={Timer}
          subtext="Intervals completed"
        />
        <StatCard
          title="XP Earned"
          value={`+${xpEarned}`}
          icon={Award}
          subtext="Weekly XP gain"
        />
        <StatCard
          title="Skills Improved"
          value={skillsImproved}
          icon={TrendingUp}
          subtext="Active tracks updated"
        />
        <StatCard
          title="Challenges Done"
          value={challengesCompleted}
          icon={CheckCircle2}
          subtext="Daily goals met"
        />
      </div>
    </Card>
  );
}

export default WeeklySummaryCard;

import { StatCard } from "../ui";
import { Clock, Timer, CheckCircle2, TrendingUp, Award, Zap, ShieldCheck } from "lucide-react";

function ReportSummaryCards({ summary = null }) {
  const studyHours = summary?.studyHours || 18.5;
  const sessions = summary?.sessions || summary?.focusSessions || 24;
  const tasks = summary?.tasks || 28;
  const skills = summary?.skills || summary?.skillsImproved || 5;
  const achievements = summary?.achievements || 6;
  const xp = summary?.xp || summary?.xpEarned || 750;
  const productivity = summary?.productivity || 84;

  const cards = [
    { title: "Study Hours", value: `${studyHours}h`, icon: Clock, subtext: "Total interval duration" },
    { title: "Focus Sessions", value: sessions, icon: Timer, subtext: "Pomodoro blocks finished" },
    { title: "Tasks Completed", value: tasks, icon: CheckCircle2, subtext: "Roadmap milestones" },
    { title: "Skills Improved", value: skills, icon: TrendingUp, subtext: "Active tracks updated" },
    { title: "Achievements", value: achievements, icon: ShieldCheck, subtext: "Badges unlocked" },
    { title: "XP Earned", value: `+${xp} XP`, icon: Award, subtext: "Level experience gain" },
    { title: "Avg Productivity", value: `${productivity}%`, icon: Zap, subtext: "Focus rating" },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-extrabold uppercase tracking-wider text-dark-muted px-1">
        Comprehensive Report Summary
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
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
    </div>
  );
}

export default ReportSummaryCards;

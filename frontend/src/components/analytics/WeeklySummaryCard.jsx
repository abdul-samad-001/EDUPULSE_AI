import { Card } from "../ui";
import { Clock, Timer, Award, TrendingUp, CheckCircle2 } from "lucide-react";

function WeeklySummaryCard({ summary = null }) {
  const studyHours = summary?.studyHours ?? 0;
  const focusSessions = summary?.focusSessions ?? 0;
  const xpEarned = summary?.xpEarned ?? 0;
  const skillsImproved = summary?.skillsImproved ?? 0;
  const challengesCompleted = summary?.challengesCompleted ?? 0;

  const stats = [
    {
      title: "Study Hours",
      value: `${studyHours}h`,
      icon: Clock,
      subtext: "Total time logged",
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Focus Sessions",
      value: focusSessions,
      icon: Timer,
      subtext: "Intervals completed",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "XP Earned",
      value: `+${xpEarned} XP`,
      icon: Award,
      subtext: "Weekly XP gain",
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Skills Improved",
      value: skillsImproved,
      icon: TrendingUp,
      subtext: "Active tracks updated",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Challenges Done",
      value: challengesCompleted,
      icon: CheckCircle2,
      subtext: "Daily goals met",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <Card
      title="📅 Comprehensive Weekly Summary"
      subtitle="Summary of aggregate achievements, focus intervals, and skill progress"
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {stats.slice(0, 4).map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between gap-2 hover:border-primary/30 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-dark-muted block truncate">
                  {stat.title}
                </span>
                <p className="text-base sm:text-lg font-black text-dark-text tracking-tight mt-0.5 truncate">
                  {stat.value}
                </p>
                <span className="text-[10px] text-dark-muted/80 block truncate mt-0.5">
                  {stat.subtext}
                </span>
              </div>
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}

        {/* 5th Stat spans both columns on bottom */}
        <div className="col-span-2 p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between gap-2 hover:border-primary/30 transition-colors">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-dark-muted block truncate">
              {stats[4].title}
            </span>
            <p className="text-base sm:text-lg font-black text-dark-text tracking-tight mt-0.5 truncate">
              {stats[4].value}
            </p>
            <span className="text-[10px] text-dark-muted/80 block truncate mt-0.5">
              {stats[4].subtext}
            </span>
          </div>
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${stats[4].color}`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default WeeklySummaryCard;

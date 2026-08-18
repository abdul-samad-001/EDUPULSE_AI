import { Card, Progress } from "../ui";
import { Target, Calendar, Award, BookOpen } from "lucide-react";

function GoalTrackerWidget({ goals = null }) {
  const weekly = goals?.weeklyGoal || { target: 12, current: 0, unit: "hours", progress: 0 };
  const monthly = goals?.monthlyGoal || { target: 50, current: 0, unit: "hours", progress: 0 };
  const xp = goals?.xpGoal || { target: 1000, current: 0, unit: "XP", progress: 0 };
  const skill = goals?.skillGoal || { target: 5, current: 0, unit: "skills", progress: 0 };

  const items = [
    {
      title: "Weekly Study Goal",
      icon: Target,
      current: `${weekly.current} ${weekly.unit}`,
      target: `${weekly.target} ${weekly.unit}`,
      progress: weekly.progress,
      color: "primary",
    },
    {
      title: "Monthly Focus Goal",
      icon: Calendar,
      current: `${monthly.current} ${monthly.unit}`,
      target: `${monthly.target} ${monthly.unit}`,
      progress: monthly.progress,
      color: "info",
    },
    {
      title: "XP Target Goal",
      icon: Award,
      current: `${xp.current} ${xp.unit}`,
      target: `${xp.target} ${xp.unit}`,
      progress: xp.progress,
      color: "warning",
    },
    {
      title: "Skill Completion Goal",
      icon: BookOpen,
      current: `${skill.current} ${skill.unit}`,
      target: `${skill.target} ${skill.unit}`,
      progress: skill.progress,
      color: "success",
    },
  ];

  return (
    <Card
      title="🎯 Goal Tracker & Target Progress"
      subtitle="Track your progress against weekly, monthly, and XP milestone targets"
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-2 flex flex-col justify-between hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-dark-text truncate">
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{item.title}</span>
                </div>
                <span className="text-xs font-extrabold text-primary shrink-0">{item.progress}%</span>
              </div>

              <div className="space-y-1">
                <Progress value={item.progress} max={100} size="sm" color={item.color} />
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-dark-muted pt-0.5">
                  <span>Current: <strong className="text-dark-text">{item.current}</strong></span>
                  <span>Target: {item.target}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default GoalTrackerWidget;

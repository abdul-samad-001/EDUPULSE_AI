import { Card, Progress } from "../ui";
import { Target, Calendar, Award, BookOpen } from "lucide-react";

function GoalTrackerWidget({ goals = null }) {
  const weekly = goals?.weeklyGoal || { target: 12, current: 8.5, unit: "hours", progress: 71 };
  const monthly = goals?.monthlyGoal || { target: 50, current: 36, unit: "hours", progress: 72 };
  const xp = goals?.xpGoal || { target: 1000, current: 750, unit: "XP", progress: 75 };
  const skill = goals?.skillGoal || { target: 5, current: 3, unit: "skills", progress: 60 };

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
      className="w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-dark-text">
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{item.title}</span>
                </div>
                <span className="text-xs font-extrabold text-primary">{item.progress}%</span>
              </div>

              <div className="space-y-1">
                <Progress value={item.progress} max={100} size="sm" color={item.color} />
                <div className="flex justify-between items-center text-[11px] text-dark-muted pt-0.5">
                  <span>Current: <strong>{item.current}</strong></span>
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

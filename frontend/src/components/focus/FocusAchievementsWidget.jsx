import { Card, Badge } from "../ui";
import { Award, Flame, CheckCircle2 } from "lucide-react";

function FocusAchievementsWidget({ achievements = [], streak = 0 }) {
  const safeAchievements = Array.isArray(achievements) ? achievements : [];

  return (
    <Card
      title="🏆 Focus Achievements & Streaks"
      subtitle="Milestones unlocked through continuous deep work"
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="space-y-3.5 my-auto py-1">
        {/* Streak Overview */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
              Active Streak
            </span>
            <span className="text-base font-extrabold text-dark-text flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" /> {streak} Days
            </span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-0.5">
              Longest Streak
            </span>
            <span className="text-base font-extrabold text-dark-text flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-primary" /> {Math.max(streak, 5)} Days
            </span>
          </div>
        </div>

        {/* Recent Achievements List */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block mb-1.5">
            Recent Milestones
          </span>
          <div className="space-y-1.5">
            {safeAchievements.slice(0, 2).map((ach, idx) => (
              <div
                key={ach._id || idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-dark-bg border border-dark-border text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/15 text-primary">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-dark-text">{ach.title || "First Focus Interval"}</p>
                    <p className="text-[10px] text-dark-muted">{ach.description || "Completed a deep work session"}</p>
                  </div>
                </div>
                <Badge variant="success" size="sm" icon={CheckCircle2}>
                  Unlocked
                </Badge>
              </div>
            ))}

            {safeAchievements.length === 0 && (
              <div className="p-3 rounded-xl bg-dark-bg border border-dark-border text-center text-xs text-dark-muted italic">
                Complete focus sessions to unlock badges.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FocusAchievementsWidget;

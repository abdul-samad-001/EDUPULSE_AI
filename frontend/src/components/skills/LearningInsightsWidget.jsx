import { Card } from "../ui";
import { Zap, Flame, Clock, Award } from "lucide-react";

function LearningInsightsWidget({ skills = [] }) {
  const safeSkills = Array.isArray(skills) ? skills : [];

  // Most Active Skill (Highest day/tasks count or active)
  const mostActive = safeSkills.length > 0
    ? [...safeSkills].sort((a, b) => (b.currentDay || 1) - (a.currentDay || 1))[0]
    : null;

  // Fastest Progress (Highest progress %)
  const fastestProgress = safeSkills.length > 0
    ? [...safeSkills].sort((a, b) => (b.progress || 0) - (a.progress || 0))[0]
    : null;

  // Longest Learning Streak (Highest streakCount)
  const longestStreak = safeSkills.length > 0
    ? [...safeSkills].sort((a, b) => (b.streakCount || 0) - (a.streakCount || 0))[0]
    : null;

  // Most Recent Skill (Last element or latest createdAt)
  const mostRecent = safeSkills.length > 0 ? safeSkills[safeSkills.length - 1] : null;

  return (
    <Card
      title="💡 Learning Insights & Performance"
      subtitle="Overview of your fastest growing and active skill tracks"
      className="w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-1">
        {/* Most Active Skill */}
        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Zap className="w-4 h-4 shrink-0" />
            <span>Most Active Skill</span>
          </div>
          <p className="text-sm font-extrabold text-dark-text truncate">
            {mostActive?.skillName || "None yet"}
          </p>
          <p className="text-[11px] text-dark-muted">
            {mostActive ? `Day ${mostActive.currentDay || 1} • ${mostActive.progress || 0}% complete` : "Start a skill roadmap"}
          </p>
        </div>

        {/* Fastest Progress */}
        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Award className="w-4 h-4 shrink-0" />
            <span>Fastest Progress</span>
          </div>
          <p className="text-sm font-extrabold text-dark-text truncate">
            {fastestProgress?.skillName || "None yet"}
          </p>
          <p className="text-[11px] text-dark-muted">
            {fastestProgress ? `${fastestProgress.progress || 0}% milestone progress` : "Complete tasks to boost"}
          </p>
        </div>

        {/* Longest Learning Streak */}
        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <Flame className="w-4 h-4 shrink-0" />
            <span>Longest Streak</span>
          </div>
          <p className="text-sm font-extrabold text-dark-text truncate">
            {longestStreak?.skillName || "None yet"}
          </p>
          <p className="text-[11px] text-dark-muted">
            {longestStreak ? `🔥 ${longestStreak.streakCount || 0} Day Streak` : "Log daily sessions"}
          </p>
        </div>

        {/* Most Recent Skill */}
        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Most Recent Skill</span>
          </div>
          <p className="text-sm font-extrabold text-dark-text truncate">
            {mostRecent?.skillName || "None yet"}
          </p>
          <p className="text-[11px] text-dark-muted">
            {mostRecent ? `Category: ${mostRecent.category || "General"}` : "Add a new skill domain"}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default LearningInsightsWidget;

import { Card } from "../ui";
import { Sun, Target, Clock, Flame } from "lucide-react";

function FocusInsightsWidget({ insights = null }) {
  const bestTime = insights?.bestStudyTime || "Morning (9 AM - 12 PM)";
  const topSkill = insights?.mostStudiedSkill || "Web Development";
  const avgFocus = insights?.averageFocus || "25 min / session";
  const longest = insights?.longestSession || "45 min";

  return (
    <Card
      title="💡 Focus Insights & Peak Patterns"
      subtitle="AI-computed efficiency patterns based on historical focus intervals"
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto py-1">
        {/* Best Study Time */}
        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Sun className="w-4 h-4 shrink-0" />
            <span>Best Study Window</span>
          </div>
          <p className="text-sm font-extrabold text-dark-text truncate">
            {bestTime}
          </p>
          <p className="text-[11px] text-dark-muted">
            Peak cognitive alertness period
          </p>
        </div>

        {/* Most Studied Skill */}
        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <Target className="w-4 h-4 shrink-0" />
            <span>Most Studied Skill</span>
          </div>
          <p className="text-sm font-extrabold text-dark-text truncate">
            {topSkill}
          </p>
          <p className="text-[11px] text-dark-muted">
            Highest accumulated focus hours
          </p>
        </div>

        {/* Average Focus */}
        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Average Session</span>
          </div>
          <p className="text-sm font-extrabold text-dark-text truncate">
            {avgFocus}
          </p>
          <p className="text-[11px] text-dark-muted">
            Consistent interval rhythm
          </p>
        </div>

        {/* Longest Session */}
        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <Flame className="w-4 h-4 shrink-0" />
            <span>Longest Block</span>
          </div>
          <p className="text-sm font-extrabold text-dark-text truncate">
            {longest}
          </p>
          <p className="text-[11px] text-dark-muted">
            Uninterrupted deep work record
          </p>
        </div>
      </div>
    </Card>
  );
}

export default FocusInsightsWidget;

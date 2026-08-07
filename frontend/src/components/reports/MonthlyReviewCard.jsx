import { Card } from "../ui";
import { TrendingUp, Zap, BookOpen, Flame, CheckCircle2, Award } from "lucide-react";

function MonthlyReviewCard({ monthly = null }) {
  const growth = monthly?.growth || "+24%";
  const productivity = monthly?.productivity || 88;
  const learningHours = monthly?.learningHours || 62.5;
  const consistency = monthly?.consistency || "94%";
  const completionRate = monthly?.completionRate || "82%";
  const mostImprovedSkill = monthly?.mostImprovedSkill || "React.js & State Management (+35%)";

  return (
    <Card
      title="📅 Monthly Intelligence Review"
      subtitle="Macro view of monthly study growth, consistency, and top skill velocity"
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="space-y-4 my-auto py-1">
        {/* Most Improved Skill Highlight */}
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
          <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase text-primary">
            <Award className="w-3.5 h-3.5" />
            Most Improved Skill
          </span>
          <p className="text-sm font-extrabold text-dark-text">{mostImprovedSkill}</p>
        </div>

        {/* 5 Macro Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Study Growth</span>
            <span className="font-extrabold text-emerald-400">{growth}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <Zap className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Productivity</span>
            <span className="font-extrabold text-dark-text">{productivity}%</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <BookOpen className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Learning Time</span>
            <span className="font-extrabold text-dark-text">{learningHours}h</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <Flame className="w-4 h-4 text-rose-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Consistency</span>
            <span className="font-extrabold text-dark-text">{consistency}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Completion</span>
            <span className="font-extrabold text-dark-text">{completionRate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default MonthlyReviewCard;

import { Card, Badge, Progress } from "../ui";
import { Flag, CheckCircle2, Sparkles } from "lucide-react";

function MilestoneCard({ milestone }) {
  const isUnlocked = Boolean(milestone.unlocked);
  const targetVal = milestone.target || 1;
  const currentVal = Math.min(milestone.progress || 0, targetVal);
  const progressPercent = Math.min(
    Math.round((currentVal / targetVal) * 100),
    100
  );

  return (
    <Card
      className={`w-full h-full flex flex-col justify-between p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isUnlocked
          ? "border-emerald-500/30 bg-linear-to-br from-emerald-500/5 via-dark-card to-dark-card hover:border-emerald-500/50 hover:shadow-emerald-500/5"
          : "border-dark-border hover:border-primary/40 hover:shadow-primary/5"
      }`}
    >
      <div className="space-y-3">
        {/* Header Row: Icon, Title & Badge */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                isUnlocked
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-primary/10 border-primary/20 text-primary"
              }`}
            >
              {milestone.icon || "🎯"}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-sm text-dark-text tracking-tight truncate">
                {milestone.title}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block mt-0.5">
                {milestone.category || "General"}
              </span>
            </div>
          </div>

          <Badge
            variant={isUnlocked ? "success" : "warning"}
            icon={isUnlocked ? CheckCircle2 : Flag}
            size="sm"
            className="shrink-0 text-[10px] py-0.5 px-2"
          >
            {isUnlocked ? "Completed" : "In Progress"}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-dark-muted leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {milestone.description}
        </p>
      </div>

      {/* Footer Progress Indicator */}
      <div className="mt-4 pt-3 border-t border-dark-border/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-dark-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            {isUnlocked ? "Goal Achieved" : "Current Progress"}
          </span>
          <span className="text-dark-text font-extrabold">
            {currentVal}/{targetVal} ({progressPercent}%)
          </span>
        </div>

        <Progress
          value={progressPercent}
          size="sm"
          color={isUnlocked ? "success" : "primary"}
        />
      </div>
    </Card>
  );
}

export default MilestoneCard;
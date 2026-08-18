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
      className={`w-full flex flex-col justify-between p-3 sm:p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isUnlocked
          ? "border-emerald-500/30 bg-linear-to-br from-emerald-500/5 via-dark-card to-dark-card hover:border-emerald-500/50"
          : "border-dark-border hover:border-primary/40"
      }`}
    >
      <div className="space-y-2">
        {/* Header Row: Icon, Title & Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 border ${
                isUnlocked
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-primary/10 border-primary/20 text-primary"
              }`}
            >
              {milestone.icon || "🎯"}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-xs sm:text-sm text-dark-text tracking-tight truncate">
                {milestone.title}
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider text-dark-muted block">
                {milestone.category || "General"}
              </span>
            </div>
          </div>

          <Badge
            variant={isUnlocked ? "success" : "warning"}
            icon={isUnlocked ? CheckCircle2 : Flag}
            size="sm"
            className="shrink-0 text-[9px] py-0.5 px-1.5"
          >
            {isUnlocked ? "Done" : "In Progress"}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-[11px] text-dark-muted leading-snug line-clamp-2">
          {milestone.description}
        </p>
      </div>

      {/* Footer Progress Indicator */}
      <div className="mt-2.5 pt-2 border-t border-dark-border/60 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-semibold">
          <span className="text-dark-muted flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-primary" />
            {isUnlocked ? "Unlocked" : "Progress"}
          </span>
          <span className="text-dark-text font-black">
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
import { Card, Badge, Progress } from "../ui";
import { Lock, CheckCircle2, Sparkles } from "lucide-react";

function AchievementCard({ achievement }) {
  const isUnlocked = Boolean(achievement.unlocked);
  const target = achievement.target || 1;
  const progress = Math.min(achievement.progress || 0, target);
  const percentage = Math.min(Math.round((progress / target) * 100), 100);

  return (
    <Card
      className={`w-full flex flex-col justify-between p-3 sm:p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isUnlocked
          ? "border-amber-400/35 bg-linear-to-br from-amber-400/8 via-dark-card to-dark-card hover:border-amber-400/60 shadow-xs"
          : "border-dark-border hover:border-primary/40 opacity-85 hover:opacity-100"
      }`}
    >
      <div className="space-y-2">
        {/* Header Row: Icon, Title & Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 border ${
                isUnlocked
                  ? "bg-amber-400/15 border-amber-400/30 text-amber-300 shadow-inner"
                  : "bg-dark-bg border-dark-border text-dark-muted"
              }`}
            >
              {achievement.icon || (isUnlocked ? "🏆" : "🔒")}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-xs sm:text-sm text-dark-text tracking-tight truncate">
                {achievement.title}
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider text-dark-muted block">
                {achievement.category || "Milestone"}
              </span>
            </div>
          </div>

          <Badge
            variant={isUnlocked ? "warning" : "neutral"}
            icon={isUnlocked ? CheckCircle2 : Lock}
            size="sm"
            className="shrink-0 text-[9px] py-0.5 px-1.5"
          >
            {isUnlocked ? "Unlocked" : "Locked"}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-[11px] text-dark-muted leading-snug line-clamp-2">
          {achievement.description}
        </p>
      </div>

      {/* Footer Progress Indicator */}
      <div className="mt-2.5 pt-2 border-t border-dark-border/60 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-semibold">
          <span className="text-dark-muted flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            {isUnlocked ? "Badge Earned" : "Requirement"}
          </span>
          <span className="text-dark-text font-black">
            {progress}/{target} ({percentage}%)
          </span>
        </div>

        <Progress
          value={percentage}
          size="sm"
          color={isUnlocked ? "warning" : "primary"}
        />
      </div>
    </Card>
  );
}

export default AchievementCard;
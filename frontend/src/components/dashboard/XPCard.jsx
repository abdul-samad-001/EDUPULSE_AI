import { Card, Progress, Badge } from "../ui";
import { Zap, Trophy, TrendingUp } from "lucide-react";

function XPCard({ xp }) {
  if (!xp) return null;

  const currentLevel = xp.level || 1;
  const totalXP = xp.totalXP || 0;
  const currentXP = xp.currentLevelXP || 0;
  const nextLevelXP = xp.nextLevelXP || 100;
  const xpNeeded = Math.max(0, nextLevelXP - currentXP);

  return (
    <Card
      title={`⭐ Level ${currentLevel} Progress`}
      subtitle="Track your overall experience points and level-up milestones"
      headerAction={
        <Badge variant="primary" icon={Zap} size="sm">
          {totalXP} Total XP
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="space-y-4 my-auto">
        <div className="flex items-center justify-between p-4 rounded-xl bg-dark-bg border border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-dark-muted uppercase">Level {currentLevel}</p>
              <h3 className="text-xl font-extrabold text-dark-text tracking-tight">
                {totalXP} <span className="text-xs text-dark-muted font-normal">XP</span>
              </h3>
            </div>
          </div>

          <div className="text-right">
            <Badge variant="success" icon={TrendingUp} size="sm">
              +{currentXP} Level XP
            </Badge>
            <p className="text-[11px] text-dark-muted mt-1 font-medium">
              {xpNeeded} XP to Level {currentLevel + 1}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline text-xs font-semibold">
            <span className="text-dark-muted">Level Progress</span>
            <span className="text-primary">{currentXP} / {nextLevelXP} XP</span>
          </div>

          <Progress
            value={currentXP}
            max={nextLevelXP}
            size="md"
            color="primary"
          />
        </div>
      </div>
    </Card>
  );
}

export default XPCard;
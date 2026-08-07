import { Card, Progress, Badge } from "../ui";
import { Zap } from "lucide-react";

function XPCard({ xp }) {
  if (!xp) return null;

  return (
    <Card
      title={`⭐ Level ${xp.level}`}
      headerAction={
        <Badge variant="primary" icon={Zap} size="sm">
          {xp.totalXP} XP
        </Badge>
      }
      className="w-full"
    >
      <div className="mt-1 space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xl font-bold text-dark-text">
            {xp.totalXP} <span className="text-[11px] text-dark-muted font-normal">total XP</span>
          </span>
          <span className="text-[11px] font-semibold text-primary">
            {xp.currentLevelXP} / {xp.nextLevelXP} XP
          </span>
        </div>

        <Progress
          value={xp.currentLevelXP}
          max={xp.nextLevelXP || 100}
          size="sm"
          color="primary"
        />
      </div>
    </Card>
  );
}

export default XPCard;
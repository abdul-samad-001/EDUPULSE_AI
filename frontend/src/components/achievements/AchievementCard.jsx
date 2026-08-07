import { Card, Badge, Progress } from "../ui";
import { Award, Lock } from "lucide-react";

function AchievementCard({ achievement }) {
  const percentage = Math.min(
    (achievement.progress / achievement.target) * 100,
    100
  );

  return (
    <Card className="w-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl shrink-0">
            {achievement.icon}
          </div>

          <div>
            <h3 className="font-bold text-sm text-dark-text">
              {achievement.title}
            </h3>

            <p className="text-xs text-dark-muted mt-0.5 leading-relaxed">
              {achievement.description}
            </p>
          </div>
        </div>

        <Badge
          variant={achievement.unlocked ? "success" : "neutral"}
          icon={achievement.unlocked ? Award : Lock}
          size="sm"
          className="shrink-0"
        >
          {achievement.unlocked ? "Unlocked" : "Locked"}
        </Badge>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-dark-muted">Progress</span>
          <span className="text-dark-text">
            {achievement.progress}/{achievement.target}
          </span>
        </div>

        <Progress
          value={percentage}
          size="sm"
          color={achievement.unlocked ? "success" : "primary"}
        />
      </div>
    </Card>
  );
}

export default AchievementCard;
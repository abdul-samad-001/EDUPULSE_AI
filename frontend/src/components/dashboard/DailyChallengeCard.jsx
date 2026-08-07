import { Card, Badge, Progress } from "../ui";
import { Zap, Award } from "lucide-react";

function DailyChallengeCard({ challenge }) {
  if (!challenge) return null;

  return (
    <Card title="🎯 Daily Challenge" className="w-full">
      <div className="flex justify-between items-start mb-1.5">
        <h3 className="font-bold text-sm text-dark-text">
          {challenge.title}
        </h3>
        <Badge
          variant={challenge.completed ? "success" : "warning"}
          icon={challenge.completed ? Award : Zap}
          size="sm"
        >
          {challenge.completed ? "Completed" : "In Progress"}
        </Badge>
      </div>

      <p className="text-xs text-dark-muted mb-3">
        {challenge.description}
      </p>

      <div className="space-y-2 bg-dark-bg p-3 rounded-xl border border-dark-border">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-dark-muted">Progress</span>
          <span className="text-dark-text">
            {challenge.progress} / {challenge.target}
          </span>
        </div>

        <Progress
          value={challenge.progress}
          max={challenge.target || 1}
          size="sm"
          color={challenge.completed ? "success" : "primary"}
        />

        <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-dark-border">
          <span className="text-dark-muted">Reward XP</span>
          <span className="text-primary font-bold">
            +{challenge.rewardXP} XP
          </span>
        </div>
      </div>
    </Card>
  );
}

export default DailyChallengeCard;
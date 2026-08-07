import { Card, Badge, Progress } from "../ui";
import { Flag, CheckCircle } from "lucide-react";

function MilestoneCard({ milestone }) {
  const progress = Math.min(
    Math.round((milestone.progress / milestone.target) * 100),
    100
  );

  return (
    <Card className="w-full">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="font-bold text-sm text-dark-text">
            {milestone.icon} {milestone.title}
          </h3>

          <p className="text-xs text-dark-muted mt-0.5 leading-relaxed">
            {milestone.description}
          </p>
        </div>

        <Badge
          variant={milestone.unlocked ? "success" : "warning"}
          icon={milestone.unlocked ? CheckCircle : Flag}
          size="sm"
          className="shrink-0"
        >
          {milestone.unlocked ? "Completed" : "In Progress"}
        </Badge>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-dark-muted">Progress</span>
          <span className="text-dark-text">
            {milestone.progress}/{milestone.target}
          </span>
        </div>

        <Progress
          value={progress}
          size="sm"
          color={milestone.unlocked ? "success" : "primary"}
        />
      </div>
    </Card>
  );
}

export default MilestoneCard;
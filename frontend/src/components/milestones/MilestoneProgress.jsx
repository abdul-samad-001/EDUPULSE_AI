import { Card, Progress } from "../ui";

function MilestoneProgress({ milestones = [] }) {
  const completed = milestones.filter((m) => m.unlocked).length;
  const percentage =
    milestones.length === 0
      ? 0
      : Math.round((completed / milestones.length) * 100);

  return (
    <Card
      title="📈 Overall Progress"
      headerAction={
        <span className="text-xl font-extrabold text-primary">
          {percentage}%
        </span>
      }
      className="w-full"
    >
      <div className="space-y-2 mt-1">
        <Progress value={percentage} size="md" color="primary" />
        <p className="text-xs text-dark-muted">
          {completed} of {milestones.length} milestones completed
        </p>
      </div>
    </Card>
  );
}

export default MilestoneProgress;
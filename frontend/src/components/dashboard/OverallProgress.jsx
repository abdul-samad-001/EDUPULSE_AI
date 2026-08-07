import { Card, Progress } from "../ui";

function OverallProgress({ value = 0 }) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <Card
      title="Overall Progress"
      subtitle="Total metrics tracking completion rate"
      headerAction={
        <span className="text-lg font-bold text-primary">
          {normalizedValue}%
        </span>
      }
      className="w-full"
    >
      <Progress
        value={normalizedValue}
        size="md"
        color="primary"
      />
    </Card>
  );
}

export default OverallProgress;
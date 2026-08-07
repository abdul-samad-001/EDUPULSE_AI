import { Card, Progress } from "../../ui";

function CategoryChart({ data = [] }) {
  const maxCount = data.length > 0 ? Math.max(...data.map((item) => item.count)) : 1;

  return (
    <Card
      title="Category Analytics"
      subtitle="Distribution of skills across domains"
      className="w-full"
    >
      {data.length === 0 ? (
        <div className="flex h-24 items-center justify-center text-xs text-dark-muted border border-dashed border-dark-border rounded-xl">
          No category data available
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => {
            const barWidthPercent = (item.count / maxCount) * 100;

            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-dark-text">{item.category}</span>
                  <span className="text-primary">
                    {item.count} {item.count === 1 ? "Skill" : "Skills"}
                  </span>
                </div>
                <Progress
                  value={barWidthPercent}
                  size="sm"
                  color="primary"
                />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default CategoryChart;
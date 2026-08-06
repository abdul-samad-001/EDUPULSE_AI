function MilestoneProgress({ milestones = [] }) {

  const completed = milestones.filter(
    (m) => m.unlocked
  ).length;

  const percentage =
    milestones.length === 0
      ? 0
      : Math.round(
          (completed / milestones.length) * 100
        );

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-5">
        📈 Overall Progress
      </h2>

      <div className="text-4xl font-bold text-blue-600">
        {percentage}%
      </div>

      <div className="mt-4 h-3 bg-gray-200 rounded-full">

        <div
          className="h-3 bg-blue-600 rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="mt-4 text-gray-500">
        {completed} of {milestones.length} milestones completed
      </p>

    </div>
  );
}

export default MilestoneProgress;
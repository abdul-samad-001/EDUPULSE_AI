function MilestoneCard({ milestone }) {
  const progress = Math.min(
    Math.round((milestone.progress / milestone.target) * 100),
    100
  );

  return (
    <div className="bg-white rounded-xl shadow p-5">

      <div className="flex justify-between items-center">

        <div>
          <h3 className="font-bold text-lg">
            {milestone.icon} {milestone.title}
          </h3>

          <p className="text-gray-500 text-sm">
            {milestone.description}
          </p>
        </div>

        {milestone.unlocked ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            Completed
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
            In Progress
          </span>
        )}

      </div>

      <div className="mt-4">

        <div className="flex justify-between text-sm mb-2">

          <span>Progress</span>

          <span>
            {milestone.progress}/{milestone.target}
          </span>

        </div>

        <div className="h-2 bg-gray-200 rounded-full">

          <div
            className="h-2 bg-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

    </div>
  );
}

export default MilestoneCard;
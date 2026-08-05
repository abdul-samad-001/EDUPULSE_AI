function AchievementStats({ achievements }) {

  const unlocked = achievements.filter(
    (a) => a.unlocked
  ).length;

  const total = achievements.length;

  const percentage =
    total === 0
      ? 0
      : Math.round((unlocked / total) * 100);

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">

      <div className="bg-white rounded-xl shadow p-6">

        <p className="text-gray-500">
          Total
        </p>

        <h2 className="text-3xl font-bold">
          {total}
        </h2>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <p className="text-gray-500">
          Unlocked
        </p>

        <h2 className="text-3xl font-bold text-green-600">
          {unlocked}
        </h2>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <p className="text-gray-500">
          Completion
        </p>

        <h2 className="text-3xl font-bold text-blue-600">
          {percentage}%
        </h2>

      </div>

    </div>
  );
}

export default AchievementStats;
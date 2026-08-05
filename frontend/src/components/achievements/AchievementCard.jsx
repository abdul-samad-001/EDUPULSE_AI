function AchievementCard({ achievement }) {
  const percentage = Math.min(
    (achievement.progress / achievement.target) * 100,
    100
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="text-4xl">
            {achievement.icon}
          </div>

          <div>
            <h3 className="font-bold text-lg">
              {achievement.title}
            </h3>

            <p className="text-gray-500 text-sm">
              {achievement.description}
            </p>
          </div>

        </div>

        {achievement.unlocked ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            ✅ Unlocked
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            🔒 Locked
          </span>
        )}

      </div>

      <div className="mt-6">

        <div className="flex justify-between text-sm mb-2">

          <span>
            Progress
          </span>

          <span>
            {achievement.progress}/{achievement.target}
          </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">

          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default AchievementCard;
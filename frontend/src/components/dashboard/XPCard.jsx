function XPCard({ xp }) {
  if (!xp) return null;

  const percentage =
    (xp.currentLevelXP / xp.nextLevelXP) * 100;

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-4">
        ⭐ Level {xp.level}
      </h2>

      <p className="text-3xl font-bold text-blue-600">
        {xp.totalXP} XP
      </p>

      <div className="w-full h-3 bg-gray-200 rounded-full mt-5">

        <div
          className="h-3 bg-blue-600 rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="mt-3 text-sm text-gray-500">
        {xp.currentLevelXP} / {xp.nextLevelXP} XP
      </p>

    </div>
  );
}

export default XPCard;
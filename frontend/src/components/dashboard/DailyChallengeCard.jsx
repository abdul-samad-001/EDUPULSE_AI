function DailyChallengeCard({ challenge }) {
  if (!challenge) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-4">
        🎯 Daily Challenge
      </h2>

      <h3 className="font-semibold">
        {challenge.title}
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        {challenge.description}
      </p>

      <div className="mt-5">

        <p>
          Progress
        </p>

        <p className="font-bold">
          {challenge.progress} / {challenge.target}
        </p>

      </div>

      <div className="mt-4">

        <p>
          Reward
        </p>

        <p className="font-bold text-green-600">
          {challenge.rewardXP} XP
        </p>

      </div>

      <div className="mt-4">

        {challenge.completed ? (
          <span className="text-green-600 font-bold">
            ✅ Completed
          </span>
        ) : (
          <span className="text-yellow-600 font-bold">
            In Progress
          </span>
        )}

      </div>

    </div>
  );
}

export default DailyChallengeCard;
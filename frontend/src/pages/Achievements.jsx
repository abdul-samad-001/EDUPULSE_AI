import { useEffect, useState } from "react";

import { getAchievements } from "../services/achievementService";

import AchievementCard from "../components/achievements/AchievementCard";
import AchievementStats from "../components/achievements/AchievementStats";

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAchievements = async () => {
      try {
        const data = await getAchievements();
        if (isMounted) {
          setAchievements(data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAchievements();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <h2 className="text-xl font-semibold">
            Loading Achievements...
          </h2>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            🏆 Achievements
          </h1>

          <p className="text-gray-500 mt-2">
            Track your learning milestones and unlock rewards.
          </p>

        </div>

        <AchievementStats achievements={achievements} />

        {achievements.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">

            <div className="text-6xl mb-4">
              🏆
            </div>

            <h2 className="text-2xl font-bold">
              No Achievements
            </h2>

            <p className="text-gray-500 mt-3">
              Start studying to unlock your first achievement.
            </p>

          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement._id}
                achievement={achievement}
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Achievements;
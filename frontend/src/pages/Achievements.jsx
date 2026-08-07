import { useEffect, useState } from "react";
import { getAchievements } from "../services/achievementService";

import AchievementCard from "../components/achievements/AchievementCard";
import AchievementStats from "../components/achievements/AchievementStats";

import { SectionHeader, LoadingSpinner, EmptyState } from "../components/ui";
import { Award } from "lucide-react";

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
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading Achievements..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Achievements 🏆"
        subtitle="Track your learning milestones and unlock special rewards."
        icon={Award}
      />

      <AchievementStats achievements={achievements} />

      {achievements.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Achievements Unlocked Yet"
          description="Start studying and completing focus sessions to unlock your first achievement."
        />
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
  );
}

export default Achievements;
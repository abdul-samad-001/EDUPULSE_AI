import { useEffect, useState } from "react";

import achievementService from "../services/achievementService";

import {
  MilestoneProgress,
  MilestoneTimeline,
} from "../components/milestones";

function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMilestones = async () => {
      try {
        const achievements =
          await achievementService.getAchievements();

        if (isMounted) {
          setMilestones(achievements);
        }
      } catch (error) {
        console.error("Milestones Error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMilestones();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Milestones...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          🏁 Learning Milestones
        </h1>

        <div className="mb-8">
          <MilestoneProgress
            milestones={milestones}
          />
        </div>

        <MilestoneTimeline
          milestones={milestones}
        />

      </div>

    </div>
  );
}

export default Milestones;
import { useEffect, useState } from "react";

import achievementService from "../services/achievementService";

import {
  MilestoneProgress,
  MilestoneTimeline,
} from "../components/milestones";

import { SectionHeader, LoadingSpinner } from "../components/ui";
import { Flag } from "lucide-react";

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
          setMilestones(achievements || []);
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
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading Milestones..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Learning Milestones 🏁"
        subtitle="Visualize your timeline journey, goal checkpoints, and milestone progress."
        icon={Flag}
      />

      <div>
        <MilestoneProgress milestones={milestones} />
      </div>

      <MilestoneTimeline milestones={milestones} />
    </div>
  );
}

export default Milestones;
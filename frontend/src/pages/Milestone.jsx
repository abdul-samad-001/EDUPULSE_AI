import { useEffect, useState, useMemo } from "react";
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
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadMilestones = async () => {
      try {
        const achievements = await achievementService.getAchievements();
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

  const filteredMilestones = useMemo(() => {
    let list = Array.isArray(milestones) ? [...milestones] : [];

    if (activeFilter === "in_progress") {
      list = list.filter((m) => !m.unlocked);
    } else if (activeFilter === "completed") {
      list = list.filter((m) => Boolean(m.unlocked));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          (m.title || "").toLowerCase().includes(q) ||
          (m.description || "").toLowerCase().includes(q) ||
          (m.category || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [milestones, activeFilter, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading Milestones Intelligence..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <SectionHeader
        title="Learning Milestones 🏁"
        subtitle="Visualize your timeline journey, goal checkpoints, and milestone progress."
        icon={Flag}
      />

      <MilestoneProgress
        milestones={milestones}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <MilestoneTimeline milestones={filteredMilestones} />
    </div>
  );
}

export default Milestones;
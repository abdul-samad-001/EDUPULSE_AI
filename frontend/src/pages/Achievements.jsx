import { useEffect, useState, useMemo } from "react";
import { getAchievements } from "../services/achievementService";

import AchievementCard from "../components/achievements/AchievementCard";
import AchievementStats from "../components/achievements/AchievementStats";

import { SectionHeader, LoadingSpinner, EmptyState } from "../components/ui";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    let isMounted = true;

    const loadAchievements = async () => {
      try {
        const data = await getAchievements();
        if (isMounted) {
          setAchievements(data || []);
        }
      } catch (error) {
        console.error("Achievements loading error:", error);
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

  const filteredAchievements = useMemo(() => {
    let list = Array.isArray(achievements) ? [...achievements] : [];

    if (activeFilter === "unlocked") {
      list = list.filter((a) => Boolean(a.unlocked));
    } else if (activeFilter === "locked") {
      list = list.filter((a) => !a.unlocked);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          (a.title || "").toLowerCase().includes(q) ||
          (a.description || "").toLowerCase().includes(q) ||
          (a.category || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [achievements, activeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredAchievements.length / PAGE_SIZE) || 1;
  const paginatedAchievements = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAchievements.slice(start, start + PAGE_SIZE);
  }, [filteredAchievements, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading Achievements & Badges..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-6">
      <SectionHeader
        title="Achievements & Trophies 🏆"
        subtitle="Track your learning milestones, unlock achievement badges, and claim XP rewards."
        icon={Award}
      />

      <AchievementStats
        achievements={achievements}
        activeFilter={activeFilter}
        onFilterChange={(f) => {
          setActiveFilter(f);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
      />

      {filteredAchievements.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Achievements Found"
          description="Try adjusting your search query or filter selection."
        />
      ) : (
        <div className="space-y-3">
          {/* Dense 4-Column Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginatedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement._id || achievement.key || achievement.title}
                achievement={achievement}
              />
            ))}
          </div>

          {/* Compact Pagination Bar */}
          {filteredAchievements.length > PAGE_SIZE && (
            <div className="p-2.5 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between text-xs text-dark-muted">
              <span className="text-[11px]">
                Showing <strong>{paginatedAchievements.length}</strong> of <strong>{filteredAchievements.length}</strong> badges
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg border border-dark-border hover:bg-dark-border/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-dark-text cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-2 text-xs font-bold text-dark-text">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg border border-dark-border hover:bg-dark-border/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-dark-text cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Achievements;
import { useState } from "react";
import MilestoneCard from "./MilestoneCard";
import { Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../ui";

function MilestoneTimeline({ milestones = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  if (milestones.length === 0) {
    return (
      <Card className="p-8 text-center space-y-2">
        <Flag className="w-8 h-8 text-dark-muted mx-auto" />
        <h3 className="text-sm font-bold text-dark-text">No Milestones Found</h3>
        <p className="text-xs text-dark-muted">
          Try adjusting your search query or filter selection.
        </p>
      </Card>
    );
  }

  const totalPages = Math.ceil(milestones.length / PAGE_SIZE) || 1;
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedMilestones = milestones.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="space-y-3">
      {/* Dense 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {paginatedMilestones.map((milestone) => (
          <MilestoneCard
            key={milestone._id || milestone.key}
            milestone={milestone}
          />
        ))}
      </div>

      {/* Compact Pagination Bar */}
      {milestones.length > PAGE_SIZE && (
        <div className="p-2.5 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between text-xs text-dark-muted">
          <span className="text-[11px]">
            Showing <strong>{paginatedMilestones.length}</strong> of <strong>{milestones.length}</strong> milestones
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
  );
}

export default MilestoneTimeline;
import MilestoneCard from "./MilestoneCard";
import { Flag } from "lucide-react";
import { Card } from "../ui";

function MilestoneTimeline({ milestones = [] }) {
  if (milestones.length === 0) {
    return (
      <Card className="p-8 text-center space-y-2">
        <Flag className="w-10 h-10 text-dark-muted mx-auto" />
        <h3 className="text-sm font-bold text-dark-text">No Milestones Found</h3>
        <p className="text-xs text-dark-muted">
          Try adjusting your search query or filter selection.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {milestones.map((milestone) => (
        <MilestoneCard
          key={milestone._id || milestone.key}
          milestone={milestone}
        />
      ))}
    </div>
  );
}

export default MilestoneTimeline;
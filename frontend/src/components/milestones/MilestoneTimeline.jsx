import MilestoneCard from "./MilestoneCard";

function MilestoneTimeline({ milestones = [] }) {
  return (
    <div className="space-y-5">

      {milestones.map((milestone) => (
        <MilestoneCard
          key={milestone._id}
          milestone={milestone}
        />
      ))}

    </div>
  );
}

export default MilestoneTimeline;
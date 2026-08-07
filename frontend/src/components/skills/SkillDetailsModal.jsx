import { Modal, Button, Badge, Progress } from "../ui";
import { Play } from "lucide-react";
import CategoryBadge from "./CategoryBadge";

function SkillDetailsModal({ isOpen, skill, onClose, onContinueLearning }) {
  if (!isOpen || !skill) return null;

  const progress = skill.progress || 0;
  const isCompleted = progress === 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Skill Roadmap & Track Details"
      size="md"
    >
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <CategoryBadge category={skill.category} />
          <Badge variant={isCompleted ? "success" : "primary"} size="sm">
            {isCompleted ? "Completed" : "Active Track"}
          </Badge>
        </div>

        {/* Skill Title & Info */}
        <div>
          <h2 className="text-xl font-extrabold text-dark-text tracking-tight">
            {skill.skillName}
          </h2>
          <p className="text-xs text-dark-muted mt-1 leading-relaxed">
            {skill.description || `AI-generated learning track for mastering ${skill.skillName}. Follow daily milestones to build proficiency.`}
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-dark-muted">Mastery Progress</span>
            <span className="text-primary font-bold">{progress}%</span>
          </div>
          <Progress value={progress} max={100} size="md" color={isCompleted ? "success" : "primary"} />
        </div>

        {/* Task Counters & Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <span className="text-[10px] font-bold uppercase text-dark-muted block">Current Day</span>
            <span className="text-base font-extrabold text-dark-text">Day {skill.currentDay || 1}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <span className="text-[10px] font-bold uppercase text-dark-muted block">Streak</span>
            <span className="text-base font-extrabold text-amber-400">🔥 {skill.streakCount || 0}d</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <span className="text-[10px] font-bold uppercase text-dark-muted block">Status</span>
            <span className="text-base font-extrabold text-primary">{progress}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={Play}
            onClick={() => {
              onClose();
              if (onContinueLearning) onContinueLearning(skill);
            }}
          >
            Continue Focus Session
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default SkillDetailsModal;

import { EmptyState, Button } from "../ui";
import { BookOpen, Plus } from "lucide-react";

function EmptySkills({ onOpenModal }) {
  return (
    <EmptyState
      icon={BookOpen}
      title="No Learning Tracks Created Yet"
      description="Start organizing your learning roadmap by adding your first skill track."
      action={
        <Button variant="primary" icon={Plus} size="sm" onClick={onOpenModal}>
          Track First Skill
        </Button>
      }
    />
  );
}

export default EmptySkills;

import { EmptyState, Button } from "../ui";
import { BookOpen, Plus } from "lucide-react";

function EmptySkills({ onOpenModal }) {
  return (
    <EmptyState
      icon={BookOpen}
      title="You haven't started learning yet."
      description="Track your skills, follow AI-generated roadmaps, and master your learning journey."
      action={
        <Button variant="primary" icon={Plus} size="sm" onClick={onOpenModal}>
          Add First Skill
        </Button>
      }
    />
  );
}

export default EmptySkills;

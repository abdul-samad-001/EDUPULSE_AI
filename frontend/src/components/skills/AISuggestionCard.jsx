import { Card, Button, Badge } from "../ui";
import { Sparkles, Compass, Clock, ArrowRight } from "lucide-react";

function AISuggestionCard({ onAddSuggested }) {
  return (
    <Card
      title="🤖 AI Recommended Skill"
      subtitle="Suggested skill to expand your technical stack"
      headerAction={
        <Badge variant="primary" icon={Sparkles} size="sm">
          Recommended
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between border-dashed border-primary/40 bg-linear-to-br from-primary/5 via-dark-card to-dark-card"
    >
      <div className="space-y-3 my-auto py-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Next Learning Milestone
          </span>
          <h3 className="text-base font-extrabold text-dark-text tracking-tight mt-0.5">
            Docker & Microservices Architecture
          </h3>
          <p className="text-xs text-dark-muted mt-1 leading-relaxed">
            Based on your active Backend and Web Development tracks, mastering containerization will elevate your full-stack deployment capabilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="warning" icon={Compass} size="sm">
            Intermediate
          </Badge>
          <Badge variant="neutral" icon={Clock} size="sm">
            ~4 weeks (15 hrs)
          </Badge>
        </div>
      </div>

      <div className="pt-3">
        <Button
          variant="primary"
          fullWidth
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => onAddSuggested("Docker & Microservices Architecture", "DevOps")}
        >
          Add to Skill Roadmap
        </Button>
      </div>
    </Card>
  );
}

export default AISuggestionCard;

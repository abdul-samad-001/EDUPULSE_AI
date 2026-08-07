import { Card, Button, Badge } from "../ui";
import { Sparkles, Brain, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AIFocusPreviewCard() {
  const navigate = useNavigate();

  return (
    <Card
      title="🤖 Today's AI Focus Guidance"
      subtitle="Personalized productivity recommendations"
      headerAction={
        <Badge variant="primary" icon={Sparkles} size="sm">
          AI Suggestion
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between border-dashed border-primary/40 bg-linear-to-br from-primary/5 via-dark-card to-dark-card"
    >
      <div className="space-y-3.5 my-auto py-1">
        <div className="flex items-center gap-2">
          <Badge variant="warning" icon={Zap} size="sm">
            High Energy Period Detected
          </Badge>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-dark-text tracking-tight">
            Focus Recommendation
          </h3>
          <p className="text-xs text-dark-muted mt-1 leading-relaxed">
            Your telemetry signals show maximum focus efficiency during 45-minute blocks. Take a 10-minute rest after your next session to prevent cognitive burnout.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <Brain className="w-3.5 h-3.5" />
            <span>Optimal Work Block</span>
          </div>
          <p className="text-dark-muted text-[11px]">
            Recommended interval: 45 min focus + 10 min break
          </p>
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          fullWidth
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => navigate("/analytics")}
        >
          Open AI Productivity Coach
        </Button>
      </div>
    </Card>
  );
}

export default AIFocusPreviewCard;

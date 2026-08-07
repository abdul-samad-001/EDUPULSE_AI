import { Card, Button, Badge } from "../ui";
import { Sparkles, Brain, ArrowRight, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AIAnalyticsPreviewCard() {
  const navigate = useNavigate();

  return (
    <Card
      title="🤖 AI Intelligence & Weekly Recommendations"
      subtitle="Automated performance summary and learning path optimization"
      headerAction={
        <Badge variant="primary" icon={Sparkles} size="sm">
          AI Preview
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between border-dashed border-primary/40 bg-linear-to-br from-primary/5 via-dark-card to-dark-card"
    >
      <div className="space-y-3.5 my-auto py-1">
        <div className="flex items-center gap-2">
          <Badge variant="warning" icon={Zap} size="sm">
            Peak Consistency Detected
          </Badge>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-dark-text tracking-tight">
            AI Performance Summary
          </h3>
          <p className="text-xs text-dark-muted mt-1 leading-relaxed">
            Your Wednesday focus blocks demonstrate 92% efficiency with minimal tab switching. Shifting your complex problem-solving tasks to morning hours will yield faster mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border space-y-1">
            <span className="flex items-center gap-1 font-bold text-primary">
              <Brain className="w-3.5 h-3.5" />
              Cognitive Peak
            </span>
            <p className="text-dark-muted text-[11px]">9:00 AM - 11:30 AM (92% Focus)</p>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border space-y-1">
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Target className="w-3.5 h-3.5" />
              Recommended Focus
            </span>
            <p className="text-dark-muted text-[11px]">45 min blocks + 10 min break</p>
          </div>
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

export default AIAnalyticsPreviewCard;

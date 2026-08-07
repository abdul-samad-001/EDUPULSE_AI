import { useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "../ui";
import { Bot, Sparkles, Lightbulb, ArrowRight } from "lucide-react";

function AICoachPreviewCard() {
  const navigate = useNavigate();

  return (
    <Card
      title="🤖 AI Coach Preview"
      subtitle="Personalized daily study recommendations"
      headerAction={
        <Badge variant="primary" icon={Sparkles} size="sm">
          AI Active
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="space-y-3.5 my-1">
        {/* Recommendation Box */}
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span>Today's Recommendation</span>
          </div>
          <p className="text-xs text-dark-text leading-relaxed font-medium">
            Maintain your 25-minute focus intervals. Taking 5-minute cognitive breaks will prevent mental fatigue during complex milestone tasks.
          </p>
        </div>

        {/* Motivational Insight Box */}
        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Bot className="w-4 h-4 shrink-0" />
            <span>Motivational Insight</span>
          </div>
          <p className="text-xs text-dark-muted leading-relaxed">
            Your study streak shows highest output in the morning. Push your hardest technical topic before noon to maximize XP gains!
          </p>
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant="outline"
          fullWidth
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => navigate("/analytics")}
        >
          Open AI Analytics & Coach
        </Button>
      </div>
    </Card>
  );
}

export default AICoachPreviewCard;

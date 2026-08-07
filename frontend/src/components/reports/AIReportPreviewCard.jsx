import { Card, Button, Badge } from "../ui";
import { Sparkles, Brain, ArrowRight, Target, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AIReportPreviewCard({ aiReport = null }) {
  const navigate = useNavigate();

  const summaryText = aiReport?.insights?.[0]?.message ||
    "Your learning pattern shows exceptional consistency during morning Pomodoro sessions. Focus degradation is minimal during 45-minute study intervals.";
  const recommendation = aiReport?.recommendation ||
    "Maintain morning focus blocks and schedule 10-minute active breaks between technical coding modules.";

  return (
    <Card
      title="🤖 AI Report Summary & Pattern Analysis"
      subtitle="Automated intelligence audit analyzing learning patterns and workflow friction"
      headerAction={
        <Badge variant="primary" icon={Sparkles} size="sm">
          AI Preview
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between border-dashed border-primary/40 bg-linear-to-br from-primary/5 via-dark-card to-dark-card"
    >
      <div className="space-y-4 my-auto py-1">
        {/* AI Summary Block */}
        <div className="p-3.5 rounded-xl bg-dark-bg/90 border border-dark-border space-y-1.5">
          <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <Brain className="w-4 h-4" />
            AI Executive Summary
          </span>
          <p className="text-xs text-dark-muted leading-relaxed">
            {summaryText}
          </p>
        </div>

        {/* Learning Pattern & Recommendation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border space-y-1">
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Learning Pattern
            </span>
            <p className="text-dark-muted text-[11px]">High focus efficiency in 45m blocks</p>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border space-y-1">
            <span className="flex items-center gap-1 font-bold text-emerald-400">
              <Target className="w-3.5 h-3.5" />
              Recommendation
            </span>
            <p className="text-dark-muted text-[11px]">{recommendation}</p>
          </div>
        </div>
      </div>

      <div className="pt-3">
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

export default AIReportPreviewCard;

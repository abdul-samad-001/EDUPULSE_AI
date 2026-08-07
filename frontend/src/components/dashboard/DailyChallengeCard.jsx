import { Card, Badge, Progress, Button } from "../ui";
import { Zap, Award, CheckCircle2, Target } from "lucide-react";

function DailyChallengeCard({ challenge }) {
  if (!challenge) {
    return (
      <Card title="🎯 Daily Challenge" subtitle="Today's focus quest" className="w-full h-full flex flex-col justify-between">
        <div className="text-xs text-dark-muted py-8 text-center border border-dashed border-dark-border rounded-xl my-auto">
          No daily challenge active right now. Check back tomorrow!
        </div>
      </Card>
    );
  }

  const isCompleted = challenge.completed || (challenge.progress >= challenge.target);

  return (
    <Card
      title="🎯 Daily Challenge"
      subtitle="Complete today's targeted study quest to earn bonus XP"
      headerAction={
        <Badge
          variant={isCompleted ? "success" : "warning"}
          icon={isCompleted ? Award : Zap}
          size="sm"
        >
          {isCompleted ? "Completed" : "In Progress"}
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="space-y-3.5 my-auto">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="font-bold text-base text-dark-text tracking-tight">
              {challenge.title}
            </h3>
            <p className="text-xs text-dark-muted mt-1 leading-relaxed">
              {challenge.description}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-dark-muted">Reward</span>
            <span className="text-sm font-extrabold text-amber-400">+{challenge.rewardXP} XP</span>
          </div>
        </div>

        <div className="space-y-2 bg-dark-bg p-3.5 rounded-xl border border-dark-border">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-dark-muted flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-primary" /> Target Progress
            </span>
            <span className="text-dark-text">
              {challenge.progress || 0} / {challenge.target || 1}
            </span>
          </div>

          <Progress
            value={challenge.progress || 0}
            max={challenge.target || 1}
            size="md"
            color={isCompleted ? "success" : "primary"}
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant={isCompleted ? "success" : "secondary"}
          fullWidth
          size="sm"
          icon={isCompleted ? CheckCircle2 : Zap}
          disabled={isCompleted}
        >
          {isCompleted ? "Challenge Completed! 🎉" : "Complete via Focus Session"}
        </Button>
      </div>
    </Card>
  );
}

export default DailyChallengeCard;
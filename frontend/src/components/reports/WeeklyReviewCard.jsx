import { Card } from "../ui";
import { Clock, Zap, Award, CheckCircle2, Flame, Award as AwardIcon } from "lucide-react";

function WeeklyReviewCard({ weekly = null }) {
  const hours = weekly?.studyHours ?? 0;
  const productivity = weekly?.productivity ?? 0;
  const xp = weekly?.xp ?? 0;
  const achievements = weekly?.achievements ?? 0;
  const challenges = weekly?.challenges ?? 0;
  const focusRate = productivity > 0 ? `${productivity}%` : "0%";

  return (
    <Card
      title="🗓️ Weekly Executive Review"
      subtitle="Comprehensive breakdown of your 7-day focus cadence"
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="space-y-4 my-auto py-1">
        {/* Highlight Callouts */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-bold uppercase text-emerald-400 block">Weekly Status</span>
            <span className="text-sm font-extrabold text-dark-text">
              {productivity > 0 ? `${productivity}% Focus Rating` : "No sessions logged"}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
            <span className="text-[10px] font-bold uppercase text-sky-400 block">Logged Hours</span>
            <span className="text-sm font-extrabold text-dark-text">{hours}h Tracked</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <Clock className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Hours</span>
            <span className="font-extrabold text-dark-text">{hours}h</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <Zap className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Productivity</span>
            <span className="font-extrabold text-dark-text">{productivity}%</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">XP</span>
            <span className="font-extrabold text-dark-text">+{xp}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <AwardIcon className="w-4 h-4 text-primary mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Badges</span>
            <span className="font-extrabold text-dark-text">{achievements}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Challenges</span>
            <span className="font-extrabold text-dark-text">{challenges}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <Flame className="w-4 h-4 text-rose-400 mx-auto mb-1" />
            <span className="text-dark-muted block text-[10px]">Focus Rate</span>
            <span className="font-extrabold text-dark-text">{focusRate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default WeeklyReviewCard;

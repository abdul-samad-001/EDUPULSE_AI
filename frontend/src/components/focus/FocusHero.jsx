import { Badge, Button } from "../ui";
import { Sparkles, Flame, Clock, CheckCircle2, Play, Calendar } from "lucide-react";

function FocusHero({ streak = 0, todayMinutes = 0, completedSessions = 0, onStartFocusClick }) {
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-primary/30">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" icon={Sparkles} size="sm">
              Focus Workspace
            </Badge>
            <Badge variant="neutral" icon={Calendar} size="sm">
              {todayFormatted}
            </Badge>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-dark-text tracking-tight">
              How focused are you today? 🎯
            </h1>
            <p className="text-sm sm:text-base text-dark-muted mt-1.5 leading-relaxed font-medium italic">
              "Focus is the key that unlocks potential. Eliminate distractions and build deep work mastery."
            </p>
          </div>
        </div>

        {/* Right Column: Quick Stats & CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 w-full lg:w-auto shrink-0">
          <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold uppercase mb-0.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Streak</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {streak} Days
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-primary text-[11px] font-bold uppercase mb-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Today</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {todayMinutes} min
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold uppercase mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Done</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {completedSessions}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Play}
            onClick={onStartFocusClick}
            className="shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
          >
            ▶ Start Focus Session
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FocusHero;

import { Badge, Button } from "../ui";
import { Sparkles, Flame, Trophy, Play, Calendar, Target } from "lucide-react";

function HeroSection({ user, xp, streak = 0, onStartFocus }) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-primary/30">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: User Welcome & Motivation */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" icon={Sparkles} size="sm">
              EduPulse AI Dashboard
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-dark-muted bg-dark-bg/80 px-3 py-1 rounded-full border border-dark-border">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{currentDate}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-dark-text tracking-tight">
              Welcome back, <span className="text-primary">{user?.name || "Learner"}</span> 👋
            </h1>
            <p className="text-sm sm:text-base text-dark-muted mt-1.5 italic font-medium">
              "Consistency beats intensity. Everyday progress builds mastery."
            </p>
          </div>

          {/* Goal Placeholder */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-xl">
            <Target className="w-4 h-4 shrink-0" />
            <span>Placement Goal: <strong className="text-dark-text font-bold">Full Stack Software Engineer</strong></span>
          </div>
        </div>

        {/* Right Column: Key Quick Stats Badges & Main CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 w-full lg:w-auto shrink-0">
          <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold uppercase mb-0.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Level</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {xp?.level || 1}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>XP</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {xp?.totalXP || 0}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-rose-400 text-xs font-bold uppercase mb-0.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Streak</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {streak} d
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Play}
            onClick={onStartFocus}
            className="shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
          >
            Start Focus Session
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

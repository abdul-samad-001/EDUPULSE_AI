import { Badge } from "../ui";
import { Sparkles, Clock, Zap, Target, Flame, Calendar, LineChart, Timer, BookOpen } from "lucide-react";

function AnalyticsHero({
  totalHours = 0,
  avgProductivity = 0,
  focusScore = 0,
  longestStreak = 0,
  activeTab = "overview",
  onTabChange,
  globalRange = "Week",
  onRangeChange,
}) {
  const TABS = [
    { id: "overview", label: "Overview & Productivity", icon: LineChart, badge: "Trends" },
    { id: "focus", label: "Focus & Attention", icon: Timer, badge: "ML Signals" },
    { id: "skills_ai", label: "Skill Mastery & AI", icon: BookOpen, badge: "Mastery" },
  ];

  const RANGES = ["Day", "Week", "Month"];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border p-4 sm:p-6 shadow-xl transition-all duration-300 hover:border-primary/30">
      {/* Decorative Blur Glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Row: Heading, Global Range, and Stat Chips */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" icon={Sparkles} size="sm">
                Intelligence Center
              </Badge>
              <span className="text-[11px] font-bold text-dark-muted hidden sm:inline-block">
                Model v2.4 • Dynamic Aggregation
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-dark-text tracking-tight">
                Learning Performance Evolution 📈
              </h1>
              <p className="text-xs sm:text-sm text-dark-muted font-medium">
                Deep behavioral telemetry, ML attention predictions, and skill acquisition trajectories.
              </p>
            </div>
          </div>

          {/* Right Column: Key Stats & Date Range */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Global Date Range */}
            <div className="flex items-center gap-1 bg-dark-bg p-1 rounded-xl border border-dark-border self-start sm:self-center">
              <Calendar className="w-3.5 h-3.5 text-dark-muted ml-1.5 mr-0.5" />
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRangeChange && onRangeChange(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    globalRange === r
                      ? "bg-primary text-dark-bg shadow-xs"
                      : "text-dark-muted hover:text-dark-text"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Stats Badges */}
            <div className="grid grid-cols-4 gap-2 w-full sm:w-auto">
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-dark-bg/80 border border-dark-border min-w-16 text-center">
                <span className="text-primary text-[9px] font-bold uppercase flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" /> Study
                </span>
                <span className="text-sm font-black text-dark-text">{totalHours}h</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-dark-bg/80 border border-dark-border min-w-16 text-center">
                <span className="text-sky-400 text-[9px] font-bold uppercase flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5" /> Score
                </span>
                <span className="text-sm font-black text-dark-text">{avgProductivity}%</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-dark-bg/80 border border-dark-border min-w-16 text-center">
                <span className="text-emerald-400 text-[9px] font-bold uppercase flex items-center gap-0.5">
                  <Target className="w-2.5 h-2.5" /> Focus
                </span>
                <span className="text-sm font-black text-dark-text">{focusScore}</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-dark-bg/80 border border-dark-border min-w-16 text-center">
                <span className="text-amber-400 text-[9px] font-bold uppercase flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5" /> Streak
                </span>
                <span className="text-sm font-black text-dark-text">{longestStreak}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="pt-2 border-t border-dark-border/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-dark-bg shadow-md shadow-primary/25 scale-[1.02]"
                      : "bg-dark-bg/80 text-dark-muted hover:text-dark-text hover:bg-dark-border/40 border border-dark-border"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-dark-bg" : "text-primary"}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? "bg-dark-bg/20 text-dark-bg"
                        : "bg-dark-card text-dark-muted border border-dark-border"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsHero;

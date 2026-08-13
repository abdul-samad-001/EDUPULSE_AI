import { Card, Progress } from "../ui";
import { CheckCircle2, Flag, Award, Search } from "lucide-react";

function MilestoneProgress({
  milestones = [],
  activeFilter = "all",
  onFilterChange,
  searchQuery = "",
  onSearchChange,
}) {
  const total = milestones.length;
  const completedCount = milestones.filter((m) => m.unlocked).length;
  const inProgressCount = total - completedCount;
  const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const totalXP = completedCount * 50;

  return (
    <Card className="w-full bg-linear-to-br from-dark-card via-dark-card to-primary/10 border-primary/20 space-y-5">
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
        {/* Progress Bar Info */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-extrabold text-dark-text uppercase tracking-wider">
                Overall Milestone Progress
              </h3>
            </div>
            <span className="text-2xl font-extrabold text-primary">{percentage}%</span>
          </div>

          <Progress value={percentage} size="md" color="primary" />

          <div className="flex items-center justify-between text-xs text-dark-muted font-medium pt-0.5">
            <span>{completedCount} of {total} milestones unlocked</span>
            <span className="text-emerald-400 font-bold">{inProgressCount} in progress</span>
          </div>
        </div>

        {/* Quick Stat Badges */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-xl bg-dark-bg/90 border border-dark-border text-center">
            <span className="text-[10px] font-extrabold uppercase text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Unlocked
            </span>
            <p className="text-base font-extrabold text-dark-text pt-0.5">{completedCount}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-bg/90 border border-dark-border text-center">
            <span className="text-[10px] font-extrabold uppercase text-amber-400 flex items-center justify-center gap-1">
              <Flag className="w-3 h-3" />
              In Progress
            </span>
            <p className="text-base font-extrabold text-dark-text pt-0.5">{inProgressCount}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-bg/90 border border-dark-border text-center">
            <span className="text-[10px] font-extrabold uppercase text-violet-400 flex items-center justify-center gap-1">
              <Award className="w-3 h-3" />
              XP Gain
            </span>
            <p className="text-base font-extrabold text-violet-400 pt-0.5">+{totalXP}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="pt-3 border-t border-dark-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-dark-bg rounded-xl border border-dark-border w-full sm:w-auto">
          <button
            onClick={() => onFilterChange("all")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeFilter === "all"
                ? "bg-primary text-dark-bg shadow-sm"
                : "text-dark-muted hover:text-dark-text"
            }`}
          >
            All ({total})
          </button>
          <button
            onClick={() => onFilterChange("in_progress")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeFilter === "in_progress"
                ? "bg-primary text-dark-bg shadow-sm"
                : "text-dark-muted hover:text-dark-text"
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => onFilterChange("completed")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeFilter === "completed"
                ? "bg-primary text-dark-bg shadow-sm"
                : "text-dark-muted hover:text-dark-text"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            placeholder="Search milestones..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>
    </Card>
  );
}

export default MilestoneProgress;
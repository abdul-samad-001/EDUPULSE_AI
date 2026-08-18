import { Card, Progress } from "../ui";
import { Trophy, CheckCircle2, Lock, Award, Search } from "lucide-react";

function AchievementStats({
  achievements = [],
  activeFilter = "all",
  onFilterChange,
  searchQuery = "",
  onSearchChange,
}) {
  const total = achievements.length;
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const locked = total - unlocked;
  const percentage = total === 0 ? 0 : Math.round((unlocked / total) * 100);
  const totalXP = unlocked * 100;

  return (
    <Card className="w-full bg-linear-to-br from-dark-card via-dark-card to-amber-500/10 border-amber-500/20 p-4 space-y-3.5 shadow-md">
      {/* Top Banner Row: Progress + Stat Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-center">
        {/* Progress Bar Info */}
        <div className="lg:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-xs font-black text-dark-text uppercase tracking-wider">
                Overall Achievement Mastery
              </h3>
            </div>
            <span className="text-xl font-black text-amber-400">{percentage}%</span>
          </div>

          <Progress value={percentage} size="sm" color="warning" />

          <div className="flex items-center justify-between text-[11px] text-dark-muted font-medium">
            <span>{unlocked} of {total} badges unlocked</span>
            <span className="text-amber-400 font-bold">{locked} badges remaining</span>
          </div>
        </div>

        {/* Quick Stat Badges */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-xl bg-dark-bg/90 border border-dark-border text-center">
            <span className="text-[9px] font-black uppercase text-amber-400 flex items-center justify-center gap-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" /> Unlocked
            </span>
            <p className="text-sm font-black text-dark-text pt-0.5">{unlocked}</p>
          </div>

          <div className="p-2 rounded-xl bg-dark-bg/90 border border-dark-border text-center">
            <span className="text-[9px] font-black uppercase text-dark-muted flex items-center justify-center gap-0.5">
              <Lock className="w-2.5 h-2.5" /> Locked
            </span>
            <p className="text-sm font-black text-dark-text pt-0.5">{locked}</p>
          </div>

          <div className="p-2 rounded-xl bg-dark-bg/90 border border-dark-border text-center">
            <span className="text-[9px] font-black uppercase text-primary flex items-center justify-center gap-0.5">
              <Award className="w-2.5 h-2.5" /> Rewards
            </span>
            <p className="text-sm font-black text-primary pt-0.5">+{totalXP} XP</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="pt-2 border-t border-dark-border/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-dark-bg rounded-xl border border-dark-border w-full sm:w-auto">
          {[
            { id: "all", label: `All (${total})` },
            { id: "unlocked", label: `Unlocked (${unlocked})` },
            { id: "locked", label: `Locked (${locked})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-amber-400 text-dark-bg shadow-xs font-black"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            placeholder="Search badges & rewards..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-dark-text placeholder:text-dark-muted focus:outline-hidden focus:border-amber-400/50 transition-colors"
          />
        </div>
      </div>
    </Card>
  );
}

export default AchievementStats;
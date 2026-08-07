import { useState } from "react";
import { Badge } from "../ui";
import { Sparkles, FileText, Clock, Award, CheckCircle2, Calendar } from "lucide-react";

function ReportsHero({
  totalReports = 3,
  studyHours = 18.5,
  skillsCompleted = 4,
  xpEarned = 750,
  onDateRangeChange,
}) {
  const [range, setRange] = useState("Month");

  const handleRangeSelect = (r) => {
    setRange(r);
    if (onDateRangeChange) onDateRangeChange(r);
  };

  const RANGES = ["Today", "Week", "Month", "Custom"];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-primary/30">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column */}
        <div className="space-y-3 max-w-2xl">
          <Badge variant="primary" icon={Sparkles} size="sm">
            Reports Intelligence Center
          </Badge>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-dark-text tracking-tight">
              Learning Audits & Export Center 📄
            </h1>
            <p className="text-sm sm:text-base text-dark-muted mt-1.5 leading-relaxed font-medium">
              Generate detailed historical reports, track milestone timelines, and export your learning progress in PDF, CSV, or JSON formats.
            </p>
          </div>
        </div>

        {/* Right Column: Date Range Picker & Metrics */}
        <div className="flex flex-col items-stretch sm:items-end gap-4 w-full lg:w-auto shrink-0">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-dark-bg p-1 rounded-xl border border-dark-border self-start lg:self-end">
            <Calendar className="w-3.5 h-3.5 text-dark-muted ml-2 mr-1 hidden sm:block" />
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRangeSelect(r)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  range === r
                    ? "bg-primary text-dark-bg shadow-sm"
                    : "text-dark-muted hover:text-dark-text hover:bg-dark-border/40"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full sm:w-auto">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-primary text-[11px] font-bold uppercase mb-0.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Reports</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {totalReports}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-sky-400 text-[11px] font-bold uppercase mb-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Hours</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {studyHours}h
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold uppercase mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Skills</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {skillsCompleted}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold uppercase mb-0.5">
                <Award className="w-3.5 h-3.5" />
                <span>XP Earned</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                +{xpEarned}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsHero;

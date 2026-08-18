import Card from "./Card";

const COLOR_MAP = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  sky: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    text: "text-sky-400",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  subtext,
  colorTheme = "primary",
  className = "",
}) {
  const theme = COLOR_MAP[colorTheme] || COLOR_MAP.primary;

  return (
    <Card
      className={`relative overflow-hidden p-3 sm:p-3.5 transition-all duration-300 hover:border-primary/30 hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase text-dark-muted leading-tight truncate block">
            {title}
          </span>
          <h4 className="text-base sm:text-lg font-extrabold text-dark-text tracking-tight mt-1 whitespace-nowrap truncate">
            {value}
          </h4>
        </div>

        {Icon && (
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${theme.bg} ${theme.border} border ${theme.text} flex items-center justify-center shrink-0 mt-0.5`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        )}
      </div>

      {(trend !== undefined || subtext || trendLabel) && (
        <div className="mt-2 pt-1.5 border-t border-dark-border/60 flex items-center gap-1 text-[10px] sm:text-[11px] leading-tight">
          {trend !== undefined && (
            <span
              className={`font-semibold ${
                trend >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          {trendLabel && <span className="text-dark-muted">{trendLabel}</span>}
          {subtext && (
            <span className="text-dark-muted truncate block">{subtext}</span>
          )}
        </div>
      )}
    </Card>
  );
}

export default StatCard;

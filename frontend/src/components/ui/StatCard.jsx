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
      className={`relative overflow-hidden p-3.5 sm:p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-dark-muted leading-tight block line-clamp-2 min-h-[1.75rem] flex items-center">
            {title}
          </span>
          <h4 className="text-lg sm:text-xl font-extrabold text-dark-text tracking-tight mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {value}
          </h4>
        </div>

        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg ${theme.bg} ${theme.border} border ${theme.text} flex items-center justify-center shrink-0 mt-0.5`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {(trend !== undefined || subtext || trendLabel) && (
        <div className="mt-2.5 pt-2 border-t border-dark-border/60 flex items-center gap-1.5 text-[11px] leading-tight">
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

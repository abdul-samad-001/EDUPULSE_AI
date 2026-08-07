import Card from "./Card";

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  subtext,
  className = "",
}) {
  return (
    <Card className={`relative overflow-hidden p-3.5 sm:p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-dark-muted truncate block">
            {title}
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-dark-text tracking-tight mt-1 truncate">
            {value}
          </h4>
        </div>

        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {(trend !== undefined || subtext || trendLabel) && (
        <div className="mt-2 pt-2 border-t border-dark-border/60 flex items-center gap-1.5 text-[11px]">
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
          {subtext && <span className="text-dark-muted">{subtext}</span>}
        </div>
      )}
    </Card>
  );
}

export default StatCard;

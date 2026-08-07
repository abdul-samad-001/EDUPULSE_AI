export function SectionHeader({
  title,
  subtitle,
  action,
  icon: Icon,
  className = "",
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 ${className}`}>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-dark-text tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-dark-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default SectionHeader;

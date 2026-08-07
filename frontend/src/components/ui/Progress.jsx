export function Progress({
  value = 0,
  max = 100,
  size = "md",
  color = "primary",
  showLabel = false,
  label,
  className = "",
}) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colorStyles = {
    primary: "bg-primary shadow-[0_0_10px_rgba(124,231,208,0.3)]",
    success: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    warning: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
    danger: "bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs font-medium text-dark-muted mb-1.5">
          <span>{label || "Progress"}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-dark-border rounded-full overflow-hidden ${sizeStyles[size] || sizeStyles.md}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            colorStyles[color] || colorStyles.primary
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default Progress;

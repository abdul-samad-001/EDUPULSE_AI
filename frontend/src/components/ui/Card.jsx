export function Card({
  children,
  className = "",
  title,
  subtitle,
  headerAction,
  footer,
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-dark-card border border-dark-border rounded-2xl p-4 sm:p-5 shadow-lg shadow-black/20 flex flex-col justify-between transition-all duration-200 ${
        hoverable
          ? "hover:border-primary/40 hover:shadow-primary/5 cursor-pointer transform hover:-translate-y-0.5"
          : ""
      } ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex justify-between items-start mb-3 gap-3">
          <div>
            {title && (
              <h3 className="text-base font-bold text-dark-text tracking-tight leading-snug">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-dark-muted mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      <div className="flex-1">{children}</div>

      {footer && (
        <div className="mt-3 pt-3 border-t border-dark-border/80">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;

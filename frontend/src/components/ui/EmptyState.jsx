import Card from "./Card";

export function EmptyState({
  icon: Icon,
  title = "No data found",
  description = "There is nothing to display right now.",
  action,
  className = "",
}) {
  return (
    <Card className={`text-center py-12 px-6 flex flex-col items-center justify-center ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-dark-border border border-dark-border flex items-center justify-center text-primary mb-4 shadow-inner">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-bold text-dark-text tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-dark-muted max-w-md mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </Card>
  );
}

export default EmptyState;

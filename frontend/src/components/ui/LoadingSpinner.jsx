export function LoadingSpinner({
  size = "md",
  label,
  fullScreen = false,
  className = "",
}) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${
          sizeClasses[size] || sizeClasses.md
        } border-primary border-t-transparent rounded-full animate-spin`}
      />
      {label && <p className="text-sm font-medium text-dark-muted animate-pulse">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/90 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

export default LoadingSpinner;

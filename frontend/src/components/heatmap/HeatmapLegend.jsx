function HeatmapLegend() {
  const colors = [
    "bg-dark-border",
    "bg-primary/30",
    "bg-primary/60",
    "bg-primary/85",
    "bg-primary",
  ];

  return (
    <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-dark-muted">
      <span>Less</span>
      {colors.map((color, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-sm ${color}`}
        />
      ))}
      <span>More</span>
    </div>
  );
}

export default HeatmapLegend;
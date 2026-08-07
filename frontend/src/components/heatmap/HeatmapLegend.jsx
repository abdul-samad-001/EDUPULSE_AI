function HeatmapLegend() {
  const colors = [
    "bg-dark-border/60",
    "bg-primary/30 border border-primary/40",
    "bg-primary/65",
    "bg-primary/85",
    "bg-primary",
  ];

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-dark-muted font-medium select-none">
      <span>Less</span>
      {colors.map((color, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-xs ${color}`}
        />
      ))}
      <span>More</span>
    </div>
  );
}

export default HeatmapLegend;
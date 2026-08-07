function HeatmapCell({ value = 0, date, isFuture = false, isToday = false }) {
  const getColor = () => {
    if (isFuture) return "bg-dark-border/20 border border-dark-border/10 pointer-events-none opacity-30";
    if (isToday) {
      if (value === 0) return "bg-amber-500/20 border-2 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.5)] animate-pulse";
      return "bg-primary border-2 border-amber-400 ring-2 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)] scale-110";
    }
    if (value === 0) return "bg-dark-border/60 hover:bg-dark-border hover:border-dark-muted/40";
    if (value <= 30) return "bg-primary/30 border border-primary/40 hover:bg-primary/50";
    if (value <= 60) return "bg-primary/65 hover:bg-primary/80";
    if (value <= 120) return "bg-primary/85 hover:bg-primary";
    return "bg-primary shadow-xs shadow-primary/50 hover:scale-125";
  };

  // Parse YYYY-MM-DD safely in local time to avoid timezone offset shifts
  const formatLocalFormattedDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const localD = new Date(year, month, day);
    return localD.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formattedDate = formatLocalFormattedDate(date);

  return (
    <div className="relative group flex justify-center items-center">
      <div
        className={`w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 rounded-md ${getColor()} transition-all duration-200 cursor-pointer`}
      />
      {/* Custom Tooltip */}
      {!isFuture && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
          <div className="bg-dark-card border border-dark-border text-dark-text text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap">
            {isToday && <span className="text-amber-400 font-extrabold mr-1">🌟 TODAY:</span>}
            <span className="text-primary font-bold">{value > 0 ? `${value} mins` : "0 mins"}</span> on {formattedDate}
          </div>
          <div className="w-2 h-2 bg-dark-card border-r border-b border-dark-border rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}

export default HeatmapCell;
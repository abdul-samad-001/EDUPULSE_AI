function HeatmapCell({ value = 0, date }) {
  const getColor = () => {
    if (value === 0) return "bg-dark-border";
    if (value <= 30) return "bg-primary/30 border border-primary/50";
    if (value <= 60) return "bg-primary/60";
    if (value <= 120) return "bg-primary/85";
    return "bg-primary shadow-sm shadow-primary/50";
  };

  return (
    <div
      title={`${date} • ${value} min`}
      className={`w-full aspect-square max-w-5 rounded-sm ${getColor()} hover:scale-125 transition-all duration-150 cursor-pointer mx-auto`}
    />
  );
}

export default HeatmapCell;
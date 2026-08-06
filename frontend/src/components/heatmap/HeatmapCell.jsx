function HeatmapCell({ value = 0, date }) {
  const getColor = () => {
    if (value === 0) return "bg-gray-200";
    if (value <= 30) return "bg-green-300";
    if (value <= 60) return "bg-green-500";
    if (value <= 120) return "bg-green-700";
    return "bg-green-900";
  };

  return (
    <div
      title={`${date} • ${value} min`}
      className={`w-4 h-4 rounded-sm ${getColor()} hover:scale-125 transition-transform cursor-pointer`}
    />
  );
}

export default HeatmapCell;
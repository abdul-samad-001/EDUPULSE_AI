function HeatmapLegend() {
  const colors = [
    "bg-gray-200",
    "bg-green-300",
    "bg-green-500",
    "bg-green-700",
    "bg-green-900",
  ];

  return (
    <div className="flex items-center justify-end gap-2 mt-4">

      <span className="text-sm text-gray-500">
        Less
      </span>

      {colors.map((color, index) => (
        <div
          key={index}
          className={`w-4 h-4 rounded-sm ${color}`}
        />
      ))}

      <span className="text-sm text-gray-500">
        More
      </span>

    </div>
  );
}

export default HeatmapLegend;
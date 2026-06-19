function OverallProgress({ value = 0 }) {
  // Ensure value stays safely within bounds for visual rendering
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Overall Progress</h3>
          <p className="text-xs text-slate-500">Total metrics tracking completion rate</p>
        </div>
        <span className="text-xl font-extrabold text-slate-900 tracking-tight">
          {normalizedValue}%
        </span>
      </div>
      {/* Outer Progress Bar Track */}
      <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
        <div
          className="bg-slate-900 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}

export default OverallProgress;
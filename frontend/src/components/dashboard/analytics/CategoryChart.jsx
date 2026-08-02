
function CategoryChart({ data = [] }) {
  const maxCount = data.length > 0 ? Math.max(...data.map((item) => item.count)) : 1;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Category Analytics</h3>
        <p className="text-xs text-slate-500">Distribution of skills across domains</p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
          No category data available
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => {
            const barWidthPercent = (item.count / maxCount) * 100;

            return (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">{item.category}</span>
                  <span className="text-slate-500 font-semibold">
                    {item.count} {item.count === 1 ? "Skill" : "Skills"}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-md overflow-hidden">
                  <div
                    className="bg-slate-900 h-full transition-all duration-500 ease-out"
                    style={{ width: `${barWidthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoryChart;
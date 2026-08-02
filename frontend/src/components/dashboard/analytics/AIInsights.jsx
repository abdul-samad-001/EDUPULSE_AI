function AIInsights({ insights }) {
  const getStyles = (type) => {
    switch (type) {
      case "success":
        return {
          border: "border-green-500",
          bg: "bg-green-50",
          icon: "✅",
        };

      case "warning":
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-50",
          icon: "⚠️",
        };

      default:
        return {
          border: "border-blue-500",
          bg: "bg-blue-50",
          icon: "💡",
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-5">
        🧠 AI Productivity Insights
      </h2>

      <div className="space-y-4">
        {insights.map((item, index) => {
          const style = getStyles(item.type);

          return (
            <div
              key={index}
              className={`${style.bg} ${style.border} border-l-4 rounded-lg p-4`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">
                  {style.icon}
                </span>

                <div>
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-700 mt-1">
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AIInsights;
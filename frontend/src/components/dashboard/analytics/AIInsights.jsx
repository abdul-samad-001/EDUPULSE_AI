import { Card } from "../../ui";

function AIInsights({ insights = [] }) {
  const getStyles = (type) => {
    switch (type) {
      case "success":
        return {
          border: "border-emerald-500/40",
          bg: "bg-emerald-500/10 text-emerald-300",
          icon: "✅",
        };

      case "warning":
        return {
          border: "border-amber-500/40",
          bg: "bg-amber-500/10 text-amber-300",
          icon: "⚠️",
        };

      default:
        return {
          border: "border-primary/40",
          bg: "bg-primary/10 text-primary",
          icon: "💡",
        };
    }
  };

  return (
    <Card title="🧠 AI Productivity Insights" className="w-full">
      <div className="space-y-3">
        {insights.map((item, index) => {
          const style = getStyles(item.type);

          return (
            <div
              key={index}
              className={`${style.bg} ${style.border} border-l-4 rounded-xl p-3.5`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-base shrink-0">{style.icon}</span>

                <div>
                  <h4 className="font-semibold text-sm text-dark-text">
                    {item.title}
                  </h4>

                  <p className="text-xs text-dark-muted mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default AIInsights;
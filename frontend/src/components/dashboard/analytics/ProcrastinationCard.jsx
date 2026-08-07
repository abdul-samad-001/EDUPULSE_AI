import { formatMinutes } from "../../../utils/timeFormatter";
import { Card } from "../../ui";

function ProcrastinationCard({ data }) {
  if (!data) return null;

  const getColor = () => {
    switch (data.level) {
      case "Low":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          emoji: "🟢",
        };

      case "Medium":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/40",
          text: "text-amber-400",
          emoji: "🟡",
        };

      default:
        return {
          bg: "bg-rose-500/10",
          border: "border-rose-500/40",
          text: "text-rose-400",
          emoji: "🔴",
        };
    }
  };

  const style = getColor();

  return (
    <Card title="🧠 Procrastination Score" className="w-full">
      <div
        className={`${style.bg} ${style.border} border-l-4 rounded-xl p-4`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-extrabold text-dark-text tracking-tight">
              {data.score}%
            </h3>

            <p className={`text-xs font-semibold ${style.text} mt-1`}>
              {style.emoji} {data.level} Risk
            </p>
          </div>

          <div className="text-right text-xs">
            <p className="text-dark-muted">
              Study Time: <span className="font-bold text-dark-text">{formatMinutes(data.productiveMinutes)}</span>
            </p>

            <p className="text-dark-muted mt-1">
              Distract Time: <span className="font-bold text-dark-text">{formatMinutes(data.distractingMinutes)}</span>
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-dark-border/50">
          <p className="text-xs text-dark-text leading-relaxed">
            {data.message}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default ProcrastinationCard;
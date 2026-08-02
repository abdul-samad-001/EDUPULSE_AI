import { formatMinutes } from "../../../utils/timeFormatter";

function ProcrastinationCard({ data }) {
  if (!data) {
    return null;
  }

  const getColor = () => {
    switch (data.level) {
      case "Low":
        return {
          bg: "bg-green-50",
          border: "border-green-500",
          text: "text-green-600",
          emoji: "🟢",
        };

      case "Medium":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-500",
          text: "text-yellow-600",
          emoji: "🟡",
        };

      default:
        return {
          bg: "bg-red-50",
          border: "border-red-500",
          text: "text-red-600",
          emoji: "🔴",
        };
    }
  };

  const style = getColor();

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-5">
        🧠 Procrastination Score
      </h2>

      <div
        className={`${style.bg} ${style.border} border-l-4 rounded-lg p-5`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-4xl font-bold">
              {data.score}%
            </h3>

            <p className={`font-semibold ${style.text}`}>
              {style.emoji} {data.level}
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-600 text-sm">
              Study Time
            </p>

            <p className="font-semibold">
              {formatMinutes(data.productiveMinutes)}
            </p>

            <p className="text-slate-600 text-sm mt-3">
              Distract Time
            </p>

            <p className="font-semibold">
              {formatMinutes(data.distractingMinutes)}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-slate-700">
            {data.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProcrastinationCard;
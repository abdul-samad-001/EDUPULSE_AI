import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, Badge } from "../ui";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

function ProcrastinationAnalyticsCard({ procrastinationData = null, studyVsDistract = null }) {
  const score = procrastinationData?.procrastinationScore ?? 18;
  const riskLevel = procrastinationData?.riskLevel || (score > 50 ? "High Risk" : score > 25 ? "Moderate Risk" : "Low Risk");

  const productiveMins = studyVsDistract?.productiveMinutes || 180;
  const distractingMins = studyVsDistract?.distractingMinutes || 35;
  const neutralMins = 25;

  const pieData = [
    { name: "Productive Focus", value: productiveMins, color: "#2dd4bf" },
    { name: "Distraction Time", value: distractingMins, color: "#f43f5e" },
    { name: "Neutral Browsing", value: neutralMins, color: "#94a3b8" },
  ];

  const riskVariant = score > 50 ? "danger" : score > 25 ? "warning" : "success";
  const RiskIcon = score > 50 ? ShieldAlert : score > 25 ? AlertCircle : CheckCircle2;

  return (
    <Card
      title="🧠 Procrastination & Attention Analytics"
      subtitle="ML Model 1 telemetry signals analyzing focus sustainability vs distraction triggers"
      headerAction={
        <Badge variant={riskVariant} icon={RiskIcon} size="sm">
          {riskLevel}
        </Badge>
      }
      className="w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1 items-center">
        {/* Left Column: Metric Overview */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-dark-muted">Procrastination Score</span>
              <span className={`font-extrabold text-sm ${score > 50 ? "text-rose-400" : score > 25 ? "text-amber-400" : "text-emerald-400"}`}>
                {score} / 100
              </span>
            </div>
            <div className="w-full bg-dark-card h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${score > 50 ? "bg-rose-400" : score > 25 ? "bg-amber-400" : "bg-emerald-400"}`}
                style={{ width: `${Math.min(100, score)}%` }}
              />
            </div>
            <p className="text-[11px] text-dark-muted mt-1">
              {score <= 25
                ? "Excellent attention control! Low distraction interference detected."
                : score <= 50
                ? "Moderate distraction risk. Consider using site-blockers during deep work."
                : "High distraction signals detected. Recommend switching to 25m Pomodoro cycles."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase block">Productive Time</span>
              <span className="text-sm font-extrabold text-emerald-400">{productiveMins} mins</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-[10px] font-bold text-dark-muted uppercase block">Distraction Time</span>
              <span className="text-sm font-extrabold text-rose-400">{distractingMins} mins</span>
            </div>
          </div>
        </div>

        {/* Right Column: Recharts Pie Chart */}
        <div className="bg-dark-bg p-4 rounded-xl border border-dark-border flex flex-col items-center justify-center">
          <h4 className="text-xs font-extrabold uppercase text-dark-muted tracking-wider mb-1">
            Time Distribution Pie Chart
          </h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-dark-card border border-dark-border text-dark-text p-2 rounded-lg text-xs font-semibold shadow-xl">
                          <p className="font-bold" style={{ color: payload[0].payload.color }}>
                            {payload[0].name}
                          </p>
                          <p>{payload[0].value} mins</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProcrastinationAnalyticsCard;

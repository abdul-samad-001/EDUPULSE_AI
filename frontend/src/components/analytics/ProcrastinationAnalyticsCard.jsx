import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, Badge, LoadingSpinner, Button } from "../ui";
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";
import { getProcrastinationPrediction } from "../../services/mlService";

function ProcrastinationAnalyticsCard({ procrastinationData = null, studyVsDistract = null }) {
  const [mlData, setMlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModel1 = async () => {
    try {
      setError(null);
      const res = await getProcrastinationPrediction();
      if (res?.success && res?.data) {
        setMlData(res.data);
      }
    } catch (err) {
      console.warn("Model 1 ML Prediction Warning:", err?.response?.data?.message || err?.message);
      setError("AI Procrastination prediction unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadModel = async () => {
      try {
        const res = await getProcrastinationPrediction();
        if (isMounted && res?.success && res?.data) {
          setMlData(res.data);
        }
      } catch (err) {
        if (isMounted) setError("AI Procrastination prediction unavailable.");
        console.warn(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadModel();
    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackScore = procrastinationData?.procrastinationScore ?? 20;
  const probability = mlData?.probability ?? fallbackScore / 100;
  const score = Math.round(probability * 100);
  const riskLevel = mlData?.risk_level || (score > 65 ? "High Risk" : score > 35 ? "Moderate Risk" : "Low Risk");

  const productiveMins = studyVsDistract?.productiveMinutes || 180;
  const distractingMins = studyVsDistract?.distractingMinutes || 35;
  const neutralMins = 25;

  const pieData = [
    { name: "Productive Focus", value: productiveMins, color: "#2dd4bf" },
    { name: "Distraction Time", value: distractingMins, color: "#f43f5e" },
    { name: "Neutral Browsing", value: neutralMins, color: "#94a3b8" },
  ];

  const riskVariant = riskLevel === "High" ? "danger" : riskLevel === "Moderate" ? "warning" : "success";
  const RiskIcon = riskLevel === "High" ? ShieldAlert : riskLevel === "Moderate" ? AlertCircle : CheckCircle2;

  return (
    <Card
      title="🧠 AI Procrastination & Attention Analytics"
      subtitle="Real-time behavioral signals analyzing focus sustainability vs distraction triggers"
      headerAction={
        <div className="flex items-center gap-2">
          <Badge variant="primary" icon={Sparkles} size="sm">
            AI Risk Analysis
          </Badge>
          <Badge variant={riskVariant} icon={RiskIcon} size="sm">
            {riskLevel}
          </Badge>
        </div>
      }
      className="w-full"
    >
      {loading ? (
        <div className="py-8 flex justify-center items-center">
          <LoadingSpinner size="md" label="Evaluating attention telemetry signals..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1 items-center">
          {/* Left Column: Metric Overview */}
          <div className="space-y-3">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex justify-between items-center">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={fetchModel1} icon={RefreshCw} className="h-6 text-[10px] px-2" />
              </div>
            )}

            <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-dark-muted flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  AI Procrastination Risk Score
                </span>
                <span className={`font-extrabold text-sm ${score > 65 ? "text-rose-400" : score > 35 ? "text-amber-400" : "text-emerald-400"}`}>
                  {score}%
                </span>
              </div>
              <div className="w-full bg-dark-card h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${score > 65 ? "bg-rose-400" : score > 35 ? "bg-amber-400" : "bg-emerald-400"}`}
                  style={{ width: `${Math.min(100, score)}%` }}
                />
              </div>
              <p className="text-[11px] text-dark-muted mt-1 leading-relaxed">
                {riskLevel === "Low"
                  ? "Excellent attention control! Low distraction interference detected by AI analysis."
                  : riskLevel === "Moderate"
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
              Time Distribution Breakdown
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
      )}
    </Card>
  );
}

export default ProcrastinationAnalyticsCard;

import { useEffect, useState } from "react";
import api from "../../services/api";

function RiskBadge({ skillId }) {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const response = await api.post("/procrastination/predict", {
          skillId,
        });

        setRisk(response.data);
      } catch (error) {
        console.error("Failed to fetch procrastination risk:", error);
      } finally {
        setLoading(false);
      }
    };

    if (skillId) {
      fetchRisk();
    }
  }, [skillId]);

  if (loading) {
    return (
      <span className="text-xs text-slate-400">
        Checking AI risk...
      </span>
    );
  }

  if (!risk) return null;

  const riskLevel = risk.risk_level || risk.riskLevel;

  const styles = {
    Low: "bg-green-100 text-green-700",
    Moderate: "bg-amber-100 text-amber-700",
    High: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
        styles[riskLevel] || "bg-slate-100 text-slate-600"
      }`}
    >
      AI Risk: {riskLevel || "Unknown"}
    </span>
  );
}

export default RiskBadge;
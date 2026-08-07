import { StatCard } from "../ui";
import { Timer, Clock, Zap, AlertCircle } from "lucide-react";

function ReportSummaryCard({ stats }) {
  if (!stats) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-wider text-dark-muted">
        📊 Report Summary
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Sessions"
          value={stats.totalSessions}
          icon={Timer}
        />
        <StatCard
          title="Study Time"
          value={`${Math.round(stats.productiveTime / 60)} min`}
          icon={Clock}
        />
        <StatCard
          title="Distraction Time"
          value={`${Math.round(stats.distractionTime / 60)} min`}
          icon={AlertCircle}
        />
        <StatCard
          title="Productivity"
          value={`${stats.productivePercentage}%`}
          icon={Zap}
        />
      </div>
    </div>
  );
}

export default ReportSummaryCard;
import { StatCard as UIStatCard } from "../ui/StatCard";

function StatCard({ title, value, icon, trend, subtext, className = "" }) {
  return (
    <UIStatCard
      title={title}
      value={value}
      icon={icon}
      trend={trend}
      subtext={subtext}
      className={className}
    />
  );
}

export default StatCard;
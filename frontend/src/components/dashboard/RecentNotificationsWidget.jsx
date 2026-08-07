import { Card, Badge } from "../ui";
import { Bell, CheckCircle2, Info, AlertTriangle } from "lucide-react";

function RecentNotificationsWidget({ notifications = [] }) {
  const displayList = (Array.isArray(notifications) ? notifications : []).slice(0, 5);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-primary shrink-0" />;
    }
  };

  return (
    <Card
      title="🔔 Recent Notifications"
      subtitle="Latest system and milestone updates"
      headerAction={
        <Badge variant="neutral" icon={Bell} size="sm">
          {displayList.length} New
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between"
    >
      {displayList.length === 0 ? (
        <div className="text-xs text-dark-muted py-6 text-center border border-dashed border-dark-border rounded-xl my-auto">
          No recent notifications right now.
        </div>
      ) : (
        <div className="space-y-2.5 my-1">
          {displayList.map((item, idx) => (
            <div
              key={item._id || item.id || idx}
              className="p-2.5 rounded-xl bg-dark-bg border border-dark-border flex items-start gap-2.5 transition-colors hover:border-primary/30"
            >
              {getIcon(item.type)}
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-baseline gap-2">
                  <p className="text-xs font-semibold text-dark-text truncate">
                    {item.title || item.message || "Notification"}
                  </p>
                  <span className="text-[10px] text-dark-muted shrink-0">
                    {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                  </span>
                </div>
                {item.title && item.message && (
                  <p className="text-[11px] text-dark-muted line-clamp-1 mt-0.5">
                    {item.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 text-right">
        <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">
          View All Notifications &rarr;
        </span>
      </div>
    </Card>
  );
}

export default RecentNotificationsWidget;

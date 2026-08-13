import { useState } from "react";
import { Card, Badge, Modal, Button } from "../ui";
import { Bell, CheckCircle2, Info, AlertTriangle, ChevronRight, Check, Trash2 } from "lucide-react";
import notificationService from "../../services/notificationService";

function RecentNotificationsWidget({ notifications: initialNotifications = [] }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [readMap, setReadMap] = useState({});

  const notificationsList = cleared
    ? []
    : (Array.isArray(initialNotifications) ? initialNotifications : []).map((n) =>
        readMap[n._id || n.id] ? { ...n, read: true } : n
      );

  const displayList = notificationsList.slice(0, 5);

  const getIcon = (type, sizeClass = "w-3.5 h-3.5") => {
    switch (type) {
      case "success":
        return <CheckCircle2 className={`${sizeClass} text-emerald-400 shrink-0`} />;
      case "warning":
        return <AlertTriangle className={`${sizeClass} text-amber-400 shrink-0`} />;
      default:
        return <Info className={`${sizeClass} text-primary shrink-0`} />;
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setReadMap((prev) => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error("Mark notification as read failed:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearNotifications();
      setCleared(true);
    } catch (err) {
      console.error("Clear notifications failed:", err);
    }
  };

  return (
    <>
      <Card
        title="🔔 Recent Notifications"
        subtitle="Latest system and milestone updates"
        headerAction={
          <Badge
            variant="neutral"
            icon={Bell}
            size="sm"
            className="cursor-pointer hover:border-primary/40 transition-all active:scale-95"
            onClick={() => setIsOpenModal(true)}
          >
            {notificationsList.length} Total
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
                onClick={() => setIsOpenModal(true)}
                className="p-2.5 rounded-xl bg-dark-bg border border-dark-border flex items-start gap-2.5 transition-colors hover:border-primary/30 cursor-pointer"
              >
                {getIcon(item.type)}
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <p className="text-xs font-semibold text-dark-text truncate">
                      {item.title || item.message || "Notification"}
                    </p>
                    <span className="text-[10px] text-dark-muted shrink-0">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
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
          <button
            type="button"
            onClick={() => setIsOpenModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer bg-transparent border-0 p-0 focus:outline-none transition-colors"
          >
            <span>View All Notifications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>

      {/* ALL NOTIFICATIONS MODAL */}
      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title="🔔 All Notifications & System Updates"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-dark-border">
            <p className="text-xs text-dark-muted font-medium">
              Showing all {notificationsList.length} notification updates
            </p>
            {notificationsList.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={handleClearAll}
                className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto space-y-2.5 pr-1">
            {notificationsList.length === 0 ? (
              <div className="p-8 text-center text-dark-muted text-sm font-medium border border-dashed border-dark-border rounded-xl">
                No notifications found. You're all caught up! 🎉
              </div>
            ) : (
              notificationsList.map((item, idx) => (
                <div
                  key={item._id || item.id || idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.read
                      ? "bg-dark-bg/60 border-dark-border/80 opacity-75"
                      : "bg-dark-bg border-dark-border hover:border-primary/40 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(item.type, "w-4 h-4 mt-0.5")}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-dark-text tracking-tight">
                          {item.title || "Notification"}
                        </h4>
                        <span className="text-[10px] text-dark-muted font-mono shrink-0">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </span>
                      </div>
                      <p className="text-xs text-dark-muted leading-relaxed mt-1">
                        {item.message || item.description || "System notification details"}
                      </p>
                    </div>

                    {!item.read && item._id && (
                      <button
                        title="Mark as read"
                        onClick={() => handleMarkAsRead(item._id)}
                        className="p-1 rounded-lg text-dark-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default RecentNotificationsWidget;

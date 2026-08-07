import { useEffect, useRef } from "react";
import notificationService from "../../services/notificationService";
import NotificationItem from "./NotificationItem";

function NotificationDropdown({
  notifications = [],
  open,
  reloadNotifications,
  onClose,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        if (onClose) onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);

      if (reloadNotifications) {
        reloadNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearNotifications();

      if (reloadNotifications) {
        reloadNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-12 right-0 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-dark-card border border-dark-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-200"
    >
      <div className="p-3.5 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
        <h3 className="font-bold text-sm text-dark-text tracking-tight">
          Notifications
        </h3>

        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none rounded"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-dark-border">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-dark-muted text-xs font-medium">
            No new notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleMarkAsRead(notification._id)}
              className="cursor-pointer transition-colors hover:bg-dark-border/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <NotificationItem notification={notification} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;
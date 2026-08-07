import { useEffect, useState, useCallback } from "react";
import { Bell } from "lucide-react";

import NotificationDropdown from "./NotificationDropdown";
import notificationService from "../../services/notificationService";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(() => {
    notificationService
      .getNotifications()
      .then((data) => {
        setNotifications(data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unread = notifications.filter(
    (n) => !n.read
  ).length;

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-dark-border transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />

        {unread > 0 && (
          <span className="absolute top-1 right-1 bg-primary text-dark-bg rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-md shadow-primary/30 animate-pulse">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <NotificationDropdown
        open={open}
        notifications={notifications}
        reloadNotifications={fetchNotifications}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

export default NotificationBell;
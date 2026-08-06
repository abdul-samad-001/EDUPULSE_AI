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
        setNotifications(data);
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
        className="relative p-2 rounded-full hover:bg-slate-100"
      >
        <Bell size={22} />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unread}
          </span>
        )}
      </button>

      <NotificationDropdown
        open={open}
        notifications={notifications}
        reloadNotifications={fetchNotifications}
      />
    </div>
  );
}

export default NotificationBell;
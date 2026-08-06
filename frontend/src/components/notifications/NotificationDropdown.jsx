import notificationService from "../../services/notificationService";
import NotificationItem from "./NotificationItem";

function NotificationDropdown({
  notifications = [],
  open,
  reloadNotifications,
}) {
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
    <div className="absolute top-14 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">

      <div className="p-4 border-b flex justify-between items-center">

        <h2 className="font-bold text-lg">
          Notifications
        </h2>

        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear All
          </button>
        )}

      </div>

      <div className="max-h-96 overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() =>
                handleMarkAsRead(notification._id)
              }
              className="cursor-pointer"
            >
              <NotificationItem
                notification={notification}
              />
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default NotificationDropdown;
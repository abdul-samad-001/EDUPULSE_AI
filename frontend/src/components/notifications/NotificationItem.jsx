function NotificationItem({ notification }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="px-4 py-3 border-b hover:bg-slate-50 transition">

      <div className="flex justify-between items-start">

        <div className="flex-1">

          <h4 className="font-semibold text-slate-800">
            {notification.title}
          </h4>

          <p className="text-sm text-slate-500 mt-1">
            {notification.message}
          </p>

        </div>

        {!notification.read && (
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-3"></span>
        )}

      </div>

      <p className="text-xs text-slate-400 mt-2">
        {formatDate(notification.createdAt)}
      </p>

    </div>
  );
}

export default NotificationItem;
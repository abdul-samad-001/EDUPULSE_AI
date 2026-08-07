function NotificationItem({ notification }) {
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="px-4 py-3.5 transition">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-dark-text leading-snug">
            {notification.title}
          </h4>

          <p className="text-xs text-dark-muted mt-1 leading-relaxed">
            {notification.message}
          </p>
        </div>

        {!notification.read && (
          <span className="w-2 h-2 bg-primary rounded-full mt-1 shrink-0 shadow-sm shadow-primary/50"></span>
        )}
      </div>

      <p className="text-[11px] text-dark-muted/60 mt-2 font-medium">
        {formatDate(notification.createdAt)}
      </p>
    </div>
  );
}

export default NotificationItem;
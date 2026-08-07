function Avatar({ name = "User", size = "h-20 w-20" }) {
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`${size} rounded-full bg-linear-to-tr from-primary to-emerald-500 text-dark-bg flex items-center justify-center font-bold tracking-wider border-2 border-primary/30 text-xl shadow-lg shadow-primary/10 shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

export default Avatar;
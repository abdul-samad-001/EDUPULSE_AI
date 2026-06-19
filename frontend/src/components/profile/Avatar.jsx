function Avatar({ name = "User", size = "h-20 w-20" }) {
  // Extract initials dynamically (e.g., "Abdul Samad" -> "AS")
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`${size} rounded-full bg-slate-900 text-white flex items-center justify-center font-bold tracking-wider border-2 border-slate-200 text-xl shadow-sm`}>
      {getInitials(name)}
    </div>
  );
}

export default Avatar;
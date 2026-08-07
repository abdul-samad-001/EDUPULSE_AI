import LoadingSpinner from "./LoadingSpinner";

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-[#7CE7D0] text-[#0F1115] hover:bg-[#65d6bd] font-semibold shadow-sm shadow-[#7CE7D0]/10 hover:shadow-[#7CE7D0]/20 rounded-lg sm:rounded-xl",
    secondary:
      "bg-[#262A33] text-[#F5F5F5] hover:bg-[#323742] border border-[#262A33] rounded-lg sm:rounded-xl",
    outline:
      "bg-transparent border border-[#262A33] text-[#F5F5F5] hover:bg-[#262A33]/50 hover:border-[#7CE7D0]/40 rounded-lg sm:rounded-xl",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 font-medium rounded-lg sm:rounded-xl",
    ghost:
      "bg-transparent text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#262A33]/40 rounded-lg sm:rounded-xl",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-2 text-xs sm:text-sm gap-2",
    lg: "px-5 py-2.5 text-sm gap-2 font-semibold",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
        sizeStyles[size] || sizeStyles.md
      } ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === "right" && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}

export default Button;

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertOctagon,
  warning: AlertTriangle,
  info: Sparkles,
  loading: Loader2,
};

const TOAST_STYLES = {
  success: {
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    bgGlow: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
    progressBar: "bg-gradient-to-r from-emerald-500 to-teal-400",
    badgeText: "text-emerald-400",
    accentLight: "shadow-[0_8px_30px_-4px_rgba(16,185,129,0.25)]",
  },
  error: {
    border: "border-rose-500/30 hover:border-rose-500/50",
    bgGlow: "from-rose-500/15 via-rose-500/5 to-transparent",
    iconBg: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
    progressBar: "bg-gradient-to-r from-rose-500 to-red-400",
    badgeText: "text-rose-400",
    accentLight: "shadow-[0_8px_30px_-4px_rgba(244,63,94,0.25)]",
  },
  warning: {
    border: "border-amber-500/30 hover:border-amber-500/50",
    bgGlow: "from-amber-500/15 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    progressBar: "bg-gradient-to-r from-amber-500 to-yellow-400",
    badgeText: "text-amber-400",
    accentLight: "shadow-[0_8px_30px_-4px_rgba(245,158,11,0.25)]",
  },
  info: {
    border: "border-teal-500/30 hover:border-teal-500/50",
    bgGlow: "from-[#7CE7D0]/15 via-[#7CE7D0]/5 to-transparent",
    iconBg: "bg-[#7CE7D0]/15 text-[#7CE7D0] ring-[#7CE7D0]/30",
    progressBar: "bg-gradient-to-r from-[#7CE7D0] to-cyan-400",
    badgeText: "text-[#7CE7D0]",
    accentLight: "shadow-[0_8px_30px_-4px_rgba(124,231,208,0.25)]",
  },
  loading: {
    border: "border-sky-500/30 hover:border-sky-500/50",
    bgGlow: "from-sky-500/15 via-sky-500/5 to-transparent",
    iconBg: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
    progressBar: "bg-gradient-to-r from-sky-500 to-indigo-400",
    badgeText: "text-sky-400",
    accentLight: "shadow-[0_8px_30px_-4px_rgba(56,189,248,0.25)]",
  },
};

export function ToastItem({ toastItem, onDismiss }) {
  const { id, type = "info", title, description, duration = 4000, action, icon: CustomIcon } = toastItem;
  const style = TOAST_STYLES[type] || TOAST_STYLES.info;
  const IconComponent = CustomIcon || TOAST_ICONS[type] || Info;

  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const remainingTimeRef = useRef(duration);

  useEffect(() => {
    if (!duration || duration <= 0) return;

    let timerId;
    const intervalTime = 20;

    const tick = () => {
      if (!isPaused) {
        remainingTimeRef.current -= intervalTime;
        const pct = Math.max(0, (remainingTimeRef.current / duration) * 100);
        setProgress(pct);

        if (remainingTimeRef.current <= 0) {
          onDismiss(id);
          return;
        }
      }
      timerId = setTimeout(tick, intervalTime);
    };

    timerId = setTimeout(tick, intervalTime);

    return () => clearTimeout(timerId);
  }, [id, duration, isPaused, onDismiss]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -24, scale: 0.92, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.88, y: -16, filter: "blur(2px)", transition: { duration: 0.22, ease: "easeOut" } }}
      drag="x"
      dragConstraints={{ left: 0, right: 300 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 80) {
          onDismiss(id);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative w-full sm:w-[380px] rounded-2xl border ${style.border} ${style.accentLight} bg-[#141720]/95 backdrop-blur-2xl text-slate-100 p-4 transition-all duration-300 select-none cursor-grab active:cursor-grabbing overflow-hidden group`}
    >
      {/* Dynamic Ambient Background Glow */}
      <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-gradient-to-br ${style.bgGlow} blur-2xl pointer-events-none`} />

      <div className="relative z-10 flex items-start gap-3.5">
        {/* Icon with Glowing Ring */}
        <div className={`p-2.5 rounded-xl ${style.iconBg} ring-1 shrink-0 flex items-center justify-center`}>
          <IconComponent className={`w-5 h-5 ${type === "loading" ? "animate-spin" : ""}`} />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          {title && (
            <h4 className="text-sm font-semibold text-white tracking-tight leading-snug break-words">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-xs text-slate-400 mt-1 leading-relaxed break-words font-normal">
              {description}
            </p>
          )}

          {/* Action button if provided */}
          {action && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  action.onClick?.();
                  onDismiss(id);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="p-1 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Animated Countdown Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 overflow-hidden">
          <div
            className={`h-full ${style.progressBar} transition-[width] duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed top-5 right-5 z-[99999] flex flex-col items-end gap-3 pointer-events-none max-w-full px-4 sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toastItem) => (
          <ToastItem
            key={toastItem.id}
            toastItem={toastItem}
            onDismiss={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;

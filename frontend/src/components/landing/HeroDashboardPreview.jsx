import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Code2, 
  Sparkles,
  ArrowUpRight,
  Flame
} from "lucide-react";

export default function HeroDashboardPreview() {
  const [activeMode, setActiveMode] = useState("focus");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="relative w-full max-w-lg lg:max-w-md xl:max-w-lg mx-auto"
    >
      {/* Subtle Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-teal-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-60 pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="theme-card rounded-2xl p-4 sm:p-4.5 overflow-hidden">
        
        {/* Top Window Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-dark-border">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400/80" />
            <div className="w-2 h-2 rounded-full bg-amber-400/80" />
            <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
            <span className="text-[10px] font-mono text-dark-muted pl-1.5">edupulse.ai/telemetry</span>
          </div>

          {/* Interactive Mode Pills */}
          <div className="flex items-center bg-dark-surface p-0.5 rounded-lg border border-dark-border text-[10px]">
            <button
              onClick={() => setActiveMode("focus")}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                activeMode === "focus"
                  ? "bg-dark-card text-dark-text font-semibold shadow-xs"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              Focus Mode
            </button>
            <button
              onClick={() => setActiveMode("procrastination")}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                activeMode === "procrastination"
                  ? "bg-amber-400/20 text-amber-500 dark:text-amber-300 font-semibold shadow-xs"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              Risk Alert
            </button>
          </div>
        </div>

        {/* 4 Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          
          <div className="p-2 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center justify-between text-[10px] text-dark-muted mb-0.5">
              <span className="flex items-center gap-0.5">
                <ShieldAlert className="w-3 h-3 text-emerald-500" />
                Risk
              </span>
              <span className="text-emerald-500 font-semibold">Low</span>
            </div>
            <div className="text-sm font-bold text-dark-text font-mono">18%</div>
          </div>

          <div className="p-2 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center justify-between text-[10px] text-dark-muted mb-0.5">
              <span className="flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-teal-500" />
                Score
              </span>
              <span className="text-teal-500 font-semibold">+8%</span>
            </div>
            <div className="text-sm font-bold text-dark-text font-mono">88</div>
          </div>

          <div className="p-2 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center justify-between text-[10px] text-dark-muted mb-0.5">
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-indigo-500" />
                Focus
              </span>
              <span className="text-dark-muted text-[9px]">Today</span>
            </div>
            <div className="text-sm font-bold text-dark-text font-mono">3h 40m</div>
          </div>

          <div className="p-2 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center justify-between text-[10px] text-dark-muted mb-0.5">
              <span className="flex items-center gap-0.5">
                <Flame className="w-3 h-3 text-amber-500" />
                Streak
              </span>
              <span className="text-amber-500 font-semibold">Active</span>
            </div>
            <div className="text-sm font-bold text-dark-text font-mono">6 Days</div>
          </div>

        </div>

        {/* Dynamic State Card */}
        <AnimatePresence mode="wait">
          {activeMode === "focus" ? (
            <motion.div
              key="focus-card"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="text-[11px] text-dark-text leading-snug">
                <span className="font-semibold text-emerald-600 dark:text-emerald-300">Deep Focus:</span> 45 min uninterrupted work on <em>Docker Microservices</em>.
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="alert-card"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2"
            >
              <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-3 h-3 text-amber-500" />
              </div>
              <div className="text-[11px] text-dark-text leading-snug">
                <span className="font-semibold text-amber-600 dark:text-amber-300">Risk Signal:</span> 22m entertainment. Recommendation: Take a 5m break then resume Day 3 roadmap.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Activity Stream */}
        <div className="rounded-xl bg-dark-surface border border-dark-border p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold text-dark-muted mb-0.5">
            <span>Activity Stream</span>
            <span className="text-emerald-500 font-mono text-[9px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time
            </span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-dark-card border border-dark-border text-xs">
            <div className="flex items-center gap-1.5">
              <Code2 className="w-3 h-3 text-purple-400" />
              <span className="font-medium text-dark-text text-[11px]">VS Code — container_service.py</span>
            </div>
            <span className="font-mono text-[9px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
              Deep Work
            </span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-dark-card border border-dark-border text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="font-medium text-dark-text text-[11px]">YouTube — Harvard CS50</span>
            </div>
            <span className="font-mono text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              Educational <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

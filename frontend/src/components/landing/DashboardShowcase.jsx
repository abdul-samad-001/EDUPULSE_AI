import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Clock, 
  Map, 
  Award,
  Sparkles,
  Flame,
  CheckCircle2
} from "lucide-react";

export default function DashboardShowcase() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Procrastination Overview", icon: ShieldAlert },
    { id: "focus", label: "Focus Telemetry", icon: Clock },
    { id: "roadmap", label: "AI Roadmap", icon: Map },
    { id: "progress", label: "Milestones & XP", icon: Award },
  ];

  return (
    <section id="preview" className="py-14 sm:py-18 relative bg-dark-bg overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-6 sm:mb-8"
        >
          <span className="text-[11px] font-mono font-semibold text-teal-500 uppercase tracking-widest block mb-1">
            Product Preview
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-dark-text tracking-tight">
            See EduPulse in action.
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-dark-muted">
            A cohesive student dashboard engineered to help you conquer procrastination and complete your goals.
          </p>
        </motion.div>

        {/* Tab Controls with Layout Animation */}
        <div className="flex items-center justify-center gap-1 pb-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? "text-dark-text font-semibold" : "text-dark-muted hover:text-dark-text"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-dark-card border border-dark-border rounded-lg shadow-xs"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Browser Shell */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl theme-card overflow-hidden"
        >
          
          {/* Top Address Bar */}
          <div className="px-4 py-2.5 bg-dark-surface border-b border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400/80" />
              <div className="w-2 h-2 rounded-full bg-amber-400/80" />
              <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
              <span className="text-[10px] font-mono text-dark-muted pl-1.5">app.edupulse.ai/dashboard</span>
            </div>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Live Sync
            </span>
          </div>

          {/* Tab Content Display */}
          <div className="p-4 sm:p-6 min-h-[260px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-dark-text">
                          AI Intelligence: Procrastination Risk is <span className="text-emerald-500 font-bold">Low (18%)</span>
                        </div>
                        <div className="text-[10px] text-dark-muted">
                          Active task: "Full-Stack Authentication" · Estimated 20m remaining
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-mono font-semibold shrink-0">
                      Real-Time Model
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-xl bg-dark-surface border border-dark-border">
                      <div className="text-[10px] text-dark-muted">Focus Time</div>
                      <div className="text-base font-bold text-dark-text font-mono mt-0.5">4h 12m</div>
                      <div className="text-[9px] text-teal-600 dark:text-teal-400 mt-0.5">+18% today</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-dark-surface border border-dark-border">
                      <div className="text-[10px] text-dark-muted">Tasks Completed</div>
                      <div className="text-base font-bold text-dark-text font-mono mt-0.5">12 / 15</div>
                      <div className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">80% Completion</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-dark-surface border border-dark-border">
                      <div className="text-[10px] text-dark-muted">Productivity Score</div>
                      <div className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono mt-0.5">88 / 100</div>
                      <div className="text-[9px] text-dark-muted mt-0.5">Optimal Range</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-dark-surface border border-dark-border">
                      <div className="text-[10px] text-dark-muted">Active Streak</div>
                      <div className="text-base font-bold text-amber-500 font-mono mt-0.5 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        7 Days
                      </div>
                      <div className="text-[9px] text-amber-600 dark:text-amber-400 mt-0.5">+240 XP</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "focus" && (
                <motion.div
                  key="focus"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  <div className="p-3 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-dark-text">Active Focus Session</div>
                      <div className="text-[10px] text-dark-muted mt-0.5">Goal: Dockerfile Architecture & Container Optimization</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-xs font-mono font-semibold">
                      25:00 Interval
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-surface border border-dark-border text-xs text-dark-muted flex items-center justify-between">
                    <span className="text-[11px]">Background Tab Telemetry Active</span>
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-semibold text-[10px]">98% Productive Ratio</span>
                  </div>
                </motion.div>
              )}

              {activeTab === "roadmap" && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  <div className="text-xs font-semibold text-dark-text">Docker & Kubernetes Roadmap (5-Day Plan)</div>
                  <div className="grid sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                      <div className="flex items-center justify-between font-semibold text-[10px]">Day 1 <CheckCircle2 className="w-3 h-3" /></div>
                      <div className="text-dark-text text-xs mt-0.5 font-medium">Containers vs VM</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                      <div className="flex items-center justify-between font-semibold text-[10px]">Day 2 <CheckCircle2 className="w-3 h-3" /></div>
                      <div className="text-dark-text text-xs mt-0.5 font-medium">Images & Dockerfile</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-600 dark:text-purple-200">
                      <div className="flex items-center justify-between font-semibold text-[10px]">Day 3 <Sparkles className="w-3 h-3 text-teal-400" /></div>
                      <div className="text-dark-text text-xs mt-0.5 font-medium">Docker Compose</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "progress" && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  <div className="p-3 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-dark-text">Level 4 · Deep Work Specialist</div>
                      <div className="text-sm font-bold text-amber-500 font-mono mt-0.5">1,840 / 2,000 XP</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-300 text-xs font-mono font-semibold">
                      Top 5% Student
                    </span>
                  </div>
                  <div className="w-full bg-dark-surface h-1.5 rounded-full overflow-hidden border border-dark-border">
                    <div className="bg-gradient-to-r from-amber-400 to-teal-400 h-full rounded-full" style={{ width: "92%" }} />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </motion.div>

      </div>
    </section>
  );
}

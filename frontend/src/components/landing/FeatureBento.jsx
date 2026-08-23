import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  Video, 
  Zap, 
  Map, 
  Compass, 
  Flame, 
  CheckCircle2, 
  Lock,
  ArrowUpRight 
} from "lucide-react";

export default function FeatureBento() {
  return (
    <section id="features" className="py-14 sm:py-18 relative bg-dark-surface/50 border-t border-b border-dark-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-8 sm:mb-10"
        >
          <span className="text-[11px] font-mono font-semibold text-teal-500 uppercase tracking-widest block mb-1">
            Core Intelligence
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-dark-text tracking-tight">
            Engineered for genuine student focus.
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-dark-muted">
            Intelligent activity detection, automatic content filtering, and day-wise mastery roadmaps.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* 1. AI Procrastination Detection (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="md:col-span-7 rounded-2xl theme-card p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Behavioral Signal Analysis</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-dark-text mb-1">
                AI Procrastination Detection
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed mb-3">
                Analyzes idle intervals, distraction frequencies, and submission offsets to estimate procrastination risk before it impacts your grades.
              </p>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-xl bg-dark-surface border border-dark-border text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="text-dark-text font-medium text-[11px]">Continuous Risk Evaluation</span>
              </div>
              <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-semibold">
                81.88% Accuracy
              </span>
            </div>
          </motion.div>

          {/* 2. Smart YouTube Classification (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="md:col-span-5 rounded-2xl theme-card p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>Selective Categorization</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-dark-text mb-1">
                Smart YouTube Classification
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed mb-2.5">
                Distinguishes educational content from entertainment instead of simply blocking video platforms.
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-600 dark:text-emerald-300 font-medium">
                <span>CS50 Python Lecture</span>
                <span className="font-semibold uppercase">Productive</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-600 dark:text-rose-300 font-medium">
                <span>Gaming Highlights</span>
                <span className="font-semibold uppercase">Distraction</span>
              </div>
            </div>
          </motion.div>

          {/* 3. Productivity Intelligence (Span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="md:col-span-4 rounded-2xl theme-card p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-500 mb-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Focus Metrics</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-dark-text mb-1">
                Productivity Intelligence
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed mb-2.5">
                Tracks deep work duration, productivity score, and daily activity trends.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between text-xs">
              <span className="text-dark-muted text-[11px]">Score</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono font-bold">88 / 100</span>
            </div>
          </motion.div>

          {/* 4. AI Roadmap Generator (Span 8) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="md:col-span-8 rounded-2xl theme-card p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                  <Map className="w-3.5 h-3.5" />
                  <span>Curriculum Synthesis</span>
                </div>
                <span className="text-[10px] font-mono text-dark-muted">Target: "Learn Docker"</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-dark-text mb-1">
                AI Roadmap Generator
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed mb-2.5">
                Breaks complex study subjects into day-wise task milestones with strict streak deadlines.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                <div className="flex items-center justify-between text-[8px] font-semibold">Day 1 <CheckCircle2 className="w-2.5 h-2.5" /></div>
                <div className="text-[10px] truncate font-medium mt-0.5">Containers</div>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                <div className="flex items-center justify-between text-[8px] font-semibold">Day 2 <CheckCircle2 className="w-2.5 h-2.5" /></div>
                <div className="text-[10px] truncate font-medium mt-0.5">Images</div>
              </div>
              <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-600 dark:text-purple-200">
                <div className="flex items-center justify-between text-[8px] font-semibold">Day 3 <span className="text-teal-400 text-[7px]">ACTIVE</span></div>
                <div className="text-[10px] truncate font-medium mt-0.5">Compose</div>
              </div>
              <div className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-dark-muted hidden sm:block">
                <div className="flex items-center justify-between text-[8px]">Day 4 <Lock className="w-2.5 h-2.5" /></div>
                <div className="text-[10px] truncate font-medium mt-0.5">Network</div>
              </div>
              <div className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-dark-muted hidden sm:block">
                <div className="flex items-center justify-between text-[8px]">Day 5 <Lock className="w-2.5 h-2.5" /></div>
                <div className="text-[10px] truncate font-medium mt-0.5">Deploy</div>
              </div>
            </div>
          </motion.div>

          {/* 5. Tasks & Progress (Span 6) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="md:col-span-6 rounded-2xl theme-card p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 mb-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Streak Engine</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-dark-text mb-1">
                Tasks & Progress Tracking
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed mb-2.5">
                Maintains multi-day study streaks and task completion tracking with automated deadline checks.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between text-xs">
              <span className="text-dark-text text-[11px]">Milestones Finished</span>
              <span className="text-amber-500 font-mono font-bold text-[11px]">6 Consecutive Days</span>
            </div>
          </motion.div>

          {/* 6. Personalized Recommendations (Span 6) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="md:col-span-6 rounded-2xl theme-card p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-500 mb-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Contextual Guidance</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-dark-text mb-1">
                Personalized Actions
              </h3>
              <p className="text-xs text-dark-muted leading-relaxed mb-2.5">
                Real-time contextual advice derived from your focus trends.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-700 dark:text-cyan-200 flex items-center justify-between">
              <span>"Focus drops after 8 PM. Schedule deep tasks earlier."</span>
              <ArrowUpRight className="w-3 h-3 text-cyan-500 shrink-0 ml-1" />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

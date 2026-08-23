import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import HeroDashboardPreview from "./HeroDashboardPreview";

export default function Hero() {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden bg-ambient-hero subtle-grid">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-4 text-center lg:text-left"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-xs font-medium text-dark-muted shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>AI-Powered Student Productivity</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold tracking-tight text-dark-text leading-[1.15]">
                Your browser knows you're procrastinating.
              </h1>
              <div className="text-xl sm:text-2xl lg:text-[30px] font-extrabold text-gradient-accent tracking-tight leading-[1.15]">
                EduPulse AI does something about it.
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-dark-muted font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
              EduPulse AI understands how you study, detects productivity patterns, identifies procrastination, and gives you personalized actions to stay on track.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 pt-1">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:opacity-90 transition-all shadow-xs group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                onClick={scrollToFeatures}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-dark-muted hover:text-dark-text bg-dark-card hover:bg-dark-card-hover border border-dark-border transition-colors cursor-pointer"
              >
                <span>Explore Features</span>
              </button>
            </div>

            {/* Micro Feature Bullets */}
            <div className="pt-3 border-t border-dark-border flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-xs text-dark-muted font-medium">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-teal-400" />
                Real-time tracking
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-teal-400" />
                Contextual insights
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-teal-400" />
                AI roadmaps
              </span>
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="lg:col-span-6">
            <HeroDashboardPreview />
          </div>

        </div>
      </div>
    </section>
  );
}

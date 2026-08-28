import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";
import logoImg from "../../assets/logo.png";

export default function CTASection() {
  return (
    <section className="py-14 sm:py-18 relative bg-dark-bg overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl theme-card p-6 sm:p-10 shadow-xl overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Badge */}
          <div className="flex justify-center mb-4 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-linear-to-r from-purple-500 via-indigo-500 to-teal-400 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-300" />
              <img
                src={logoImg}
                alt="EduPulse AI Logo"
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-xl border-2 border-white/10 group-hover:scale-105 transition-transform duration-300 bg-dark-bg"
              />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-dark-text tracking-tight relative z-10">
            Stop guessing where your time goes.
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-dark-muted max-w-md mx-auto leading-relaxed relative z-10">
            Understand your study habits. Detect procrastination in real time. Build consistent momentum with AI roadmaps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-5 relative z-10">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-purple-600 to-teal-500 hover:opacity-90 transition-all shadow-xs group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-dark-muted hover:text-dark-text bg-dark-surface hover:bg-dark-card-hover border border-dark-border transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

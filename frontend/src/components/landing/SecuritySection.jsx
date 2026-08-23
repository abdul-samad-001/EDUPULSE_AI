import { motion } from "framer-motion";
import { UserCheck, Lock, EyeOff } from "lucide-react";

export default function SecuritySection() {
  const items = [
    {
      icon: UserCheck,
      title: "User Data Isolation",
      description: "Every telemetry log, focus session, and roadmap is strictly scoped to your private user account.",
    },
    {
      icon: Lock,
      title: "Secure Authentication",
      description: "Stateless JWT authentication and industry-standard password hashing with zero plaintext storage.",
    },
    {
      icon: EyeOff,
      title: "Client-Controlled Telemetry",
      description: "You retain full control over activity tracking. Pause or toggle tracking anytime with one click.",
    },
  ];

  return (
    <section id="privacy" className="py-14 sm:py-18 relative bg-dark-surface/40 border-t border-b border-dark-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-8"
        >
          <span className="text-[11px] font-mono font-semibold text-emerald-500 uppercase tracking-widest block mb-1">
            Privacy & Trust
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-dark-text tracking-tight">
            Your data should work for you — not against you.
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-dark-muted">
            Engineered with strict privacy boundaries and authenticated API isolation.
          </p>
        </motion.div>

        {/* 3 Columns */}
        <div className="grid md:grid-cols-3 gap-3">
          {items.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="p-4 sm:p-5 rounded-2xl theme-card"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-2.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-dark-text mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

import { Badge, Button } from "../ui";
import { BookOpen, Sparkles, Target, CheckCircle2, TrendingUp, Plus } from "lucide-react";

function SkillsHero({ skills = [], onAddSkillClick }) {
  const totalSkills = skills.length;
  const activeSkills = skills.filter((s) => (s.progress || 0) < 100).length;
  const completedSkills = skills.filter((s) => (s.progress || 0) === 100).length;
  
  const totalProgress = skills.reduce((sum, s) => sum + (s.progress || 0), 0);
  const avgProgress = totalSkills > 0 ? Math.round(totalProgress / totalSkills) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-primary/30">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: Heading & Subtitle */}
        <div className="space-y-3 max-w-2xl">
          <Badge variant="primary" icon={Sparkles} size="sm">
            AI-Powered Skill Library
          </Badge>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-dark-text tracking-tight">
              What are you learning? 🚀
            </h1>
            <p className="text-sm sm:text-base text-dark-muted mt-1.5 leading-relaxed font-medium">
              Track your skills, follow AI-generated roadmaps, and master your learning journey step-by-step.
            </p>
          </div>
        </div>

        {/* Right Column: Key Stats & CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 w-full lg:w-auto shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full sm:w-auto">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-primary text-[11px] font-bold uppercase mb-0.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Total</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {totalSkills}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold uppercase mb-0.5">
                <Target className="w-3.5 h-3.5" />
                <span>Active</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {activeSkills}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold uppercase mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Done</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {completedSkills}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-bg/80 border border-dark-border min-w-24 text-center">
              <div className="flex items-center gap-1 text-sky-400 text-[11px] font-bold uppercase mb-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Avg Progress</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-dark-text">
                {avgProgress}%
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={onAddSkillClick}
            className="shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
          >
            New Skill
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SkillsHero;

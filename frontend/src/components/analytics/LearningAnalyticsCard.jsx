import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, StatCard } from "../ui";
import { BookOpen, CheckCircle2, Award, TrendingUp, Layers, Flag } from "lucide-react";

function LearningAnalyticsCard({ skillData = null }) {
  const [viewMode, setViewMode] = useState("week"); // day | week | month

  const started = skillData?.skillsStarted ?? 0;
  const completed = skillData?.skillsCompleted ?? 0;
  const tasksDone = skillData?.tasksCompleted ?? 0;
  const roadmapProgress = skillData?.roadmapProgress ?? 0;
  const completionRate = skillData?.skillCompletionPercentage ?? 0;

  const hoursPerSkill = (skillData?.hoursPerSkill && skillData.hoursPerSkill.length > 0)
    ? skillData.hoursPerSkill
    : [];

  const taskCompletion = (skillData?.taskCompletion && skillData.taskCompletion.length > 0)
    ? skillData.taskCompletion
    : [];

  return (
    <Card
      title="📚 Skill Mastery & Category Completion"
      subtitle="Track domain hours logged and milestone achievement rates"
      headerAction={
        <div className="flex items-center gap-1 bg-dark-bg p-1 rounded-xl border border-dark-border">
          {[
            { id: "day", label: "Day" },
            { id: "week", label: "Week" },
            { id: "month", label: "Month" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === mode.id
                  ? "bg-primary text-dark-bg shadow-xs"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      }
      className="w-full"
    >
      <div className="space-y-4 pt-1">
        {/* Metric Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <StatCard
            title="Skills Started"
            value={started}
            icon={BookOpen}
            subtext="Learning tracks"
          />
          <StatCard
            title="Mastered"
            value={completed}
            icon={CheckCircle2}
            subtext="100% completed"
          />
          <StatCard
            title="Tasks Done"
            value={tasksDone}
            icon={Award}
            subtext="Milestones done"
          />
          <StatCard
            title="Roadmap Avg"
            value={`${roadmapProgress}%`}
            icon={TrendingUp}
            subtext="Mean progress"
          />
          <StatCard
            title="Finish Ratio"
            value={`${completionRate}%`}
            icon={Layers}
            subtext="Domain finish"
          />
        </div>

        {/* Dual Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* Chart 1: Hours per Skill */}
          <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border space-y-1.5">
            <h4 className="text-[11px] font-extrabold uppercase text-dark-muted tracking-wider">
              Hours Logged per Skill ({viewMode.toUpperCase()})
            </h4>
            <div className="h-52 w-full flex items-center justify-center">
              {hoursPerSkill.length === 0 ? (
                <div className="text-center space-y-1">
                  <BookOpen className="w-6 h-6 text-dark-muted mx-auto" />
                  <p className="text-xs text-dark-muted font-bold">No skills added yet</p>
                  <p className="text-[10px] text-dark-muted/70">Create skills in the Skills tab to view domain hours.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hoursPerSkill} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="skillName" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit="h" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-dark-card border border-dark-border text-dark-text p-2 rounded-lg text-xs font-semibold shadow-xl">
                              <p className="text-primary font-bold">{payload[0].payload.skillName}</p>
                              <p>{payload[0].value} hours logged</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="hours" fill="#2dd4bf" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Task Completion per Category */}
          <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border space-y-1.5">
            <h4 className="text-[11px] font-extrabold uppercase text-dark-muted tracking-wider">
              Milestone Progress by Category
            </h4>
            <div className="h-52 w-full flex items-center justify-center">
              {taskCompletion.length === 0 ? (
                <div className="text-center space-y-1">
                  <Flag className="w-6 h-6 text-dark-muted mx-auto" />
                  <p className="text-xs text-dark-muted font-bold">No milestone categories yet</p>
                  <p className="text-[10px] text-dark-muted/70">Milestones will appear as you build learning roadmaps.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskCompletion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="completed" name="Completed" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total" name="Total" fill="#334155" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default LearningAnalyticsCard;

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
import { BookOpen, CheckCircle2, Award, TrendingUp, Layers } from "lucide-react";

function LearningAnalyticsCard({ skillData = null }) {
  const [viewMode, setViewMode] = useState("week"); // day | week | month

  const started = skillData?.skillsStarted || 8;
  const completed = skillData?.skillsCompleted || 3;
  const tasksDone = skillData?.tasksCompleted || 28;
  const roadmapProgress = skillData?.roadmapProgress || 65;
  const completionRate = skillData?.skillCompletionPercentage || 38;

  const dayHours = [
    { skillName: "React.js", hours: 2.5 },
    { skillName: "Node.js", hours: 1.8 },
    { skillName: "Python", hours: 1.2 },
    { skillName: "FastAPI", hours: 0.8 },
    { skillName: "Docker", hours: 0.5 },
  ];

  const weekHours = skillData?.hoursPerSkill || [
    { skillName: "React.js", hours: 14.5 },
    { skillName: "Node.js", hours: 10.2 },
    { skillName: "Python", hours: 8.0 },
    { skillName: "FastAPI", hours: 6.5 },
    { skillName: "Docker", hours: 4.0 },
  ];

  const monthHours = [
    { skillName: "React.js", hours: 52.0 },
    { skillName: "Node.js", hours: 38.5 },
    { skillName: "Python", hours: 29.0 },
    { skillName: "FastAPI", hours: 22.0 },
    { skillName: "Docker", hours: 16.0 },
  ];

  const taskCompletion = skillData?.taskCompletion || [
    { category: "Web Dev", completed: 14, total: 18 },
    { category: "Backend", completed: 8, total: 10 },
    { category: "AI/ML", completed: 6, total: 12 },
    { category: "DevOps", completed: 4, total: 6 },
  ];

  const activeHoursData = viewMode === "day" ? dayHours : viewMode === "week" ? weekHours : monthHours;

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
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            </div>
          </div>

          {/* Chart 2: Task Completion per Category */}
          <div className="bg-dark-bg p-3.5 rounded-xl border border-dark-border space-y-1.5">
            <h4 className="text-[11px] font-extrabold uppercase text-dark-muted tracking-wider">
              Milestone Progress by Category
            </h4>
            <div className="h-52 w-full">
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
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default LearningAnalyticsCard;

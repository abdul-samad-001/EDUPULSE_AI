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
  const started = skillData?.skillsStarted || 8;
  const completed = skillData?.skillsCompleted || 3;
  const tasksDone = skillData?.tasksCompleted || 28;
  const roadmapProgress = skillData?.roadmapProgress || 65;
  const completionRate = skillData?.skillCompletionPercentage || 38;

  const hoursPerSkill = skillData?.hoursPerSkill || [
    { skillName: "React.js", hours: 14.5, progress: 85 },
    { skillName: "Node.js", hours: 10.2, progress: 70 },
    { skillName: "Python", hours: 8.0, progress: 50 },
    { skillName: "FastAPI", hours: 6.5, progress: 40 },
    { skillName: "Docker", hours: 4.0, progress: 25 },
  ];

  const taskCompletion = skillData?.taskCompletion || [
    { category: "Web Dev", completed: 14, total: 18 },
    { category: "Backend", completed: 8, total: 10 },
    { category: "AI/ML", completed: 6, total: 12 },
    { category: "DevOps", completed: 4, total: 6 },
  ];

  return (
    <Card
      title="📚 Skill Mastery & Task Completion Bar Charts"
      subtitle="Track domain hours logged and milestone achievement rates"
      className="w-full"
    >
      <div className="space-y-5 pt-1">
        {/* Metric Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            title="Skills Started"
            value={started}
            icon={BookOpen}
            subtext="Learning tracks"
          />
          <StatCard
            title="Skills Mastered"
            value={completed}
            icon={CheckCircle2}
            subtext="100% completed"
          />
          <StatCard
            title="Tasks Finished"
            value={tasksDone}
            icon={Award}
            subtext="Milestones done"
          />
          <StatCard
            title="Roadmap Avg"
            value={`${roadmapProgress}%`}
            icon={TrendingUp}
            subtext="Mean mastery progress"
          />
          <StatCard
            title="Completion Rate"
            value={`${completionRate}%`}
            icon={Layers}
            subtext="Domain finish ratio"
          />
        </div>

        {/* Dual Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
          {/* Chart 1: Hours per Skill */}
          <div className="bg-dark-bg p-3.5 sm:p-4 rounded-xl border border-dark-border space-y-2">
            <h4 className="text-xs font-extrabold uppercase text-dark-muted tracking-wider">
              Hours Logged per Skill Track
            </h4>
            <div className="h-56 w-full">
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
                  <Bar dataKey="hours" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Task Completion per Category */}
          <div className="bg-dark-bg p-3.5 sm:p-4 rounded-xl border border-dark-border space-y-2">
            <h4 className="text-xs font-extrabold uppercase text-dark-muted tracking-wider">
              Milestone Progress by Category
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskCompletion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="completed" name="Completed Tasks" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" name="Total Tasks" fill="#334155" radius={[4, 4, 0, 0]} />
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

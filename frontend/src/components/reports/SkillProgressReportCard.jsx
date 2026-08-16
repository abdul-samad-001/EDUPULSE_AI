import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, Progress, Badge } from "../ui";
import { BookOpen } from "lucide-react";

function SkillProgressReportCard({ skillsProgress = [] }) {
  const fallbackSkills = [
    { _id: "1", skillName: "React.js", category: "Web Dev", progress: 85, hours: 14.5, completedTasks: 12, remainingTasks: 3, estFinish: "~1 week" },
    { _id: "2", skillName: "Node.js & Express", category: "Backend", progress: 70, hours: 10.2, completedTasks: 8, remainingTasks: 4, estFinish: "~2 weeks" },
    { _id: "3", skillName: "Python Data Science", category: "Data Science", progress: 50, hours: 8.0, completedTasks: 6, remainingTasks: 6, estFinish: "~3 weeks" },
  ];

  const data = (Array.isArray(skillsProgress) && skillsProgress.length > 0)
    ? skillsProgress
    : fallbackSkills;

  const chartData = data.map((s) => ({
    name: s.skillName,
    progress: s.progress || 0,
    completed: s.completedTasks || Math.round((s.progress || 0) * 0.15),
  }));

  return (
    <Card
      title="📊 Skill Mastery & Progress Report"
      subtitle="Comprehensive breakdown of domain mastery levels and milestone remaining counts"
      className="w-full"
    >
      <div className="space-y-5 pt-1">
        {/* Recharts Bar Chart */}
        <div className="bg-dark-bg p-3.5 sm:p-4 rounded-xl border border-dark-border space-y-2">
          <h4 className="text-xs font-extrabold uppercase text-dark-muted tracking-wider">
            Domain Progress (%) Chart
          </h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-dark-card border border-dark-border text-dark-text p-2 rounded-lg text-xs font-semibold shadow-xl">
                          <p className="text-primary font-bold">{payload[0].payload.name}</p>
                          <p>Progress: {payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="progress" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Skill Rows */}
        <div className="space-y-3">
          {data.map((sk) => {
            const prog = sk.progress || 0;
            const isDone = prog === 100;
            return (
              <div
                key={sk._id || sk.skillName}
                className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-extrabold text-sm text-dark-text">{sk.skillName}</span>
                    <Badge variant="neutral" size="sm">
                      {sk.category || "General"}
                    </Badge>
                  </div>
                  <Badge variant={isDone ? "success" : "primary"} size="sm">
                    {prog}% Mastered
                  </Badge>
                </div>

                <Progress value={prog} max={100} size="sm" color={isDone ? "success" : "primary"} />

                <div className="grid grid-cols-3 gap-2 text-center text-xs text-dark-muted pt-1">
                  <span>Hours: <strong className="text-dark-text">{sk.hours || (prog * 0.15).toFixed(1)}h</strong></span>
                  <span>Done: <strong className="text-emerald-400">{sk.completedTasks || Math.round(prog * 0.15)}</strong></span>
                  <span>Est Finish: <strong className="text-amber-400">{sk.estFinish || "~2 wks"}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default SkillProgressReportCard;

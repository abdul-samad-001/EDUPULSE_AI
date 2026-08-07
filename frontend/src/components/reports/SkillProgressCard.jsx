import { Card, Progress } from "../ui";

function SkillProgressCard({ skills = [] }) {
  return (
    <Card title="📚 Skill Progress" className="w-full">
      {skills.length === 0 ? (
        <p className="text-xs text-dark-muted py-4 text-center border border-dashed border-dark-border rounded-xl">
          No skill progress recorded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill._id} className="space-y-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-dark-text">{skill.skillName}</span>
                <span className="text-primary">{skill.progress}%</span>
              </div>

              <Progress value={skill.progress} size="sm" color="primary" />

              <div className="text-[11px] text-dark-muted mt-1 flex items-center gap-3">
                <span>Category: {skill.category}</span>
                <span>Day: {skill.currentDay}</span>
                <span className="text-amber-400 font-semibold">🔥 {skill.streakCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default SkillProgressCard;
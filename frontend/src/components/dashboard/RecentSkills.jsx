import { useNavigate } from "react-router-dom";
import { Card, Badge, Progress, Button } from "../ui";
import { BookOpen, ArrowRight } from "lucide-react";

function RecentSkills({ skills }) {
  const navigate = useNavigate();

  let safeSkillsArray = [];
  if (Array.isArray(skills)) {
    safeSkillsArray = skills;
  } else if (skills && typeof skills === "object") {
    safeSkillsArray = skills.recentSkills || skills.data || skills.skills || [];
  }

  const displayList = safeSkillsArray.slice(0, 4);

  return (
    <Card
      title="📚 Recent Skills & Progress"
      subtitle="Latest learning tracks and active milestones"
      headerAction={
        <Badge variant="primary" icon={BookOpen} size="sm">
          {safeSkillsArray.length} Active
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between"
    >
      {displayList.length === 0 ? (
        <div className="text-xs text-dark-muted py-6 text-center border border-dashed border-dark-border rounded-xl my-auto">
          No skills added yet. Click below to create your first learning track!
        </div>
      ) : (
        <div className="space-y-3 my-1">
          {displayList.map((skill) => (
            <div
              key={skill._id || skill.id}
              className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-2 transition-all hover:border-primary/40"
            >
              <div className="flex justify-between items-center">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-dark-text truncate">
                    {skill.skillName || skill.name}
                  </p>
                  <p className="text-[10px] text-dark-muted truncate">
                    {skill.category || "General Track"}
                  </p>
                </div>
                <Badge variant="neutral" size="sm" className="shrink-0">
                  {skill.progress || 0}%
                </Badge>
              </div>

              <Progress value={skill.progress || 0} max={100} size="sm" color="primary" />
            </div>
          ))}
        </div>
      )}

      <div className="pt-3">
        <Button
          variant="outline"
          fullWidth
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => navigate("/skills")}
        >
          Continue Learning & Manage Skills
        </Button>
      </div>
    </Card>
  );
}

export default RecentSkills;
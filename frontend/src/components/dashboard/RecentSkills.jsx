import { Card, Badge } from "../ui";
import { BookOpen } from "lucide-react";

function RecentSkills({ skills }) {
  let safeSkillsArray = [];
  
  if (Array.isArray(skills)) {
    safeSkillsArray = skills;
  } else if (skills && typeof skills === "object") {
    safeSkillsArray = skills.recentSkills || skills.data || skills.skills || [];
  }

  return (
    <Card
      title="Recent Skills"
      subtitle="Your latest tracking footprints"
      className="w-full"
    >
      {safeSkillsArray.length === 0 ? (
        <div className="text-xs text-dark-muted py-4 text-center border border-dashed border-dark-border rounded-xl">
          No recent skills added yet.
        </div>
      ) : (
        <div className="space-y-2">
          {safeSkillsArray.map((skill) => (
            <div
              key={skill._id || skill.id}
              className="p-2 px-3 rounded-xl bg-dark-bg border border-dark-border flex justify-between items-center"
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-semibold text-dark-text truncate">
                  {skill.skillName || skill.name}
                </p>
                <p className="text-[10px] text-dark-muted truncate">
                  {skill.category || skill.status || "General"}
                </p>
              </div>
              <Badge variant="primary" icon={BookOpen} size="sm" className="shrink-0">
                Skill
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentSkills;
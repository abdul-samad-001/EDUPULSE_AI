import SkillCard from "./SkillCard";
import EmptySkills from "./EmptySkills";

function SkillList({ skills, onProgressUpdate, onEditTrigger, onDeleteTrigger, onOpenModal }) {
  // Defensive Check: Ensure skills is safely treated as an array even if wrapped in an object wrapper
  const skillsArray = Array.isArray(skills)
    ? skills
    : (skills && Array.isArray(skills.skills))
      ? skills.skills
      : [];

  if (skillsArray.length === 0) {
    return <EmptySkills onOpenModal={onOpenModal} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skillsArray.map((skill) => (
        <SkillCard
          key={skill._id}
          skill={skill}
          onProgressUpdate={onProgressUpdate}
          onEditTrigger={onEditTrigger}
          onDeleteTrigger={onDeleteTrigger}
        />
      ))}
    </div>
  );
}

export default SkillList;
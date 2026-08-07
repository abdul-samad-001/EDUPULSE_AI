import SkillCard from "./SkillCard";
import EmptySkills from "./EmptySkills";
import AISuggestionCard from "./AISuggestionCard";

function SkillList({
  skills = [],
  onProgressUpdate,
  onEditTrigger,
  onDeleteTrigger,
  onOpenModal,
  onAddSuggested,
}) {
  const skillsArray = Array.isArray(skills)
    ? skills
    : (skills && Array.isArray(skills.skills))
      ? skills.skills
      : [];

  if (skillsArray.length === 0) {
    return <EmptySkills onOpenModal={onOpenModal} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {skillsArray.map((skill) => (
        <SkillCard
          key={skill._id}
          skill={skill}
          onProgressUpdate={onProgressUpdate}
          onEditTrigger={onEditTrigger}
          onDeleteTrigger={onDeleteTrigger}
        />
      ))}
      <AISuggestionCard onAddSuggested={onAddSuggested} />
    </div>
  );
}

export default SkillList;
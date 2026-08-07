import { useState, useEffect } from "react";
import skillService from "../services/skillService";

import SkillList from "../components/skills/SkillList";
import AddSkillModal from "../components/skills/AddSkillModal";
import EditSkillModal from "../components/skills/EditSkillModal";
import DeleteSkillModal from "../components/skills/DeleteSkillModal";

import { SectionHeader, Button, LoadingSpinner, Card } from "../components/ui";
import { BookOpen, Plus, AlertCircle } from "lucide-react";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeEditTarget, setActiveEditTarget] = useState(null);
  const [activeDeleteTarget, setActiveDeleteTarget] = useState(null);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await skillService.getAllSkills();
      setSkills(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      await loadSkills();
    };

    fetchSkills();
  }, []);

  const handleAddSkillSubmit = async (name, category) => {
    try {
      const added = await skillService.createSkill(name, category);
      setSkills((prev) => [...prev, added]);
    } catch (err) {
      console.error(err);
      alert("Unable to create skill.");
    }
  };

  const handleEditSkillSubmit = async (id, fields) => {
    try {
      const updated = await skillService.updateSkill(id, fields);
      setSkills((prev) =>
        prev.map((s) => (s._id === id ? updated : s))
      );
    } catch (err) {
      console.error(err);
      alert("Unable to update skill.");
    }
  };

  const handleDeleteSkillSubmit = async (id) => {
    try {
      await skillService.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Unable to delete skill.");
    }
  };

  const handleProgressPipelineUpdate = (
    id,
    progress,
    streakFields = {}
  ) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill._id === id
          ? {
              ...skill,
              progress,
              completed: progress === 100,
              ...streakFields,
            }
          : skill
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading your skills..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="max-w-md text-center p-8">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark-text mb-4">{error}</h2>
          <Button variant="primary" onClick={loadSkills}>
            Retry Loading
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Skills & Roadmap 📚"
        subtitle="Manage your learning roadmap, track skill levels, and update progress."
        icon={BookOpen}
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddOpen(true)}
          >
            Add Skill
          </Button>
        }
      />

      <SkillList
        skills={skills}
        onProgressUpdate={handleProgressPipelineUpdate}
        onEditTrigger={setActiveEditTarget}
        onDeleteTrigger={setActiveDeleteTarget}
        onOpenModal={() => setIsAddOpen(true)}
      />

      <AddSkillModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddSkillSubmit}
      />

      <EditSkillModal
        key={activeEditTarget?._id || "none"}
        isOpen={!!activeEditTarget}
        skill={activeEditTarget}
        onClose={() => setActiveEditTarget(null)}
        onUpdate={handleEditSkillSubmit}
      />

      <DeleteSkillModal
        isOpen={!!activeDeleteTarget}
        skill={activeDeleteTarget}
        onClose={() => setActiveDeleteTarget(null)}
        onConfirm={handleDeleteSkillSubmit}
      />
    </div>
  );
}

export default Skills;
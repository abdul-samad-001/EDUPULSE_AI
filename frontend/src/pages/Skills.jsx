import { useState, useEffect } from "react";
import skillService from "../services/skillService";

import SkillList from "../components/skills/SkillList";
import AddSkillModal from "../components/skills/AddSkillModal";
import EditSkillModal from "../components/skills/EditSkillModal";
import DeleteSkillModal from "../components/skills/DeleteSkillModal";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeEditTarget, setActiveEditTarget] =
    useState(null);
  const [activeDeleteTarget, setActiveDeleteTarget] =
    useState(null);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await skillService.getAllSkills();

      setSkills(data);
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


  const handleAddSkillSubmit = async (
    name,
    category
  ) => {
    try {
      const added =
        await skillService.createSkill(
          name,
          category
        );

      setSkills((prev) => [...prev, added]);
    } catch (err) {
      console.error(err);
      alert("Unable to create skill.");
    }
  };

  const handleEditSkillSubmit = async (
    id,
    fields
  ) => {
    try {
      const updated =
        await skillService.updateSkill(
          id,
          fields
        );

      setSkills((prev) =>
        prev.map((s) =>
          s._id === id ? updated : s
        )
      );
    } catch (err) {
      console.error(err);
      alert("Unable to update skill.");
    }
  };

  const handleDeleteSkillSubmit = async (
    id
  ) => {
    try {
      await skillService.deleteSkill(id);

      setSkills((prev) =>
        prev.filter((s) => s._id !== id)
      );
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
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <h2 className="text-xl font-semibold">
            Loading Skills...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-white p-8 rounded-xl shadow text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold mb-4">
            {error}
          </h2>

          <button
            onClick={loadSkills}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      <div className="flex justify-between items-center border-b pb-5">

        <div>
          <h1 className="text-3xl font-bold">
            📚 Skills
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your learning roadmap and
            progress.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Add Skill
        </button>

      </div>

      <SkillList
        skills={skills}
        onProgressUpdate={
          handleProgressPipelineUpdate
        }
        onEditTrigger={
          setActiveEditTarget
        }
        onDeleteTrigger={
          setActiveDeleteTarget
        }
        onOpenModal={() =>
          setIsAddOpen(true)
        }
      />

      <AddSkillModal
        isOpen={isAddOpen}
        onClose={() =>
          setIsAddOpen(false)
        }
        onAdd={handleAddSkillSubmit}
      />

      <EditSkillModal
        key={activeEditTarget?._id || "none"}
        isOpen={!!activeEditTarget}
        skill={activeEditTarget}
        onClose={() =>
          setActiveEditTarget(null)
        }
        onUpdate={handleEditSkillSubmit}
      />

      <DeleteSkillModal
        isOpen={!!activeDeleteTarget}
        skill={activeDeleteTarget}
        onClose={() =>
          setActiveDeleteTarget(null)
        }
        onConfirm={
          handleDeleteSkillSubmit
        }
      />

    </div>
  );
}

export default Skills;
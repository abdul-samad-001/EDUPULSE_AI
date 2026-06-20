import { useState, useEffect } from "react";
import skillService from "../services/skillService.js";
import SkillList from "../components/skills/SkillList.jsx";
import AddSkillModal from "../components/skills/AddSkillModal.jsx";
import EditSkillModal from "../components/skills/EditSkillModal.jsx";
import DeleteSkillModal from "../components/skills/DeleteSkillModal.jsx";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Focus tracking state targets for modals interaction pipelines
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeEditTarget, setActiveEditTarget] = useState(null);
  const [activeDeleteTarget, setActiveDeleteTarget] = useState(null);

  useEffect(() => {
    skillService.getAllSkills()
      .then(data => { setSkills(data); setLoading(false); })
      .catch(err => { console.error(err); setError("Failed to synchronize active track rosters."); setLoading(false); });
  }, []);

  const handleAddSkillSubmit = async (name, category) => {
    try {
      const addedObj = await skillService.createSkill(name, category);
      setSkills(prev => [...prev, addedObj]);
    } catch (err) {
      console.error(err);
      alert("Pipeline integration mismatch routing creation call.");
    }
  };

  const handleEditSkillSubmit = async (id, fields) => {
    try {
      const optimizedObj = await skillService.updateSkill(id, fields);
      setSkills(prev => prev.map(s => s._id === id ? optimizedObj : s));
    } catch (err) {
      console.error(err);
      alert("Error updating skill parameters.");
    }
  };

  const handleDeleteSkillSubmit = async (id) => {
    try {
      await skillService.deleteSkill(id);
      setSkills(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erase command execution drop context error.");
    }
  };

  // Live optimistic progress bubble event hook
  const handleProgressPipelineUpdate = (id, computedProgressScore, streakFields ={}) => {
    setSkills(prev => prev.map(s =>
      s._id === id ? { ...s, progress: computedProgressScore, completed: computedProgressScore === 100, ...streakFields,} : s
    ));
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Syncing profile tracks...</div>;
  if (error) return <div className="p-10 text-center text-red-600 font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Skills Core</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track your curriculum milestones</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-sm"
          >
            Create New Track
          </button>
        </div>

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
    </div>
  );
}

export default Skills;
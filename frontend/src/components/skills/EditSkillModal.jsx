import { useState } from "react";
import { PRESET_CATEGORIES } from "../../utils/categories";

function EditSkillModal({ isOpen, skill, onClose, onUpdate }) {
  const [skillName, setSkillName] = useState(skill?.skillName || "");
  const [category, setCategory] = useState(skill?.category || PRESET_CATEGORIES[0]);

  if (!isOpen || !skill) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    // Passing both updated tracking parameters back up the stream
    onUpdate(skill._id, { skillName, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md border border-slate-200 shadow-lg">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Modify Target Track</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Update Skill Name</label>
            <input
              type="text"
              required
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Update Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-slate-900"
            >
              {PRESET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 text-sm hover:underline">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSkillModal;
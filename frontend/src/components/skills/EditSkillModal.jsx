import { useState } from "react";
import { PRESET_CATEGORIES } from "../../utils/categories";
import { Modal, Button } from "../ui";
import { Save } from "lucide-react";

function EditSkillModal({ isOpen, skill, onClose, onUpdate }) {
  const [skillName, setSkillName] = useState(skill?.skillName || "");
  const [category, setCategory] = useState(skill?.category || PRESET_CATEGORIES[0]);

  if (!isOpen || !skill) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    onUpdate(skill._id, { skillName, category });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modify Target Track"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">
            Update Skill Name
          </label>
          <input
            type="text"
            required
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">
            Update Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary/50"
          >
            {PRESET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-dark-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditSkillModal;
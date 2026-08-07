import { useState } from "react";
import { PRESET_CATEGORIES } from "../../utils/categories";
import { Modal, Button } from "../ui";
import { Plus } from "lucide-react";

function AddSkillModal({ isOpen, onClose, onAdd }) {
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("In Progress");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    onAdd(skillName, category);
    setSkillName("");
    setCategory(PRESET_CATEGORIES[0]);
    setDescription("");
    setStatus("In Progress");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Learning Skill Track"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">
            Skill Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. React.js, FastAPI, Machine Learning"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">
            Category Domain
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

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">
            Description (Optional)
          </label>
          <textarea
            rows="2"
            placeholder="Define learning goals or specific milestones..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">
            Initial Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary/50"
          >
            <option value="In Progress">In Progress</option>
            <option value="Planned">Planned</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Plus}>
            + Add Skill Track
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddSkillModal;
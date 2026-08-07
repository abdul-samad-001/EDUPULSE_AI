import { Modal, Button } from "../ui";
import { AlertTriangle, Trash2 } from "lucide-react";

function DeleteSkillModal({ isOpen, skill, onClose, onConfirm }) {
  if (!isOpen || !skill) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Track Assignment?"
      size="sm"
    >
      <div className="text-center py-2">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-xs sm:text-sm text-dark-muted mb-6 leading-relaxed">
          Are you sure you want to permanently erase <span className="font-semibold text-dark-text">"{skill.skillName}"</span> and all connected milestones?
        </p>

        <div className="flex justify-center gap-2 pt-2 border-t border-dark-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => {
              onConfirm(skill._id);
              onClose();
            }}
          >
            Confirm Erase
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteSkillModal;
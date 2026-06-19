function DeleteSkillModal({ isOpen, skill, onClose, onConfirm }) {
  if (!isOpen || !skill) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm border border-slate-200 shadow-lg text-center">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Delete Track Assignment?</h2>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to permanently erase <span className="font-semibold text-slate-800">"{skill.skillName}"</span> and all connected milestones?
        </p>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={() => { onConfirm(skill._id); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Confirm Erase</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSkillModal;
function EmptySkills({ onOpenModal }) {
  return (
    <div className="text-center text-slate-400 py-12 bg-white border rounded-xl border-dashed border-slate-300">
      <p className="mb-4 font-medium">No learning tracks created yet.</p>
      <button
        onClick={onOpenModal}
        className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
      >
        Track First Skill
      </button>
    </div>
  );
}

export default EmptySkills;

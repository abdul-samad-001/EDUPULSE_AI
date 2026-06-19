function SkillProgress({ progress }) {
  return (
    <div className="space-y-1.5 mt-3 mb-4">
      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
        <span>Completion</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-slate-900 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default SkillProgress;
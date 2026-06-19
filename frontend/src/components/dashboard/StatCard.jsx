function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <span className="text-sm font-medium text-slate-500 tracking-wide block mb-2">
        {title}
      </span>
      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
        {value}
      </span>
    </div>
  );
}

export default StatCard;
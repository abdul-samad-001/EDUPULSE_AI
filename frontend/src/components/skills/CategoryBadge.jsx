function CategoryBadge({ category }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
      {category}
    </span>
  );
}

export default CategoryBadge;
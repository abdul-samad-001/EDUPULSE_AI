import { Search, Filter, ArrowUpDown } from "lucide-react";
import { PRESET_CATEGORIES } from "../../utils/categories";

function SkillsFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-4 shadow-md space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-48">
        <Search className="w-4 h-4 text-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search skills by name or category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-3 gap-2 shrink-0">
        {/* Status Filter */}
        <div className="relative flex items-center">
          <Filter className="w-3.5 h-3.5 text-dark-muted absolute left-2.5 pointer-events-none hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl sm:pl-8 pr-3 py-2 text-xs font-semibold outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative flex items-center">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {PRESET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="relative flex items-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-dark-muted absolute left-2.5 pointer-events-none hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl sm:pl-8 pr-3 py-2 text-xs font-semibold outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Progress</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SkillsFilterBar;

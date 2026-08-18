import { useEffect, useState, useMemo, useRef } from "react";
import skillService from "../services/skillService";
import { Card, Badge, LoadingSpinner, Progress, toast } from "../components/ui";
import {
  Flag,
  CheckCircle2,
  Circle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

function Milestones() {
  const [skills, setSkills] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all"); // all | pending | completed
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollSkillsRef = useRef(null);
  const PAGE_SIZE = 8;

  const scrollSkills = (direction) => {
    if (scrollSkillsRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollSkillsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const skillsList = await skillService.getSkills();
      const safeSkills = Array.isArray(skillsList) ? skillsList : [];
      setSkills(safeSkills);

      // Fetch tasks for all skills concurrently
      const taskPromises = safeSkills.map(async (skill) => {
        try {
          const tasks = await skillService.getTasks(skill._id);
          return (tasks || []).map((t) => ({
            ...t,
            skillName: skill.skillName,
            skillCategory: skill.category,
          }));
        } catch {
          return [];
        }
      });

      const taskResults = await Promise.all(taskPromises);
      const flattened = taskResults.flat();
      setAllTasks(flattened);
    } catch (err) {
      console.error("Milestones load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTask = async (task) => {
    try {
      const newStatus = !task.completed;
      await skillService.toggleTask(task._id, newStatus);
      setAllTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: newStatus } : t))
      );
      toast.success(newStatus ? "Milestone Completed! 🎉" : "Milestone Marked Pending", {
        description: `${task.taskName} (${task.skillName})`,
      });
    } catch (err) {
      console.error("Toggle milestone error:", err);
      toast.error("Failed to update milestone.");
    }
  };

  // Filter & Search
  const filteredTasks = useMemo(() => {
    let list = [...allTasks];

    if (selectedSkillId !== "all") {
      list = list.filter((t) => t.skill === selectedSkillId);
    }

    if (activeFilter === "completed") {
      list = list.filter((t) => t.completed);
    } else if (activeFilter === "pending") {
      list = list.filter((t) => !t.completed);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          (t.taskName && t.taskName.toLowerCase().includes(q)) ||
          (t.skillName && t.skillName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allTasks, selectedSkillId, activeFilter, searchQuery]);

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / PAGE_SIZE) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTasks.slice(start, start + PAGE_SIZE);
  }, [filteredTasks, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading Learning Roadmap Milestones..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-6">
      {/* 1. SLIM ROADMAP PROGRESS HERO */}
      <Card className="w-full bg-linear-to-br from-dark-card via-dark-card to-primary/10 border-primary/20 p-4 space-y-3.5 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-center">
          {/* Progress Bar Info */}
          <div className="lg:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-xs font-black text-dark-text uppercase tracking-wider">
                  Roadmap Milestone Velocity
                </h3>
              </div>
              <span className="text-xl font-black text-primary">{progressPercent}%</span>
            </div>

            <Progress value={progressPercent} size="sm" color="primary" />

            <div className="flex items-center justify-between text-[11px] text-dark-muted font-medium">
              <span>{completedTasks} of {totalTasks} milestones completed</span>
              <span className="text-primary font-bold">{pendingTasks} remaining</span>
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-dark-bg/90 border border-dark-border text-center">
              <span className="text-[9px] font-black uppercase text-primary flex items-center justify-center gap-0.5">
                <BookOpen className="w-2.5 h-2.5" /> Tracks
              </span>
              <p className="text-sm font-black text-dark-text pt-0.5">{skills.length}</p>
            </div>

            <div className="p-2 rounded-xl bg-dark-bg/90 border border-dark-border text-center">
              <span className="text-[9px] font-black uppercase text-emerald-400 flex items-center justify-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Done
              </span>
              <p className="text-sm font-black text-dark-text pt-0.5">{completedTasks}</p>
            </div>

            <div className="p-2 rounded-xl bg-dark-bg/90 border border-dark-border text-center">
              <span className="text-[9px] font-black uppercase text-amber-400 flex items-center justify-center gap-0.5">
                <Flag className="w-2.5 h-2.5" /> Pending
              </span>
              <p className="text-sm font-black text-dark-text pt-0.5">{pendingTasks}</p>
            </div>
          </div>
        </div>

        {/* Skill Filter Pills Carousel + Search & Status Controls */}
        <div className="pt-2.5 border-t border-dark-border/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Skill Selector Scrollable Carousel with Arrow Navigation Buttons */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {/* Left Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollSkills("left")}
              title="Scroll left"
              className="p-1.5 rounded-lg bg-dark-bg border border-dark-border hover:border-primary/50 text-dark-muted hover:text-dark-text transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Scrollable Track */}
            <div
              ref={scrollSkillsRef}
              className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 scroll-smooth scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-dark-bg/60 flex-1"
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedSkillId("all");
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSkillId === "all"
                    ? "bg-primary text-dark-bg shadow-xs font-black"
                    : "bg-dark-bg text-dark-muted hover:text-dark-text border border-dark-border"
                }`}
              >
                All Skills ({totalTasks})
              </button>
              {skills.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => {
                    setSelectedSkillId(s._id);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSkillId === s._id
                      ? "bg-primary text-dark-bg shadow-xs font-black"
                      : "bg-dark-bg text-dark-muted hover:text-dark-text border border-dark-border"
                  }`}
                >
                  {s.skillName}
                </button>
              ))}
            </div>

            {/* Right Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollSkills("right")}
              title="Scroll right"
              className="p-1.5 rounded-lg bg-dark-bg border border-dark-border hover:border-primary/50 text-dark-muted hover:text-dark-text transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search and Status Filters */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 p-0.5 bg-dark-bg rounded-xl border border-dark-border">
              {[
                { id: "all", label: "All" },
                { id: "pending", label: "Pending" },
                { id: "completed", label: "Done" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? "bg-primary text-dark-bg shadow-xs"
                      : "text-dark-muted hover:text-dark-text"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-40 sm:w-48">
              <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-dark-muted" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-dark-bg border border-dark-border rounded-xl pl-7 pr-2.5 py-1 text-xs text-dark-text placeholder:text-dark-muted focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 2. DENSE ROADMAP MILESTONES GRID */}
      {paginatedTasks.length === 0 ? (
        <Card className="p-8 text-center space-y-2">
          <Flag className="w-8 h-8 text-dark-muted mx-auto" />
          <h3 className="text-sm font-bold text-dark-text">No Milestones Found</h3>
          <p className="text-xs text-dark-muted">
            {totalTasks === 0
              ? "Create skills or generate AI roadmaps in the Skills tab to populate milestones."
              : "Try adjusting your search query or filter selection."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginatedTasks.map((task) => {
              const isDone = task.completed;
              const difficultyVariant =
                task.difficulty === "Hard"
                  ? "danger"
                  : task.difficulty === "Medium"
                  ? "warning"
                  : "primary";

              return (
                <Card
                  key={task._id}
                  className={`w-full flex flex-col justify-between p-3 sm:p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                    isDone
                      ? "border-emerald-500/30 bg-linear-to-br from-emerald-500/8 via-dark-card to-dark-card"
                      : "border-dark-border hover:border-primary/40"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header Row: Skill Tag, Day & Difficulty */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary truncate max-w-[130px]">
                        {task.skillName}
                      </span>
                      <div className="flex items-center gap-1">
                        {task.assignedDay && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border text-dark-muted">
                            Day {task.assignedDay}
                          </span>
                        )}
                        <Badge variant={difficultyVariant} size="sm" className="text-[9px] py-0.5 px-1.5">
                          {task.difficulty || "Easy"}
                        </Badge>
                      </div>
                    </div>

                    {/* Milestone Task Title */}
                    <p
                      className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${
                        isDone ? "line-through text-dark-muted" : "text-dark-text"
                      }`}
                    >
                      {task.taskName}
                    </p>
                  </div>

                  {/* Checkbox Trigger */}
                  <div className="mt-3 pt-2 border-t border-dark-border/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                        isDone ? "text-emerald-400 hover:text-emerald-300" : "text-dark-muted hover:text-primary"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-dark-muted shrink-0" />
                      )}
                      <span>{isDone ? "Completed" : "Mark Done"}</span>
                    </button>

                    <span className="text-[10px] font-extrabold text-amber-400">+50 XP</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {filteredTasks.length > PAGE_SIZE && (
            <div className="p-2.5 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between text-xs text-dark-muted">
              <span className="text-[11px]">
                Showing <strong>{paginatedTasks.length}</strong> of <strong>{filteredTasks.length}</strong> milestones
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg border border-dark-border hover:bg-dark-border/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-dark-text cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-2 text-xs font-bold text-dark-text">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg border border-dark-border hover:bg-dark-border/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-dark-text cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Milestones;
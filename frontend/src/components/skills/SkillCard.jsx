import { useState, useEffect, useCallback, useRef } from "react";
import skillService from "../../services/skillService";
import CategoryBadge from "./CategoryBadge";
import { Card, Button, Badge, Progress, LoadingSpinner, toast } from "../ui";
import { Flame, Edit, Trash2, ChevronDown, ChevronUp, Plus, RefreshCw, Clock, Calendar } from "lucide-react";

const DIFFICULTY_STYLES = {
  Easy: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Hard: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
};

function SkillCard({ skill, onProgressUpdate, onEditTrigger, onDeleteTrigger }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [generating, setGenerating] = useState(false);

  const hasAttemptedAutoGen = useRef(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleGenerateRoadmap = useCallback(async () => {
    setGenerating(true);
    try {
      const newTasks = await skillService.generateRoadmap(skill._id);
      setTasks(newTasks);
      onProgressUpdate(skill._id, 0, { currentDay: 1, streakCount: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }, [skill._id, onProgressUpdate]);

  useEffect(() => {
    if (isExpanded) {
      skillService.getTasks(skill._id)
        .then(data => setTasks(data))
        .catch(err => console.error(err));
    }
  }, [isExpanded, skill._id]);

  useEffect(() => {
    if (isExpanded && tasks.length === 0 && !hasAttemptedAutoGen.current && !generating) {
      hasAttemptedAutoGen.current = true;
      handleGenerateRoadmap();
    }
  }, [isExpanded, tasks.length, generating, handleGenerateRoadmap]);

  const currentDay = skill.currentDay || 1;
  const todaysTasks = tasks.filter((t) => (t.assignedDay || 1) === currentDay);
  const historyTasks = tasks.filter((t) => (t.assignedDay || 1) < currentDay);

  const todaysCompletedCount = todaysTasks.filter((t) => t.completed).length;
  const todaysProgress = todaysTasks.length > 0
    ? Math.round((todaysCompletedCount / todaysTasks.length) * 100)
    : 0;

  const handleTaskToggle = async (taskId, currentStatus) => {
    const targetOptimisticArray = tasks.map(t =>
      t._id === taskId ? { ...t, completed: !currentStatus } : t
    );
    setTasks(targetOptimisticArray);

    const completedCount = targetOptimisticArray.filter(t => t.completed).length;
    const computedPercentage = targetOptimisticArray.length > 0 
      ? Math.round((completedCount / targetOptimisticArray.length) * 100) 
      : 0;
    onProgressUpdate(skill._id, computedPercentage);

    try {
      const result = await skillService.toggleTask(taskId, !currentStatus);
      if (result?.skill) {
        onProgressUpdate(skill._id, result.skill.progress, {
          currentDay: result.skill.currentDay,
          streakCount: result.skill.streakCount,
        });
      }
    } catch (err) {
      console.error(err);
      setTasks(tasks);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      const added = await skillService.createTask(skill._id, newTaskName.trim());
      setTasks(prev => [...prev, added]);
      setNewTaskName("");
      toast.success("Milestone Added", {
        description: `Added "${added.taskName || newTaskName.trim()}" to roadmap.`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add milestone.");
    }
  };

  const handleManualRegenerate = async () => {
    setGenerating(true);
    try {
      const newTasks = await skillService.generateRoadmap(skill._id);
      setTasks(newTasks);
      onProgressUpdate(skill._id, 0, { currentDay: 1, streakCount: 0 });
      toast.success("Roadmap Regenerated", {
        description: `Fresh AI learning roadmap generated for "${skill.skillName || "skill"}".`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Generation Failed", {
        description: "Failed to regenerate AI roadmap. Please try again shortly.",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Status Badge Logic
  const isCompleted = (skill.progress || 0) === 100;
  const statusLabel = isCompleted
    ? "Completed"
    : (skill.progress || 0) > 0
    ? "In Progress"
    : "Just Started";
  const statusVariant = isCompleted ? "success" : (skill.progress || 0) > 0 ? "primary" : "neutral";

  // Last Updated & Estimated Completion placeholders
  const updatedDate = skill.updatedAt
    ? new Date(skill.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Recently";

  return (
    <Card hoverable className="w-full flex flex-col justify-between transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
      <div className="space-y-3">
        {/* Top Header: Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={skill.category} />
          <div className="flex items-center gap-1.5">
            <Badge variant={statusVariant} size="sm">
              {statusLabel}
            </Badge>
            {skill.streakCount > 0 && (
              <Badge variant="warning" icon={Flame} size="sm">
                {skill.streakCount}d
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-extrabold text-dark-text tracking-tight">
            {skill.skillName}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-dark-muted mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-primary" /> Day {currentDay}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> Est. ~3 wks
            </span>
            <span>Updated {updatedDate}</span>
          </div>
        </div>

        {/* Progress Bar Component */}
        <div className="space-y-1">
          <div className="flex justify-between items-baseline text-xs font-semibold">
            <span className="text-dark-muted">Roadmap Progress</span>
            <span className="text-primary font-bold">{skill.progress || 0}%</span>
          </div>
          <Progress
            value={skill.progress || 0}
            max={100}
            size="sm"
            color={isCompleted ? "success" : "primary"}
          />
        </div>
      </div>

      {/* Action Footer & Expandable Milestones */}
      <div className="space-y-3 pt-3 mt-3 border-t border-dark-border">
        <div className="flex justify-between items-center text-xs font-semibold">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:underline inline-flex items-center gap-1 focus:outline-none cursor-pointer"
          >
            {isExpanded ? (
              <><span>Hide AI Roadmap</span> <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <><span>Open Roadmap & Milestones</span> <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditTrigger(skill)}
              className="text-dark-muted hover:text-dark-text transition-colors p-1 rounded-lg hover:bg-dark-border/50"
              aria-label="Edit Skill"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteTrigger(skill)}
              className="text-rose-400 hover:text-rose-300 transition-colors p-1 rounded-lg hover:bg-rose-500/10"
              aria-label="Delete Skill"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Milestones Drawer */}
        {isExpanded && (
          <div className="border-t border-dark-border pt-3 space-y-3">
            {generating && (
              <div className="flex items-center gap-2 text-xs text-primary py-2">
                <LoadingSpinner size="sm" />
                <span>Generating AI roadmap…</span>
              </div>
            )}

            {!generating && tasks.length === 0 && (
              <p className="text-xs text-dark-muted italic py-2">
                No milestones yet. Add one below, or it will auto-generate.
              </p>
            )}

            {!generating && todaysTasks.length > 0 && (
              <div className="flex items-center justify-between text-xs font-semibold text-dark-muted">
                <span>Day {currentDay} Milestones</span>
                <span>{todaysCompletedCount}/{todaysTasks.length} today &middot; {todaysProgress}%</span>
              </div>
            )}

            {historyTasks.length > 0 && (
              <button
                onClick={() => setShowHistory((s) => !s)}
                className="text-[11px] text-dark-muted hover:text-dark-text underline cursor-pointer"
              >
                {showHistory ? "Hide completed days ↑" : `Show ${currentDay - 1} completed day${currentDay - 1 !== 1 ? "s" : ""} ↓`}
              </button>
            )}

            {showHistory && historyTasks.length > 0 && (
              <div className="space-y-1.5 opacity-60 border-l-2 border-dark-border pl-2.5">
                {historyTasks.map((task) => (
                  <div key={task._id} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={task.completed || false}
                      onChange={() => handleTaskToggle(task._id, task.completed)}
                      className="h-3.5 w-3.5 rounded border-dark-border bg-dark-bg text-primary focus:ring-primary"
                    />
                    <span className="text-dark-muted line-through flex-1">{task.taskName}</span>
                    <span className="text-[10px] text-dark-muted/60 shrink-0">Day {task.assignedDay}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1.5">
              {todaysTasks.map((task) => (
                <div key={task._id} className="flex items-center gap-2.5 text-xs bg-dark-bg p-2 rounded-xl border border-dark-border">
                  <input
                    type="checkbox"
                    checked={task.completed || false}
                    onChange={() => handleTaskToggle(task._id, task.completed)}
                    className="h-4 w-4 rounded border-dark-border bg-dark-card text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className={task.completed ? "line-through text-dark-muted flex-1" : "font-medium text-dark-text flex-1"}>
                    {task.taskName}
                  </span>
                  {task.difficulty && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${DIFFICULTY_STYLES[task.difficulty] || DIFFICULTY_STYLES.Easy}`}>
                      {task.difficulty}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateTask} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="New milestone..."
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                className="flex-1 text-xs bg-dark-bg border border-dark-border text-dark-text rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary/50"
              />
              <Button type="submit" variant="primary" size="sm" icon={Plus}>
                Add
              </Button>
            </form>

            {tasks.length > 0 && (
              <button
                onClick={handleManualRegenerate}
                disabled={generating}
                className="inline-flex items-center gap-1.5 text-xs text-dark-muted hover:text-primary disabled:opacity-50 pt-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate AI Roadmap</span>
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default SkillCard;
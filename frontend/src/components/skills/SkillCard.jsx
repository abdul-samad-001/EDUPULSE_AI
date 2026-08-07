import { useState, useEffect, useCallback, useRef } from "react";
import skillService from "../../services/skillService";
import CategoryBadge from "./CategoryBadge";
import SkillProgress from "./SkillProgress";
import { Card, Button, Badge, LoadingSpinner } from "../ui";
import { Flame, Edit, Trash2, ChevronDown, ChevronUp, Plus, RefreshCw } from "lucide-react";

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualRegenerate = async () => {
    if (!window.confirm("Regenerating will replace all existing tasks with a fresh AI roadmap. Continue?")) {
      return;
    }
    setGenerating(true);
    try {
      const newTasks = await skillService.generateRoadmap(skill._id);
      setTasks(newTasks);
      onProgressUpdate(skill._id, 0, { currentDay: 1, streakCount: 0 });
    } catch (err) {
      console.error(err);
      alert("Failed to regenerate AI roadmap. Please try again shortly.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <CategoryBadge category={skill.category} />
            <div className="flex items-center gap-2 mt-1.5">
              <h3 className="text-base font-bold text-dark-text">{skill.skillName}</h3>
              {skill.streakCount > 0 && (
                <Badge variant="warning" icon={Flame} size="sm">
                  {skill.streakCount} Day{skill.streakCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <SkillProgress progress={skill.progress} />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center text-xs font-semibold border-t border-dark-border pt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:underline inline-flex items-center gap-1 focus:outline-none"
          >
            {isExpanded ? (
              <><span>Hide Milestones</span> <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <><span>Manage Tasks</span> <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEditTrigger(skill)}
              className="text-dark-muted hover:text-dark-text transition-colors p-1"
              aria-label="Edit Skill"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteTrigger(skill)}
              className="text-rose-400 hover:text-rose-300 transition-colors p-1"
              aria-label="Delete Skill"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

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
                No milestones yet. Add one below, or it will auto-generate shortly.
              </p>
            )}

            {!generating && todaysTasks.length > 0 && (
              <div className="flex items-center justify-between text-xs font-semibold text-dark-muted">
                <span>Day {currentDay}</span>
                <span>{todaysCompletedCount}/{todaysTasks.length} today &middot; {todaysProgress}%</span>
              </div>
            )}

            {historyTasks.length > 0 && (
              <button
                onClick={() => setShowHistory((s) => !s)}
                className="text-[11px] text-dark-muted hover:text-dark-text underline"
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
                    className="h-4 w-4 rounded border-dark-border bg-dark-card text-primary focus:ring-primary"
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
                className="inline-flex items-center gap-1.5 text-xs text-dark-muted hover:text-primary disabled:opacity-50 pt-1"
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
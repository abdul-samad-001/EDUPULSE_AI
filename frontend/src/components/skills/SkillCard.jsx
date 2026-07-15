import { useState, useEffect, useCallback, useRef } from "react";
import skillService from "../../services/skillService";
import CategoryBadge from "./CategoryBadge";
import SkillProgress from "./SkillProgress";

const DIFFICULTY_STYLES = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

function SkillCard({ skill, onProgressUpdate, onEditTrigger, onDeleteTrigger }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [generating, setGenerating] = useState(false);

  // Use a ref to guard against infinite auto-generation loops without causing re-renders
  const hasAttemptedAutoGen = useRef(false);

  // NEW — toggles whether completed earlier days are shown.
  // Defaults to collapsed so the card stays focused on "today".
  const [showHistory, setShowHistory] = useState(false);

  // Define handleGenerateRoadmap as a reusable callback ABOVE the useEffect hooks
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

  // NEW — Day-Wise filtering. skill.currentDay is the source of truth
  // from the backend (advanced server-side in taskController.updateTask).
  // Tasks with assignedDay < currentDay are "history" (past, completed).
  // Tasks with assignedDay === currentDay are "today" (the focused view).
  // Tasks with assignedDay > currentDay are not rendered at all — they
  // stay hidden client-side, matching the "Focused View" requirement.
  const currentDay = skill.currentDay || 1;
  const todaysTasks = tasks.filter((t) => (t.assignedDay || 1) === currentDay);
  const historyTasks = tasks.filter((t) => (t.assignedDay || 1) < currentDay);

  const todaysCompletedCount = todaysTasks.filter((t) => t.completed).length;
  const todaysProgress = todaysTasks.length > 0
    ? Math.round((todaysCompletedCount / todaysTasks.length) * 100)
    : 0;

  // Optimistic UI Toggle Pipeline
  const handleTaskToggle = async (taskId, currentStatus) => {
    const backupSnapshot = [...tasks];

    const targetOptimisticArray = tasks.map(t =>
      t._id === taskId ? { ...t, completed: !currentStatus } : t
    );
    setTasks(targetOptimisticArray);

    // NOTE: overall skill.progress (the card-level bar) still reflects
    // ALL tasks across all days, same as before — todaysProgress (above)
    // is a separate, additional metric for the "today" view only.
    const completedCount = targetOptimisticArray.filter(t => t.completed).length;
    const computedPercentage = targetOptimisticArray.length > 0 
      ? Math.round((completedCount / targetOptimisticArray.length) * 100) 
      : 0;
    onProgressUpdate(skill._id, computedPercentage);

    try {
      const result = await skillService.toggleTask(taskId, !currentStatus);
      // NEW — backend returns the updated skill alongside the task when
      // a day advances. If skill.currentDay or streakCount changed,
      // bubble it up so the parent's skills[] state reflects the new
      // fire badge / unlocked day immediately, without a full re-fetch.
      if (result?.skill) {
        onProgressUpdate(skill._id, result.skill.progress, {
          currentDay: result.skill.currentDay,
          streakCount: result.skill.streakCount,
        });
      }
    } catch (err) {
      console.error(err);
      setTasks(backupSnapshot);
      const rollBackCount = backupSnapshot.filter(t => t.completed).length;
      const rollBackPercentage = backupSnapshot.length > 0 ? Math.round((rollBackCount / backupSnapshot.length) * 100) : 0;
      onProgressUpdate(skill._id, rollBackPercentage);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      // Manually-added tasks attach to the CURRENT day by default, so
      // they appear in today's focused view immediately.
      const addedTask = await skillService.createTask(skill._id, newTaskName, currentDay);
      const extendedTasks = [...tasks, addedTask];
      setTasks(extendedTasks);
      setNewTaskName("");

      const completedCount = extendedTasks.filter(t => t.completed).length;
      onProgressUpdate(skill._id, Math.round((completedCount / extendedTasks.length) * 100));
    } catch (err) {
      console.error(err);
      alert("Failed to append milestone task.");
    }
  };

  const handleManualRegenerate = async () => {
    if (!window.confirm("This will replace all current milestones, reset your day progress, and reset this skill's streak. Continue?")) {
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
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <CategoryBadge category={skill.category} />
            <div className="flex items-center gap-2 mt-2">
              <h3 className="text-lg font-bold text-slate-800">{skill.skillName}</h3>
              {/* NEW — streak fire badge, only shown once a streak exists */}
              {skill.streakCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                  🔥 {skill.streakCount} Day{skill.streakCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
        <SkillProgress progress={skill.progress} />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center text-sm font-medium">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-700 hover:underline">
            {isExpanded ? "Hide Milestones ↑" : "Manage Tasks ↓"}
          </button>
          <div className="flex gap-3">
            <button onClick={() => onEditTrigger(skill)} className="text-slate-600 hover:text-slate-900">Edit</button>
            <button onClick={() => onDeleteTrigger(skill)} className="text-red-600 hover:underline">Delete</button>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-slate-100 pt-4 space-y-3">

            {generating && (
              <div className="text-xs text-slate-400 italic py-2">
                ✨ Generating AI roadmap…
              </div>
            )}

            {!generating && tasks.length === 0 && (
              <div className="text-xs text-slate-400 italic py-2">
                No milestones yet. Add one below, or it will auto-generate shortly.
              </div>
            )}

            {/* NEW — Day header + today's progress bar */}
            {!generating && todaysTasks.length > 0 && (
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-1">
                <span>Day {currentDay}</span>
                <span>{todaysCompletedCount}/{todaysTasks.length} today &middot; {todaysProgress}%</span>
              </div>
            )}

            {/* NEW — collapsed history toggle, only if earlier days exist */}
            {historyTasks.length > 0 && (
              <button
                onClick={() => setShowHistory((s) => !s)}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                {showHistory ? "Hide completed days ↑" : `Show ${currentDay - 1} completed day${currentDay - 1 !== 1 ? "s" : ""} ↓`}
              </button>
            )}

            {/* NEW — history section: past days, greyed out, read-only feel
                but checkbox stays interactive (per "deadline not a gate" —
                unchecking an old task doesn't reverse day-advance). */}
            {showHistory && historyTasks.length > 0 && (
              <div className="space-y-2 opacity-60 border-l-2 border-slate-200 pl-3">
                {historyTasks.map((task) => (
                  <div key={task._id} className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={task.completed || false}
                      onChange={() => handleTaskToggle(task._id, task.completed)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-slate-400 line-through flex-1">{task.taskName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">Day {task.assignedDay}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Today's focused task list — the main view */}
            <div className="space-y-2">
              {todaysTasks.map((task) => (
                <div key={task._id} className="flex items-center gap-3 text-sm bg-slate-50 p-2 rounded border border-slate-100">
                  <input
                    type="checkbox"
                    checked={task.completed || false}
                    onChange={() => handleTaskToggle(task._id, task.completed)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className={task.completed ? "line-through text-slate-400 flex-1" : "font-medium text-slate-800 flex-1"}>
                    {task.taskName}
                  </span>
                  {task.difficulty && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${DIFFICULTY_STYLES[task.difficulty] || DIFFICULTY_STYLES.Easy}`}>
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
                className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 focus:outline-none"
              />
              <button type="submit" className="bg-slate-900 text-white text-xs px-3 rounded font-semibold">Add</button>
            </form>

            {tasks.length > 0 && (
              <button
                onClick={handleManualRegenerate}
                disabled={generating}
                className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-50 pt-1"
              >
                ↻ Regenerate AI Roadmap
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillCard;
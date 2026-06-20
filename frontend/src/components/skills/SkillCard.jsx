import { useState, useEffect, useCallback, useRef } from "react";
import skillService from "../../services/skillService";
import CategoryBadge from "./CategoryBadge";
import SkillProgress from "./SkillProgress";

const DIFFICULTY_STYLES = {
  Easy: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Medium: "bg-amber-50 text-amber-700 border-amber-100",
  Hard: "bg-rose-50 text-rose-700 border-rose-100",
};

function SkillCard({ skill, onProgressUpdate, onEditTrigger, onDeleteTrigger }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");

  // States to track loading of existing tasks & AI roadmap generation
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Use a ref to guard against infinite auto-generation loops without causing re-renders
  const hasAttemptedAutoGen = useRef(false);

  // Define generateRoadmap as a reusable callback
  const generateRoadmap = useCallback(async (showErrorAlert = false) => {
    setGenerating(true);
    try {
      const newTasks = await skillService.generateRoadmap(skill._id);
      setTasks(newTasks);
      onProgressUpdate(skill._id, 0); // fresh roadmap always starts at 0%
      return newTasks;
    } catch (err) {
      console.error(err);
      if (showErrorAlert) {
        alert(err.message || "Failed to regenerate AI roadmap. Please try again shortly.");
      }
    } finally {
      setGenerating(false);
    }
  }, [skill._id, onProgressUpdate]);

  // Combined effect: fetch existing tasks. If empty and first time, auto-generate.
  // This solves the race conditions between getTasks and generateRoadmap.
  useEffect(() => {
    if (isExpanded) {
      skillService.getTasks(skill._id)
        .then(data => {
          if (data.length === 0 && !hasAttemptedAutoGen.current) {
            hasAttemptedAutoGen.current = true;
            setLoading(false);
            generateRoadmap(false);
          } else {
            setTasks(data);
            setLoading(false);
          }
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isExpanded, skill._id, generateRoadmap]);

  const handleToggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState) {
      setLoading(true);
    }
  };

  // Optimistic UI Toggle Pipeline
  const handleTaskToggle = async (taskId, currentStatus) => {
    const backupSnapshot = [...tasks];

    // 1. Project UI State Instantly
    const targetOptimisticArray = tasks.map(t =>
      t._id === taskId ? { ...t, completed: !currentStatus } : t
    );
    setTasks(targetOptimisticArray);

    // 2. Compute local pipeline mathematics instantly to update main panel metrics
    const completedCount = targetOptimisticArray.filter(t => t.completed).length;
    const computedPercentage = targetOptimisticArray.length > 0 
      ? Math.round((completedCount / targetOptimisticArray.length) * 100) 
      : 0;
    onProgressUpdate(skill._id, computedPercentage);

    try {
      await skillService.toggleTask(taskId, !currentStatus);
    } catch (err) {
      console.error(err);
      // Rollback to origin points if network drops out
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
      const addedTask = await skillService.createTask(skill._id, newTaskName);
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
    if (!window.confirm("This will replace all current milestones for this skill with a fresh AI-generated roadmap. Continue?")) {
      return;
    }
    await generateRoadmap(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <CategoryBadge category={skill.category} />
            <h3 className="text-lg font-bold text-slate-800 mt-2">{skill.skillName}</h3>
          </div>
        </div>
        <SkillProgress progress={skill.progress} />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center text-sm font-medium">
          <button onClick={handleToggleExpand} className="text-slate-700 hover:underline">
            {isExpanded ? "Hide Milestones ↑" : "Manage Tasks ↓"}
          </button>
          <div className="flex gap-3">
            <button onClick={() => onEditTrigger(skill)} className="text-slate-600 hover:text-slate-900">Edit</button>
            <button onClick={() => onDeleteTrigger(skill)} className="text-red-600 hover:underline">Delete</button>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-slate-100 pt-4 space-y-3">
            
            {/* Loading Indicator for Existing Tasks */}
            {loading && (
              <div className="text-xs text-slate-400 italic py-2 flex items-center gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading milestones...
              </div>
            )}

            {/* Loading Indicator for AI Roadmap Generation */}
            {generating && (
              <div className="text-xs text-slate-500 italic py-2 flex items-center gap-1.5 font-medium">
                <svg className="animate-spin h-3.5 w-3.5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ✨ Generating AI roadmap...
              </div>
            )}

            {/* Empty state message when there are no tasks and no load/generation is active */}
            {!loading && !generating && tasks.length === 0 && (
              <div className="text-xs text-slate-400 italic py-2">
                No milestones yet. Add one below, or regenerate a roadmap.
              </div>
            )}

            {/* Milestones List */}
            {tasks.length > 0 && (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between gap-3 text-sm bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed || false}
                        disabled={generating || loading}
                        onChange={() => handleTaskToggle(task._id, task.completed)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className={`truncate ${task.completed ? "line-through text-slate-400" : "font-medium text-slate-800"}`}>
                        {task.taskName}
                      </span>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[task.difficulty] || DIFFICULTY_STYLES.Easy} shrink-0`}>
                      {task.difficulty || "Easy"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Add milestone Form */}
            {!generating && !loading && (
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
            )}

            {/* Manual regenerate button */}
            {!loading && !generating && tasks.length > 0 && (
              <button
                onClick={handleManualRegenerate}
                className="text-xs text-slate-400 hover:text-slate-600 transition flex items-center gap-1.5 pt-1 font-medium"
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
import { useState, useEffect } from "react";
import skillService from "../../services/skillService";
import CategoryBadge from "./CategoryBadge";
import SkillProgress from "./SkillProgress";

function SkillCard({ skill, onProgressUpdate, onEditTrigger, onDeleteTrigger }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    if (isExpanded) {
      skillService.getTasks(skill._id)
        .then(data => setTasks(data))
        .catch(err => console.error(err));
    }
  }, [isExpanded, skill._id]);

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
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task._id} className="flex items-center gap-3 text-sm bg-slate-50 p-2 rounded border border-slate-100">
                  <input
                    type="checkbox"
                    checked={task.completed || false}
                    onChange={() => handleTaskToggle(task._id, task.completed)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className={task.completed ? "line-through text-slate-400" : "font-medium text-slate-800"}>
                    {task.taskName}
                  </span>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillCard;
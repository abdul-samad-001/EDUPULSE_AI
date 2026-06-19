const Task = require("../models/Task");
const Skill = require("../models/Skill");
const User = require("../models/User"); // Imported to handle user updates

const getTasksBySkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    const tasks = await Task.find({
      skill: req.params.skillId,
    }).sort("order");

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { taskName } = req.body;

    const skill = await Skill.findById(req.params.skillId);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    const task = await Task.create({
      skill: req.params.skillId,
      taskName,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { completed } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.completed = completed;
    await task.save();

    // Recalculate progress for the linked skill
    const tasks = await Task.find({
      skill: task.skill,
    });

    const completedTasks = tasks.filter((t) => t.completed).length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    await Skill.findByIdAndUpdate(task.skill, {
      progress,
      completed: progress === 100,
    });

    // ==========================================
    // DAY 19 STREAK SYSTEM HOOK
    // ==========================================
    if (completed === true && req.user && req.user.id) {
      const user = await User.findById(req.user.id);
      
      if (user) {
        const now = new Date();
        
        if (!user.lastActive) {
          // First task ever completed by this user
          user.streak = 1;
        } else {
          // Normalize dates to midnights for pure calendar-day tracking
          const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const lastActiveMidnight = new Date(user.lastActive.getFullYear(), user.lastActive.getMonth(), user.lastActive.getDate());
          
          const timeDifference = todayMidnight - lastActiveMidnight;
          const calendarDaysDelta = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

          if (calendarDaysDelta === 1) {
            // Task checked off on the very next consecutive day
            user.streak += 1;
          } else if (calendarDaysDelta > 1) {
            // A gap of more than 24 hours / missed a day -> reset back to 1
            user.streak = 1;
          }
          // If calendarDaysDelta is 0, they already checked a task today, keeping the streak same
        }

        user.lastActive = now; // Update timestamp
        await user.save();
      }
    }
    // ==========================================

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTasksBySkill,
  createTask,
  updateTask,
};
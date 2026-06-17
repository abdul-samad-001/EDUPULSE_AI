const Task = require("../models/Task");
const Skill = require("../models/Skill");

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
    const tasks = await Task.find({
  skill: task.skill,
});

const completedTasks = tasks.filter(
  (t) => t.completed
).length;

const progress = Math.round(
  (completedTasks / tasks.length) * 100
);

await Skill.findByIdAndUpdate(
  task.skill,
  {
    progress,
    completed: progress === 100,
  }
);
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
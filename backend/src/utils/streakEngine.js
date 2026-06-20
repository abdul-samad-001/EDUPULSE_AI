const Task = require("../models/Task")
const Skill = require("../models/Skill")

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const checkStreakDeadline = async (skill) => {
    if (skill.streakCount === 0) {
    return skill; // nothing to reset
  }
  if (!skill.lastCompletedAt) {
    return skill; // no completion yet, deadline doesn't apply
  }
  const now = new Date();
  const elapsed = now - new Date(skill.lastCompletedAt);
  if (elapsed > ONE_DAY_MS) {
    skill.streakCount = 0;
    await skill.save();
  }
  return skill;
};
const advanceDayIfComplete = async (skill) => {
  const currentDayTasks = await Task.find({
    skill: skill._id,
    assignedDay: skill.currentDay,
  });
  if (currentDayTasks.length === 0) {
    return skill; // nothing assigned to this day yet — can't advance
  }
  const allDone = currentDayTasks.every((t) => t.completed);
  if (!allDone) {
    return skill; // current day not finished yet
  }
  skill.currentDay += 1;
  skill.streakCount += 1;
  skill.lastCompletedAt = new Date();
  await skill.save();
  return skill;
};
module.exports = { checkStreakDeadline, advanceDayIfComplete };
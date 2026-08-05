const Achievement = require("../models/Achievement");

// ==============================
// Default Achievements
// ==============================

const DEFAULT_ACHIEVEMENTS = [
  {
    key: "first_focus",
    title: "First Focus",
    description: "Complete your first focus session.",
    icon: "🎯",
    category: "focus",
    target: 1,
  },
  {
    key: "first_skill",
    title: "Getting Started",
    description: "Create your first skill.",
    icon: "📚",
    category: "skills",
    target: 1,
  },
  {
    key: "task_master",
    title: "Task Master",
    description: "Complete 10 roadmap tasks.",
    icon: "✅",
    category: "tasks",
    target: 10,
  },
  {
    key: "week_warrior",
    title: "Week Warrior",
    description: "Maintain a 7-day study streak.",
    icon: "🔥",
    category: "streak",
    target: 7,
  },
  {
    key: "month_master",
    title: "Month Master",
    description: "Maintain a 30-day study streak.",
    icon: "🏅",
    category: "streak",
    target: 30,
  },
  {
    key: "polymath",
    title: "PolyMath",
    description: "Track 3 different skills.",
    icon: "🧠",
    category: "skills",
    target: 3,
  },
  {
    key: "focus_legend",
    title: "Focus Legend",
    description: "Complete 100 focus sessions.",
    icon: "🚀",
    category: "focus",
    target: 100,
  },
  {
    key: "study_beast",
    title: "Study Beast",
    description: "Reach 100 study hours.",
    icon: "📈",
    category: "study",
    target: 100,
  },
  {
    key: "productivity_hero",
    title: "Productivity Hero",
    description: "Achieve 80% productivity.",
    icon: "⚡",
    category: "productivity",
    target: 80,
  },
];

// ==============================
// Initialize Achievements
// ==============================

async function initializeAchievements(userId) {
  const achievements = DEFAULT_ACHIEVEMENTS.map((item) => ({
    user: userId,
    ...item,
  }));

  await Achievement.insertMany(achievements, {
    ordered: false,
  });

  return true;
}

// ==============================
// Get All Achievements
// ==============================

async function getAchievements(userId) {
  return Achievement.find({ user: userId }).sort({
    unlocked: -1,
    category: 1,
  });
}

// ==============================
// Update Achievement Progress
// ==============================

async function updateAchievementProgress(
  userId,
  key,
  value
) {
  const achievement = await Achievement.findOne({
    user: userId,
    key,
  });

  if (!achievement) return null;

  achievement.progress = value;

  if (
    value >= achievement.target &&
    !achievement.unlocked
  ) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
  }

  await achievement.save();

  return achievement;
}

async function incrementAchievement(userId, key, amount = 1) {
  const achievement = await Achievement.findOne({
    user: userId,
    key,
  });

  if (!achievement) return null;

  achievement.progress += amount;

  if (
    achievement.progress >= achievement.target &&
    !achievement.unlocked
  ) {
    achievement.progress = achievement.target;
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
  }

  await achievement.save();

  return achievement;
}

async function setAchievementProgress(
  userId,
  key,
  progress
) {
  const achievement = await Achievement.findOne({
    user: userId,
    key,
  });

  if (!achievement) return null;

  achievement.progress = Math.min(
  progress,
  achievement.target
);

  if (
    progress >= achievement.target &&
    !achievement.unlocked
  ) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
  }

  await achievement.save();

  return achievement;
}

// ==============================
// Export
// ==============================

module.exports = {
  initializeAchievements,
  getAchievements,
  updateAchievementProgress,
  incrementAchievement,
  setAchievementProgress,
};
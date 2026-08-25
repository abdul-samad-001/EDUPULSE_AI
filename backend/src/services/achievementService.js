const Achievement = require("../models/Achievement");
const { createNotification } = require("./notificationService");
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
  const existing = await Achievement.find({ user: userId }).select("key");
  const existingKeys = new Set(existing.map((a) => a.key));

  const missingAchievements = DEFAULT_ACHIEVEMENTS.filter(
    (item) => !existingKeys.has(item.key)
  ).map((item) => ({
    user: userId,
    ...item,
  }));

  if (missingAchievements.length > 0) {
    await Achievement.insertMany(missingAchievements, {
      ordered: false,
    }).catch(() => {});
  }

  return true;
}

// ==============================
// Sync User Achievements Retroactively
// ==============================

async function syncUserAchievements(userId) {
  try {
    const mongoose = require("mongoose");
    const Skill = require("../models/Skill");
    const Task = require("../models/Task");
    const FocusSession = require("../models/FocusSession");
    const User = require("../models/User");
    const { getTelemetryStats } = require("./telemetryService");

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [userSkills, sessionsCount, userDoc, stats] = await Promise.all([
      Skill.find({ user: userObjectId }),
      FocusSession.countDocuments({ user: userObjectId }),
      User.findById(userObjectId).select("streak").lean(),
      getTelemetryStats(userId).catch(() => ({ productiveTime: 0, productivePercentage: 0 })),
    ]);

    const skillIds = userSkills.map((s) => s._id);
    const completedTasks = await Task.countDocuments({ skill: { $in: skillIds }, completed: true });

    const totalSkills = userSkills.length;
    const streak = userDoc?.streak || 0;
    const studyHours = Math.floor((stats.productiveTime || 0) / 3600);
    const productivity = Math.round(stats.productivePercentage || 0);

    const metricsMap = {
      first_focus: sessionsCount,
      first_skill: totalSkills,
      task_master: completedTasks,
      week_warrior: streak,
      month_master: streak,
      polymath: totalSkills,
      focus_legend: sessionsCount,
      study_beast: studyHours,
      productivity_hero: productivity,
    };

    const achievements = await Achievement.find({ user: userObjectId });

    for (const ach of achievements) {
      if (metricsMap[ach.key] !== undefined) {
        const val = metricsMap[ach.key];
        const newProgress = Math.min(val, ach.target);

        if (newProgress > ach.progress || (!ach.unlocked && val >= ach.target)) {
          ach.progress = newProgress;
          if (val >= ach.target && !ach.unlocked) {
            ach.unlocked = true;
            ach.unlockedAt = ach.unlockedAt || new Date();
          }
          await ach.save();
        }
      }
    }
  } catch (err) {
    console.error("Achievement auto-sync error:", err);
  }
}

// ==============================
// Get All Achievements
// ==============================

async function getAchievements(userId) {
  let count = await Achievement.countDocuments({ user: userId });
  if (count === 0 || count < DEFAULT_ACHIEVEMENTS.length) {
    await initializeAchievements(userId);
  }

  await syncUserAchievements(userId);

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
    await createNotification ({
      user: userId,
      title: "🏆 Achievement Unlocked",
      message: achievement.title,
      type: "achievement",
    });
    
    achievement.unlockedAt = new Date();
    const {addXP, XP_REWARDS,} = require("./xpService");

    await addXP(userId,XP_REWARDS.UNLOCK_ACHIEVEMENT);
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
    await createNotification({
      user: userId,
      title: "🏆 Achievement Unlocked",
      message: achievement.title,
      type: "achievement",
    });
    achievement.unlockedAt = new Date();
    const {addXP, XP_REWARDS,} = require("./xpService");

    await addXP(userId,XP_REWARDS.UNLOCK_ACHIEVEMENT);
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
    
    await createNotification({
    user: userId,
    title: "🏆 Achievement Unlocked",
    message: achievement.title,
    type: "achievement",
    });
    achievement.unlockedAt = new Date();
    const {addXP, XP_REWARDS,} = require("./xpService");

    await addXP(userId,XP_REWARDS.UNLOCK_ACHIEVEMENT);
  }

  await achievement.save();

  return achievement;
}

// ==============================
// Export
// ==============================

module.exports = {
  initializeAchievements,
  syncUserAchievements,
  getAchievements,
  updateAchievementProgress,
  incrementAchievement,
  setAchievementProgress,
};
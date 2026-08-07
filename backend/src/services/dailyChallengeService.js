const DailyChallenge = require("../models/DailyChallenge");
const challengeTemplates = require("../constants/dailyChallenges");
const { addXP } = require("./xpService");
const { createNotification } = require("./notificationService");

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

// Generate daily challenge
const generateDailyChallenge = async (userId) => {
  const today = getToday();

  let challenge = await DailyChallenge.findOne({
    user: userId,
    challengeDate: today,
  });

  if (challenge) {
    return challenge;
  }

  const random =
    challengeTemplates[
      Math.floor(Math.random() * challengeTemplates.length)
    ];

  challenge = await DailyChallenge.create({
    user: userId,
    title: random.title,
    description: random.description,
    type: random.type,
    target: random.target,
    rewardXP: random.rewardXP,
    challengeDate: today,
  });

  return challenge;
};

// Get today's challenge
const getTodayChallenge = async (userId) => {
  return generateDailyChallenge(userId);
};

// Update challenge progress
const updateChallengeProgress = async (
  userId,
  type,
  value
) => {
  const today = getToday();

  const challenge = await DailyChallenge.findOne({
    user: userId,
    challengeDate: today,
  });

  if (!challenge) return null;

  if (challenge.completed) return challenge;

  if (challenge.type !== type) return challenge;

  challenge.progress = value;

  if (challenge.progress >= challenge.target) {
    challenge.completed = true;

    await addXP(userId, challenge.rewardXP);
  }

  await challenge.save();

  return challenge;
};

// Complete challenge manually
const completeChallenge = async (userId) => {
  const today = getToday();

  const challenge = await DailyChallenge.findOne({
    user: userId,
    challengeDate: today,
  });

  if (!challenge) return null;

  if (!challenge.completed) {
    challenge.completed = true;
    challenge.progress = challenge.target;

    await addXP(userId, challenge.rewardXP);
    await createNotification({
  user: userId,
  title: "🎯 Challenge Completed",
  message: challenge.title,
  type: "challenge",
});
    await challenge.save();
  }

  return challenge;
};

module.exports = {
  generateDailyChallenge,
  getTodayChallenge,
  updateChallengeProgress,
  completeChallenge,
};
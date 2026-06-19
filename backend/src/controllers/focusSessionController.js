const FocusSession = require("../models/FocusSession");

// POST /api/distraction/log -> Accept tab logging batch from extension
const logTabBatch = async (req, res) => {
  try {
    const { sessions } = req.body; // Expecting an array of tab logs

    if (!sessions || !Array.isArray(sessions)) {
      return res.status(400).json({ message: "Invalid session batch format." });
    }

    // Map and inject the authenticated user ID into every incoming session log record
    const preparedSessions = sessions.map((session) => ({
      ...session,
      user: req.user._id,
    }));

    // Bulk insert the batch to protect performance (PRD Checklist Guideline)
    await FocusSession.insertMany(preparedSessions);

    res.status(201).json({
      success: true,
      message: `${sessions.length} browser sessions synced successfully.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/distraction/report -> Aggregate today's metrics for the dashboard
const getDailyReport = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Fetch all logs recorded today for the active user
    const todaysSessions = await FocusSession.find({
      user: req.user._id,
      sessionDate: { $gte: startOfToday },
    });

    let totalBrowsingTime = 0;
    let distractionTime = 0;
    const domainMap = {};

    todaysSessions.forEach((session) => {
      totalBrowsingTime += session.timeSpent;
      if (session.isDistraction) {
        distractionTime += session.timeSpent;
      }

      // Track top distracting domains
      if (session.isDistraction) {
        domainMap[session.domain] = (domainMap[session.domain] || 0) + session.timeSpent;
      }
    });

    // PRD Distraction Score Formula: (distractionTime / totalBrowsingTime) * 100
    const distractionScore = totalBrowsingTime > 0 
      ? Math.round((distractionTime / totalBrowsingTime) * 100) 
      : 0;

    // Format top 5 distractors for the Recharts dashboard visualization layout
    const topDistractors = Object.entries(domainMap)
      .map(([domain, time]) => ({ domain, timeSpentMinutes: Math.round(time / 60) }))
      .sort((a, b) => b.timeSpentMinutes - a.timeSpentMinutes)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      distractionScore,
      totalBrowsingTimeMinutes: Math.round(totalBrowsingTime / 60),
      distractionTimeMinutes: Math.round(distractionTime / 60),
      topDistractors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  logTabBatch,
  getDailyReport,
};
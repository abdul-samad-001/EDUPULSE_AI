import { Card, Button } from "../ui";
import {
  Mail,
  Trophy,
  Flame,
  AlertTriangle,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

function NotificationsTab({ settings, onUpdate }) {
  const [testSent, setTestSent] = useState(false);

  const handleSendTestNotification = () => {
    setTestSent(true);
    setTimeout(() => {
      setTestSent(false);
    }, 2500);
  };

  const STREAK_TIMES = [
    { time: "08:00", label: "8:00 AM (Morning Kickoff)" },
    { time: "14:00", label: "2:00 PM (Afternoon Check-in)" },
    { time: "19:00", label: "7:00 PM (Peak Focus Prime)" },
    { time: "21:30", label: "9:30 PM (Evening Wind-down)" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Daily Streak Alarm & Schedule */}
      <Card
        title="🔥 Daily Streak Alarms & Reminders"
        subtitle="Ensure streak continuity by receiving targeted reminders before day end"
        className="w-full"
      >
        <div className="space-y-4 pt-1">
          {/* Reminder Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Daily Streak Protection Alarm</h5>
                <p className="text-[11px] text-dark-muted">Trigger proactive reminders to log study hours</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.streakReminderEnabled}
                onChange={(e) => onUpdate("streakReminderEnabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Time Picker Slots */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">
              Preferred Reminder Schedule
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STREAK_TIMES.map((slot) => {
                const isSelected = settings.streakReminderTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => onUpdate("streakReminderTime", slot.time)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-sm"
                        : "bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text hover:bg-dark-card/60"
                    }`}
                  >
                    <span>{slot.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Notification Button */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              icon={testSent ? CheckCircle2 : Send}
              onClick={handleSendTestNotification}
              fullWidth
              className={`text-xs ${testSent ? "text-emerald-400 border-emerald-500/40" : ""}`}
            >
              {testSent ? "Test Notification Dispatched!" : "Dispatch Test Reminder Notification"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. AI Intelligence Reports & Email Digests */}
      <Card
        title="📬 Weekly AI Performance Digest"
        subtitle="Automated weekly summary delivered to your inbox every Sunday evening"
        className="w-full"
      >
        <div className="space-y-3 pt-1">
          {/* Weekly Email Digest */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-primary" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Weekly Performance Digest Email</h5>
                <p className="text-[11px] text-dark-muted">Summary of top skills, focus hours, and study trajectory</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.weeklyDigestEmail}
                onChange={(e) => onUpdate("weeklyDigestEmail", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Milestone Achievements */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Badge & Level Fanfare</h5>
                <p className="text-[11px] text-dark-muted">Immediate visual celebration upon unlocking new achievements</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.achievementCelebration}
                onChange={(e) => onUpdate("achievementCelebration", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Real-time Procrastination Interventions */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Gentle Distraction Nudges</h5>
                <p className="text-[11px] text-dark-muted">Toast nudge when spending prolonged time on non-study tabs</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.distractionNudgeToast}
                onChange={(e) => onUpdate("distractionNudgeToast", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default NotificationsTab;

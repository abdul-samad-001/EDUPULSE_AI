import { useState } from "react";
import { Card, Button, toast } from "../ui";
import {
  Flame,
  Send,
  CheckCircle2,
  Volume2,
  Play,
} from "lucide-react";
import soundService from "../../utils/soundService";

function NotificationsTab({ settings, onUpdate }) {
  const [testSent, setTestSent] = useState(false);
  const [playingPack, setPlayingPack] = useState(null);

  const SOUND_AUDITIONS = [
    { id: "lofi", name: "Lo-Fi Chime", desc: "Mellow warm chime" },
    { id: "chime", name: "Crystal Shimmer", desc: "High crystalline bell" },
    { id: "digital", name: "Digital Ping", desc: "Crisp modern pop" },
    { id: "arcade", name: "Arcade Fanfare", desc: "8-bit victory run" },
    { id: "bell", name: "Singing Bell", desc: "Deep meditation resonance" },
  ];

  const handleAudition = (packId) => {
    setPlayingPack(packId);
    soundService.playSoundpack(packId);
    onUpdate("soundpack", packId);
    setTimeout(() => setPlayingPack(null), 600);
  };

  const handleSendTestNotification = () => {
    setTestSent(true);
    const activePack = settings?.soundpack || "lofi";
    soundService.playSoundpack(activePack);

    toast.info("🔥 Study Reminder Alert", {
      description: "Time to protect your daily streak! Open your focus workspace.",
    });

    setTimeout(() => {
      setTestSent(false);
    }, 2500);
  };

  const STREAK_TIMES = [
    { time: "08:00", label: "8:00 AM (Morning)" },
    { time: "14:00", label: "2:00 PM (Afternoon)" },
    { time: "19:00", label: "7:00 PM (Peak Prime)" },
    { time: "21:30", label: "9:30 PM (Wind-down)" },
  ];

  return (
    <div className="space-y-4">
      {/* 2-COLUMN COMPACT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Daily Streak Alarm & Schedule */}
        <Card
          title="🔥 Daily Streak Alarms & Reminders"
          subtitle="Proactive reminders to log study hours before day end"
          className="p-5"
        >
          <div className="space-y-3 pt-1">
            {/* Reminder Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border">
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <div>
                  <h5 className="text-xs font-bold text-dark-text">Daily Streak Protection Alarm</h5>
                  <p className="text-[10px] text-dark-muted">Trigger proactive reminders to log study hours</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.streakReminderEnabled}
                  onChange={(e) => onUpdate("streakReminderEnabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Time Picker Slots */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-dark-muted uppercase tracking-wider">
                Preferred Reminder Schedule
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STREAK_TIMES.map((slot) => {
                  const isSelected = settings?.streakReminderTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => onUpdate("streakReminderTime", slot.time)}
                      className={`p-2 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-xs"
                          : "bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text hover:bg-dark-card/60"
                      }`}
                    >
                      <span className="text-[11px]">{slot.label}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Notification Button */}
            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                icon={testSent ? CheckCircle2 : Send}
                onClick={handleSendTestNotification}
                fullWidth
                className={`text-xs py-1.5 ${testSent ? "text-emerald-400 border-emerald-500/40" : ""}`}
              >
                {testSent ? "Test Notification & Audio Dispatched! 🔔" : "Dispatch Test Notification & Sound"}
              </Button>
            </div>
          </div>
        </Card>

        {/* 2. Notification Audio & Sound Acoustics */}
        <Card
          title="🔊 Notification Acoustics & Chimes"
          subtitle="Test and select real audio sounds played during alerts"
          className="p-5"
        >
          <div className="space-y-3 pt-1">
            {/* Sound FX Master Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <h5 className="text-xs font-bold text-dark-text">Enable Audio Sound Effects</h5>
                  <p className="text-[10px] text-dark-muted">Play acoustic feedback on notifications and toasts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.soundFxEnabled}
                  onChange={(e) => onUpdate("soundFxEnabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Audition Soundpack Buttons */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-dark-muted uppercase tracking-wider">
                Click to Audition Sound:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SOUND_AUDITIONS.map((snd) => {
                  const isActive = settings?.soundpack === snd.id;
                  const isPlaying = playingPack === snd.id;

                  return (
                    <button
                      key={snd.id}
                      type="button"
                      onClick={() => handleAudition(snd.id)}
                      className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? "bg-primary/15 border-primary text-primary shadow-xs"
                          : "bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text hover:bg-dark-card/60"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-[11px] truncate">{snd.name}</span>
                        <Play className={`w-3 h-3 ${isPlaying ? "text-emerald-400 animate-spin" : isActive ? "text-primary" : "text-dark-muted"}`} />
                      </div>
                      <span className="text-[9px] text-dark-muted truncate">{snd.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extra Notification Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-dark-border/60">
              <div className="flex items-center justify-between p-2 rounded-xl bg-dark-bg border border-dark-border">
                <span className="text-[11px] font-semibold text-dark-text">Email Digest</span>
                <input
                  type="checkbox"
                  checked={settings?.weeklyDigestEmail}
                  onChange={(e) => onUpdate("weeklyDigestEmail", e.target.checked)}
                  className="rounded accent-primary"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-dark-bg border border-dark-border">
                <span className="text-[11px] font-semibold text-dark-text">Milestone Fanfare</span>
                <input
                  type="checkbox"
                  checked={settings?.achievementCelebration}
                  onChange={(e) => onUpdate("achievementCelebration", e.target.checked)}
                  className="rounded accent-amber-500"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default NotificationsTab;

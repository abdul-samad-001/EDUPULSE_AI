import { Card } from "../ui";
import {
  Volume2,
  VolumeX,
  Target,
  Sparkles,
  Coffee,
  CheckCircle2,
  Play,
} from "lucide-react";
import soundService from "../../utils/soundService";

function StudyPreferencesTab({ settings, onUpdate }) {
  const PRESETS = [
    { id: "pomodoro", name: "Classic Pomodoro", focus: 25, break: 5, desc: "25m sprint, 5m break" },
    { id: "deep_work", name: "Deep Work", focus: 50, break: 10, desc: "50m focus, 10m recovery" },
    { id: "ultradian", name: "Ultradian Rhythm", focus: 90, break: 20, desc: "90m flow, 20m break" },
    { id: "custom", name: "Custom Sprint", focus: settings?.customFocusMinutes || 45, break: settings?.customBreakMinutes || 10, desc: "Tailored duration" },
  ];

  const SOUNDPACKS = [
    { id: "lofi", name: "Lo-Fi Chime", icon: Volume2, desc: "Mellow ambient chime" },
    { id: "chime", name: "Crystal Shimmer", icon: Volume2, desc: "Crystalline bell chime" },
    { id: "digital", name: "Digital Ping", icon: Volume2, desc: "Modern UI pop" },
    { id: "arcade", name: "Arcade Fanfare", icon: Volume2, desc: "8-bit victory run" },
    { id: "bell", name: "Singing Bell", icon: Volume2, desc: "Meditation resonance" },
    { id: "none", name: "Mute / Silent", icon: VolumeX, desc: "Zero audio chimes" },
  ];

  const TARGETS = [1, 2, 3, 4, 5, 6, 8];

  const handleSelectSound = (soundId) => {
    onUpdate("soundpack", soundId);
    if (soundId !== "none") {
      soundService.playSoundpack(soundId);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* LEFT COLUMN: TARGETS + FOCUS TIMERS */}
      <div className="space-y-4">
        {/* 1. Daily Study Target */}
        <Card
          title="🎯 Daily Study Target"
          subtitle="Baseline productivity objective for streak progression"
          className="p-5"
        >
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-dark-muted uppercase tracking-wider">
                Target Hours
              </span>
              <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20">
                {settings?.dailyGoalHours || 4} Hours / Day
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {TARGETS.map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => onUpdate("dailyGoalHours", hours)}
                  className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    settings?.dailyGoalHours === hours
                      ? "bg-primary text-dark-bg shadow-sm scale-105"
                      : "bg-dark-bg text-dark-muted hover:text-dark-text hover:bg-dark-border/40 border border-dark-border"
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>

            <p className="text-[10px] text-dark-muted leading-relaxed">
              💡 <strong className="text-dark-text">EduPulse Recommendation:</strong> 3-4 hours daily balances retention and mental stamina.
            </p>
          </div>
        </Card>

        {/* 2. Focus Interval Presets */}
        <Card
          title="⏱️ Focus Interval Engine"
          subtitle="Configure default timers and break intervals"
          className="p-5"
        >
          <div className="grid grid-cols-2 gap-2 pt-1">
            {PRESETS.map((preset) => {
              const isSelected = settings?.focusPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => onUpdate("focusPreset", preset.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-xs"
                      : "bg-dark-bg border-dark-border hover:border-dark-border/80 hover:bg-dark-card/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-xs font-bold ${isSelected ? "text-primary" : "text-dark-text"}`}>
                      {preset.name}
                    </h4>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-dark-muted">
                    <span className="text-sky-400">{preset.focus}m Focus</span>
                    <span>•</span>
                    <span className="text-emerald-400">{preset.break}m Break</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* RIGHT COLUMN: SOUNDPACKS + AUTOMATION */}
      <div className="space-y-4">
        {/* 3. Ambient Audio & Soundpacks */}
        <Card
          title="🎧 Focus Soundpack & Acoustics"
          subtitle="Click to audition real-time soundpack tones"
          className="p-5"
        >
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SOUNDPACKS.map((sound) => {
                const Icon = sound.icon;
                const isSelected = settings?.soundpack === sound.id;
                return (
                  <div
                    key={sound.id}
                    onClick={() => handleSelectSound(sound.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/50 shadow-xs"
                        : "bg-dark-bg border-dark-border hover:bg-dark-card/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected ? "bg-amber-500/20 text-amber-400" : "bg-dark-card text-dark-muted"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {isSelected && <Play className="w-3 h-3 text-amber-400" />}
                    </div>
                    <div>
                      <h5 className={`text-xs font-bold truncate ${isSelected ? "text-amber-400" : "text-dark-text"}`}>
                        {sound.name}
                      </h5>
                      <p className="text-[9px] text-dark-muted truncate">{sound.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-bg border border-dark-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <div>
                  <h5 className="text-xs font-bold text-dark-text">Session Completion Fanfare</h5>
                  <p className="text-[10px] text-dark-muted">Play rewarding chime on session finish</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.soundFxEnabled}
                  onChange={(e) => onUpdate("soundFxEnabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* 4. Session Automation & Discipline Mode */}
        <Card
          title="🔒 Automation & Focus Guard"
          subtitle="Automate session state transitions"
          className="p-5"
        >
          <div className="space-y-2 pt-1">
            {/* Auto-start breaks */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-bg border border-dark-border">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-emerald-400" />
                <div>
                  <h5 className="text-xs font-bold text-dark-text">Automatic Break Transitions</h5>
                  <p className="text-[10px] text-dark-muted">Auto-start recovery timer on sprint completion</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.autoStartBreaks}
                  onChange={(e) => onUpdate("autoStartBreaks", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Target Skill Association */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-bg border border-dark-border">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-400" />
                <div>
                  <h5 className="text-xs font-bold text-dark-text">Auto-Link Active Skill</h5>
                  <p className="text-[10px] text-dark-muted">Auto-assign session XP to top roadmap skill</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.autoLinkSkill}
                  onChange={(e) => onUpdate("autoLinkSkill", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StudyPreferencesTab;

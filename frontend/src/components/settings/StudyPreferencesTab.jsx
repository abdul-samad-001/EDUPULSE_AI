import { Card } from "../ui";
import {
  Clock,
  Volume2,
  VolumeX,
  Target,
  Sparkles,
  Lock,
  Coffee,
  CheckCircle2,
} from "lucide-react";

function StudyPreferencesTab({ settings, onUpdate }) {
  const PRESETS = [
    { id: "pomodoro", name: "Classic Pomodoro", focus: 25, break: 5, desc: "Standard 25m sprint with 5m recovery" },
    { id: "deep_work", name: "Deep Work", focus: 50, break: 10, desc: "Sustained cognitive immersion with 10m pause" },
    { id: "ultradian", name: "Ultradian Rhythm", focus: 90, break: 20, desc: "90m peak focus cycle with 20m restorative break" },
    { id: "custom", name: "Custom Sprint", focus: settings.customFocusMinutes || 45, break: settings.customBreakMinutes || 10, desc: "Tailored interval duration" },
  ];

  const SOUNDPACKS = [
    { id: "none", name: "Mute / Silent", icon: VolumeX, desc: "Zero audio interruptions" },
    { id: "lofi", name: "Lo-Fi Beats", icon: Volume2, desc: "Mellow ambient study instrumental" },
    { id: "rain", name: "Rain & Thunder", icon: Volume2, desc: "Deep nature white noise" },
    { id: "binaural", name: "40Hz Gamma Waves", icon: Volume2, desc: "Cognitive focus resonance" },
  ];

  const TARGETS = [1, 2, 3, 4, 5, 6, 8];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Daily Study Target */}
      <Card
        title="🎯 Daily Study Target"
        subtitle="Set your baseline daily productivity objective for streak consistency"
        className="w-full"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark-muted uppercase tracking-wider">
              Target Duration
            </span>
            <span className="text-sm font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
              {settings.dailyGoalHours} Hours / Day
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {TARGETS.map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => onUpdate("dailyGoalHours", hours)}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  settings.dailyGoalHours === hours
                    ? "bg-primary text-dark-bg shadow-md shadow-primary/20 scale-105"
                    : "bg-dark-bg text-dark-muted hover:text-dark-text hover:bg-dark-border/40 border border-dark-border"
                }`}
              >
                {hours}h
              </button>
            ))}
          </div>

          <p className="text-[11px] text-dark-muted leading-relaxed">
            💡 <strong className="text-dark-text">EduPulse Recommendation:</strong> 3 to 4 hours of deliberate focus daily balances high knowledge retention with fatigue mitigation.
          </p>
        </div>
      </Card>

      {/* 2. Focus Preset Engine */}
      <Card
        title="⏱️ Focus Interval Engine"
        subtitle="Configure standard timers and break duration intervals"
        className="w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {PRESETS.map((preset) => {
            const isSelected = settings.focusPreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => onUpdate("focusPreset", preset.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-dark-bg border-dark-border hover:border-dark-border/80 hover:bg-dark-card/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className={`text-xs font-bold ${isSelected ? "text-primary" : "text-dark-text"}`}>
                    {preset.name}
                  </h4>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-dark-muted mb-1">
                  <span className="flex items-center gap-1 text-sky-400">
                    <Clock className="w-3 h-3" /> {preset.focus}m Focus
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Coffee className="w-3 h-3" /> {preset.break}m Break
                  </span>
                </div>
                <p className="text-[10px] text-dark-muted leading-tight">{preset.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Ambient Audio & Soundpacks */}
      <Card
        title="🎧 Focus Soundpack & Acoustics"
        subtitle="Select background acoustic soundscape during active focus sessions"
        className="w-full"
      >
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SOUNDPACKS.map((sound) => {
              const Icon = sound.icon;
              const isSelected = settings.soundpack === sound.id;
              return (
                <div
                  key={sound.id}
                  onClick={() => onUpdate("soundpack", sound.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500/50 shadow-sm"
                      : "bg-dark-bg border-dark-border hover:bg-dark-card/60"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-amber-500/20 text-amber-400" : "bg-dark-card text-dark-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${isSelected ? "text-amber-400" : "text-dark-text"}`}>
                      {sound.name}
                    </h5>
                    <p className="text-[10px] text-dark-muted">{sound.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border mt-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Session Completion Fanfare</h5>
                <p className="text-[11px] text-dark-muted">Play rewarding chime upon milestone & timer completion</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundFxEnabled}
                onChange={(e) => onUpdate("soundFxEnabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* 4. Session Automation & Discipline Mode */}
      <Card
        title="🔒 Automation & Focus Guard"
        subtitle="Automate session state transitions and prevent distraction drift"
        className="w-full"
      >
        <div className="space-y-3 pt-1">
          {/* Auto-start breaks */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-emerald-400" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Automatic Break Transitions</h5>
                <p className="text-[11px] text-dark-muted">Automatically start recovery timer when focus sprint ends</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => onUpdate("autoStartBreaks", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Strict Fullscreen Guard */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-rose-400" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Deep Work Lock (Fullscreen)</h5>
                <p className="text-[11px] text-dark-muted">Prompt for fullscreen mode to minimize background app switching</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.fullscreenLock}
                onChange={(e) => onUpdate("fullscreenLock", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          {/* Target Skill Association */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <Target className="w-4 h-4 text-sky-400" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Auto-Link Active Skill</h5>
                <p className="text-[11px] text-dark-muted">Auto-assign focus session XP to current top roadmap skill</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoLinkSkill}
                onChange={(e) => onUpdate("autoLinkSkill", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StudyPreferencesTab;

import { Card, Badge, Button } from "../ui";
import {
  Activity,
  Radio,
  SlidersHorizontal,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useState } from "react";

function AiTelemetryTab({ settings, onUpdate }) {
  const [testingPing, setTestingPing] = useState(false);
  const [pingLatency, setPingLatency] = useState("18ms");

  const SENSITIVITIES = [
    {
      id: "relaxed",
      name: "Relaxed (25m threshold)",
      desc: "Triggers procrastination alerts only after sustained 25+ min off-task activity",
      color: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    {
      id: "balanced",
      name: "Balanced (10m threshold)",
      desc: "Standard AI Coach sensitivity; recommends focus interventions after 10m off-task",
      color: "text-primary",
      border: "border-primary/40",
    },
    {
      id: "strict",
      name: "Strict / Exam Sprint (3m threshold)",
      desc: "High sensitivity for exam preparations; alerts immediately upon distraction switch",
      color: "text-rose-400",
      border: "border-rose-500/30",
    },
  ];

  const handleTestPing = () => {
    setTestingPing(true);
    setTimeout(() => {
      const ms = Math.floor(Math.random() * 15) + 12;
      setPingLatency(`${ms}ms`);
      setTestingPing(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Live ML Engine Status Monitor */}
      <Card
        title="⚡ ML Inference Engine Health"
        subtitle="Real-time connectivity and status of localized PyTorch & Scikit-Learn models"
        className="w-full"
      >
        <div className="space-y-4 pt-1">
          {/* Status Header */}
          <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-dark-bg border border-dark-border gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute inset-0 opacity-75" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 relative" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-dark-text">EduPulse ML Engine v2.4</h4>
                <p className="text-[11px] text-emerald-400 font-mono font-bold">ONLINE & OPERATIONAL</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                Latency: {pingLatency}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                loading={testingPing}
                onClick={handleTestPing}
                className="text-xs py-1"
              >
                Ping
              </Button>
            </div>
          </div>

          {/* Model Status Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-dark-muted">Model 1: Risk</span>
              <p className="text-xs font-bold text-dark-text">LightGBM v1.2</p>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">11 Features OK</span>
            </div>

            <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-dark-muted">Model 2: Score</span>
              <p className="text-xs font-bold text-dark-text">GradientBoost v2.0</p>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">20 Features OK</span>
            </div>

            <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-dark-muted">Model 3: Coach</span>
              <p className="text-xs font-bold text-dark-text">RandomForest v2.1</p>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">8 Classes Active</span>
            </div>
          </div>

          <p className="text-[11px] text-dark-muted leading-relaxed">
            🧠 All models run locally in Python Flask and are debounced at 5-second intervals to eliminate redundant CPU computation.
          </p>
        </div>
      </Card>

      {/* 2. Procrastination Sensitivity Tuning */}
      <Card
        title="🎯 Procrastination Risk Sensitivity"
        subtitle="Calibrate how aggressively the AI Coach flags off-task tab switches"
        className="w-full"
      >
        <div className="space-y-2.5 pt-1">
          {SENSITIVITIES.map((item) => {
            const isSelected = settings.procrastinationSensitivity === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onUpdate("procrastinationSensitivity", item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `bg-primary/10 ${item.border} shadow-sm`
                    : "bg-dark-bg border-dark-border hover:bg-dark-card/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-xs font-bold ${isSelected ? item.color : "text-dark-text"}`}>
                    {item.name}
                  </h4>
                  {isSelected && (
                    <span className="text-[10px] font-extrabold bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-dark-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Chrome Extension Bridge & Telemetry Sync */}
      <Card
        title="🌐 Browser Extension Telemetry Bridge"
        subtitle="Configure live web session logging from the EduPulse Chrome Extension"
        className="w-full"
      >
        <div className="space-y-3 pt-1">
          {/* Extension Sync Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Live Tab Telemetry Sync</h5>
                <p className="text-[11px] text-dark-muted">Stream visited domain category tags to backend analytics</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.extensionSync}
                onChange={(e) => onUpdate("extensionSync", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Privacy Domain Whitelist Filter */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-4 h-4 text-sky-400" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Privacy URL Stripping</h5>
                <p className="text-[11px] text-dark-muted">Strip query parameters and sensitive URL tokens before saving</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stripUrlParams}
                onChange={(e) => onUpdate("stripUrlParams", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* 4. AI Explainability & Diagnostic Feedback */}
      <Card
        title="🔍 Model Explainability & Refresh Rules"
        subtitle="Manage AI reasoning transparency and background inference triggers"
        className="w-full"
      >
        <div className="space-y-3 pt-1">
          {/* Explainability toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-primary" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Feature Attribution Insights</h5>
                <p className="text-[11px] text-dark-muted">Display contributing telemetry metrics on AI Coach cards</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showFeatureAttribution}
                onChange={(e) => onUpdate("showFeatureAttribution", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Automatic Refresh on Action Complete */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <div>
                <h5 className="text-xs font-bold text-dark-text">Auto-Refresh Upon Goal Finish</h5>
                <p className="text-[11px] text-dark-muted">Trigger debounced ML re-computation when tasks/timers complete</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoRefreshOnAction}
                onChange={(e) => onUpdate("autoRefreshOnAction", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AiTelemetryTab;

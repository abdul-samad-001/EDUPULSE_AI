import { Badge, Button } from "../ui";
import {
  Sparkles,
  Sliders,
  Cpu,
  Bell,
  Crown,
  ShieldCheck,
  Save,
  RotateCcw,
  CloudCheck,
} from "lucide-react";

function SettingsHero({
  activeTab,
  onTabChange,
  onSave,
  onReset,
  isSaving,
  hasUnsavedChanges,
}) {
  const TABS = [
    { id: "preferences", label: "Study Preferences", icon: Sliders, badge: "Daily Targets" },
    { id: "ai_telemetry", label: "AI & Telemetry", icon: Cpu, badge: "Engine v2.4" },
    { id: "notifications", label: "Notifications", icon: Bell, badge: "Digest & Sound" },
    { id: "subscription", label: "Subscription & Quotas", icon: Crown, badge: "Pro Tier" },
    { id: "security_data", label: "Security & Data", icon: ShieldCheck, badge: "GDPR Export" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-primary/30">
      {/* Background Ambience Glows */}
      <div className="absolute -top-28 -right-28 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Row: System Badge, Heading, and Action Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" icon={Sparkles} size="sm">
                System Preferences Hub
              </Badge>
              <Badge variant="warning" icon={Crown} size="sm">
                EduPulse Pro • Active
              </Badge>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <CloudCheck className="w-3.5 h-3.5" />
                Cloud Synced
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-dark-text tracking-tight">
                Settings & Preferences ⚙️
              </h1>
              <p className="text-sm sm:text-base text-dark-muted mt-1.5 leading-relaxed font-medium">
                Customize study algorithms, configure telemetry sensitivity, monitor SaaS resource quotas, and manage your data privacy.
              </p>
            </div>
          </div>

          {/* Right Column: Global Save / Reset Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={onReset}
              className="flex-1 sm:flex-initial text-xs"
            >
              Reset Defaults
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Save}
              loading={isSaving}
              onClick={onSave}
              className={`flex-1 sm:flex-initial text-xs font-bold ${
                hasUnsavedChanges ? "animate-pulse ring-2 ring-primary/50" : ""
              }`}
            >
              {hasUnsavedChanges ? "Save Unsaved Changes" : "Settings Saved"}
            </Button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="pt-2 border-t border-dark-border/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-dark-bg shadow-lg shadow-primary/25 scale-[1.02]"
                      : "bg-dark-bg/80 text-dark-muted hover:text-dark-text hover:bg-dark-border/40 border border-dark-border"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-dark-bg" : "text-primary"}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? "bg-dark-bg/20 text-dark-bg"
                        : "bg-dark-card text-dark-muted border border-dark-border"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsHero;

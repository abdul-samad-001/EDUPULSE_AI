import { Badge, Button } from "../ui";
import {
  Sparkles,
  User,
  Layers,
  Sliders,
  Bell,
  Crown,
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
    { id: "profile", label: "Profile & Account", icon: User, badge: "Identity & OTP" },
    { id: "extension", label: "Browser Extension", icon: Layers, badge: "Download & Setup" },
    { id: "preferences", label: "Study Preferences", icon: Sliders, badge: "Daily Targets" },
    { id: "notifications", label: "Notifications", icon: Bell, badge: "Digest & Sound" },
    { id: "subscription", label: "Subscription & Quotas", icon: Crown, badge: "Pro Tier" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border p-4 sm:p-6 shadow-xl transition-all duration-300 hover:border-primary/30">
      {/* Background Ambience Glows */}
      <div className="absolute -top-28 -right-28 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Row: System Badge, Heading, and Action Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" icon={Sparkles} size="sm">
                Settings Hub
              </Badge>
              <Badge variant="warning" icon={Crown} size="sm">
                EduPulse Pro
              </Badge>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CloudCheck className="w-3 h-3" />
                Cloud Synced
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-dark-text tracking-tight">
                Settings & Preferences ⚙️
              </h1>
              <p className="text-xs sm:text-sm text-dark-muted mt-0.5 font-medium">
                Manage your account credentials, browser companion extension, study targets, and acoustic notifications.
              </p>
            </div>
          </div>

          {/* Right Column: Global Save / Reset Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={onReset}
              className="flex-1 sm:flex-initial text-xs py-1.5"
            >
              Reset Defaults
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Save}
              loading={isSaving}
              onClick={onSave}
              className={`flex-1 sm:flex-initial text-xs font-bold py-1.5 ${
                hasUnsavedChanges ? "animate-pulse ring-2 ring-primary/50" : ""
              }`}
            >
              {hasUnsavedChanges ? "Save Changes" : "Settings Saved"}
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-dark-bg shadow-md shadow-primary/25 scale-[1.02]"
                      : "bg-dark-bg/80 text-dark-muted hover:text-dark-text hover:bg-dark-border/40 border border-dark-border"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-dark-bg" : "text-primary"}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
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

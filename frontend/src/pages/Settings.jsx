import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SettingsHero,
  StudyPreferencesTab,
  AiTelemetryTab,
  NotificationsTab,
  SubscriptionTab,
  SecurityDataTab,
} from "../components/settings";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/ui";

const SETTINGS_STORAGE_KEY = "edupulse_user_settings";

const DEFAULT_SETTINGS = {
  // 1. Study Preferences
  dailyGoalHours: 4,
  focusPreset: "pomodoro",
  customFocusMinutes: 45,
  customBreakMinutes: 10,
  soundpack: "lofi",
  soundFxEnabled: true,
  autoStartBreaks: true,
  fullscreenLock: false,
  autoLinkSkill: true,

  // 2. AI & Telemetry
  procrastinationSensitivity: "balanced",
  extensionSync: true,
  stripUrlParams: true,
  showFeatureAttribution: true,
  autoRefreshOnAction: true,

  // 3. Notifications
  streakReminderEnabled: true,
  streakReminderTime: "19:00",
  weeklyDigestEmail: true,
  achievementCelebration: true,
  distractionNudgeToast: true,
};

function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("preferences");
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch (err) {
      console.error("Failed to load settings from storage:", err);
      return DEFAULT_SETTINGS;
    }
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        setHasUnsavedChanges(false);
        toast.success("Preferences Saved", {
          description: "Your study configurations and preferences have been persisted.",
        });
      } catch (err) {
        console.error("Save error:", err);
        toast.error("Save Failed", {
          description: "Failed to save preferences to local storage.",
        });
      } finally {
        setIsSaving(false);
      }
    }, 400);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasUnsavedChanges(true);
    toast.warning("Preferences Reset", {
      description: "Restored system defaults. Click Save to persist.",
    });
  };

  const handleExportJSON = () => {
    const exportPayload = {
      user: {
        id: user?._id || user?.id || "STU-079582",
        name: user?.name || "Student Learner",
        email: user?.email || "student@edupulse.ai",
        tier: "EduPulse Pro Scholar",
      },
      settings,
      timestamp: new Date().toISOString(),
      version: "2.4.0",
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EduPulse_User_Backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup Downloaded", {
      description: "JSON user settings backup exported.",
    });
  };

  const handleExportCSV = () => {
    const csvContent =
      "Session ID,Date,Planned (min),Actual (min),Focus Score,Category,Status\n" +
      `SESS-101,${new Date().toLocaleDateString()},45,44,92,Coding,Completed\n` +
      `SESS-102,${new Date().toLocaleDateString()},25,25,88,Revision,Completed\n` +
      `SESS-103,${new Date().toLocaleDateString()},50,48,95,General,Completed\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EduPulse_Focus_Sessions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV Exported", {
      description: "Focus log spreadsheet exported.",
    });
  };

  const handleClearCache = () => {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    setSettings(DEFAULT_SETTINGS);
    toast.info("Cache Purged", {
      description: "Local storage and dashboard cache purged. Reloading...",
    });
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Settings Hero Card & Tabs Navigation */}
      <SettingsHero
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Tab Panels with Smooth Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "preferences" && (
            <StudyPreferencesTab settings={settings} onUpdate={handleUpdate} />
          )}

          {activeTab === "ai_telemetry" && (
            <AiTelemetryTab settings={settings} onUpdate={handleUpdate} />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab settings={settings} onUpdate={handleUpdate} />
          )}

          {activeTab === "subscription" && <SubscriptionTab />}

          {activeTab === "security_data" && (
            <SecurityDataTab
              onExportJSON={handleExportJSON}
              onExportCSV={handleExportCSV}
              onClearCache={handleClearCache}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Settings;
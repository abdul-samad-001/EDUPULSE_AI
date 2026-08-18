import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SettingsHero,
  ProfileAccountTab,
  ExtensionTab,
  StudyPreferencesTab,
  NotificationsTab,
  SubscriptionTab,
} from "../components/settings";
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

  // 2. Notifications
  streakReminderEnabled: true,
  streakReminderTime: "19:00",
  weeklyDigestEmail: true,
  achievementCelebration: true,
  distractionNudgeToast: true,
};

function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (newTab) => {
    setSearchParams({ tab: newTab });
  };

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

  return (
    <div className="space-y-5 pb-8">
      {/* Settings Hero Card & Tabs Navigation */}
      <SettingsHero
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Tab Panels with Smooth Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === "profile" && <ProfileAccountTab />}

          {activeTab === "extension" && <ExtensionTab />}

          {activeTab === "preferences" && (
            <StudyPreferencesTab settings={settings} onUpdate={handleUpdate} />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab settings={settings} onUpdate={handleUpdate} />
          )}

          {activeTab === "subscription" && <SubscriptionTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Settings;
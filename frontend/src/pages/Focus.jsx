import { useEffect, useState } from "react";

import focusSessionService from "../services/focusSessionService";
import skillService from "../services/skillService";

import {
  FocusTimer,
  FocusControls,
  FocusStats,
  SessionHistory,
} from "../components/focus";

import { SectionHeader, LoadingSpinner } from "../components/ui";
import { Timer } from "lucide-react";

function Focus() {
  const [activeSession, setActiveSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [activeRes, historyRes, skillsRes] =
        await Promise.all([
          focusSessionService.getActiveSession(),
          focusSessionService.getHistory(),
          skillService.getAllSkills(),
        ]);

      setActiveSession(activeRes.data);
      setHistory(historyRes.data || []);
      setSkills(skillsRes || []);
    } catch (error) {
      console.error("Focus Page Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading Focus Module..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Focus Sessions 🎯"
        subtitle="Manage Pomodoro focus intervals, session tracking, and historical metrics."
        icon={Timer}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <FocusTimer session={activeSession} />

        <FocusControls
          session={activeSession}
          skills={skills}
          onSessionChange={loadData}
        />
      </div>

      <div>
        <FocusStats history={history} />
      </div>

      <SessionHistory history={history} />
    </div>
  );
}

export default Focus;
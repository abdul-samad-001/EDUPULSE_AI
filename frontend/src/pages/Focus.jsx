import { useEffect, useState } from "react";

import focusSessionService from "../services/focusSessionService";
import skillService from "../services/skillService";

import {
  FocusTimer,
  FocusControls,
  FocusStats,
  SessionHistory,
} from "../components/focus";

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
    setSkills(skillsRes);
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
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Focus Module...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          🎯 Focus Sessions
        </h1>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          <FocusTimer
            session={activeSession}
          />

          <FocusControls
            session={activeSession}
            skills={skills}
            onSessionChange={loadData}
          />

        </div>

        <div className="mb-8">

          <FocusStats
            history={history}
          />

        </div>

        <SessionHistory
          history={history}
        />

      </div>

    </div>
  );
}

export default Focus;
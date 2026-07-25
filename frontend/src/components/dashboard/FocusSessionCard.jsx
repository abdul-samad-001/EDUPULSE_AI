import { useEffect, useState } from "react";
import skillService from "../../services/skillService";
import focusSessionService from "../../services/focusSessionService";

function FocusSessionCard() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [duration, setDuration] = useState(25);

  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [activeSession, setActiveSession] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const loadSkills = async () => {
    try {
      const data = await skillService.getAllSkills();
      setSkills(data || []);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load skills.");
    } finally {
      setLoadingSkills(false);
    }
  };

  const loadActiveSession = async () => {
    try {
      const response = await focusSessionService.getActiveSession();

      if (response.success && response.data) {
        const session = response.data;

        setActiveSession(session);

        const endTime =
          new Date(session.startedAt).getTime() +
          session.plannedDurationMinutes * 60 * 1000;

        setRemainingSeconds(
          Math.max(
            0,
            Math.floor((endTime - Date.now()) / 1000)
          )
        );
      } else {
        setActiveSession(null);
        setRemainingSeconds(0);
      }
    } catch {
      setActiveSession(null);
      setRemainingSeconds(0);
    }
  };

  const stopActiveSession = async () => {
    try {
      const response = await focusSessionService.stopSession();

      setMessage(response?.message || "Session stopped.");

      setActiveSession(null);
      setRemainingSeconds(0);

      setSelectedSkill("");
      setDuration(25);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to stop session."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    await stopActiveSession();
  };

  const handleStart = async () => {
    setMessage("");

    if (!selectedSkill) {
      setMessage("Please select a skill.");
      return;
    }

    try {
      setLoading(true);

      const response = await focusSessionService.startSession({
        skill: selectedSkill,
        plannedDurationMinutes: Number(duration),
      });

      setMessage(response.message);

      await loadActiveSession();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Failed to start focus session."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return `${mins}:${secs}`;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSkills();
    loadActiveSession();
  }, []);

  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  useEffect(() => {
    if (activeSession && remainingSeconds === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      stopActiveSession();
    }
  }, [activeSession, remainingSeconds]);
return (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-2xl font-bold mb-5">
      🎯 Focus Session
    </h2>

    {message && (
      <div className="mb-4 rounded-lg bg-slate-100 border border-slate-200 p-3 text-sm">
        {message}
      </div>
    )}

    {activeSession ? (
      <div className="space-y-5">

        <div className="rounded-xl border border-green-200 bg-green-50 p-5">

          <h3 className="text-xl font-bold text-green-700">
            Active Focus Session
          </h3>

          <div className="mt-4 space-y-2">

            <p>
              <span className="font-semibold">Skill:</span>{" "}
              {activeSession.skill.skillName}
            </p>

            <p>
              <span className="font-semibold">Planned Duration:</span>{" "}
              {activeSession.plannedDurationMinutes} min
            </p>

          </div>

          <div className="mt-8 text-center">

            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Remaining Time
            </p>

            <h1 className="text-6xl font-bold text-green-700 mt-3">
              {formatTime(remainingSeconds)}
            </h1>

          </div>

        </div>

        <button
          onClick={handleStop}
          disabled={loading}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Stopping Session..." : "Stop Session"}
        </button>

      </div>
    ) : (
      <div className="space-y-4">

        <div>

          <label className="block mb-2 font-medium">
            Select Skill
          </label>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            disabled={loadingSkills}
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              {loadingSkills
                ? "Loading skills..."
                : "Choose a skill"}
            </option>

            {skills.map((skill) => (
              <option
                key={skill._id}
                value={skill._id}
              >
                {skill.skillName}
              </option>
            ))}
          </select>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Planned Duration (minutes)
          </label>

          <input
            type="number"
            min="1"
            max="240"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

        </div>

        <button
          onClick={handleStart}
          disabled={loading || loadingSkills}
          className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading
            ? "Starting Focus Session..."
            : "Start Focus Session"}
        </button>

      </div>
    )}
  </div>
);
}

export default FocusSessionCard;

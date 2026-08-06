import { useState } from "react";
import focusSessionService from "../../services/focusSessionService";

function FocusControls({
  session,
  skills = [],
  onSessionChange,
}) {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [duration, setDuration] = useState(25);
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    if (!selectedSkill) {
      alert("Please select a skill.");
      return;
    }

    try {
      setLoading(true);

      await focusSessionService.startSession({
        skill: selectedSkill,
        plannedDurationMinutes: duration,
      });

      if (onSessionChange) {
        onSessionChange();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to start session.");
    } finally {
      setLoading(false);
    }
  };

  const stopSession = async () => {
    try {
      setLoading(true);

      await focusSessionService.stopSession();

      if (onSessionChange) {
        onSessionChange();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to stop session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-5">
        🎯 Focus Controls
      </h2>

      {!session ? (
        <>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          >
            <option value="">Select Skill</option>

            {skills.map((skill) => (
              <option key={skill._id} value={skill._id}>
                {skill.skillName}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="5"
            max="180"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full border rounded-lg p-3 mb-4"
          />

          <button
            onClick={startSession}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Starting..." : "▶ Start Focus Session"}
          </button>
        </>
      ) : (
        <>
          <div className="mb-5">

            <p className="font-semibold">
              Active Session
            </p>

            <p className="text-slate-500">
              {session.skill?.skillName}
            </p>

          </div>

          <button
            onClick={stopSession}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Stopping..." : "■ Stop Session"}
          </button>
        </>
      )}

    </div>
  );
}

export default FocusControls;
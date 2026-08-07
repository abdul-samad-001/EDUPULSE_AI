import { useState } from "react";
import focusSessionService from "../../services/focusSessionService";
import { Card, Button } from "../ui";
import { Play, Square } from "lucide-react";

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
    <Card title="🎯 Focus Controls" className="w-full">
      {!session ? (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-dark-muted mb-1">
              Select Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs sm:text-sm p-2.5 focus:outline-none focus:border-primary/50"
            >
              <option value="">Choose a skill</option>
              {skills.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.skillName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-dark-muted mb-1">
              Planned Duration (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs sm:text-sm p-2.5 focus:outline-none focus:border-primary/50"
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={startSession}
            loading={loading}
            icon={Play}
            size="md"
            className="mt-2"
          >
            {loading ? "Starting..." : "Start Focus Session"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
            <p className="text-xs text-dark-muted">Active Session</p>
            <p className="text-sm font-semibold text-dark-text mt-0.5">
              {session.skill?.skillName}
            </p>
          </div>

          <Button
            variant="danger"
            fullWidth
            onClick={stopSession}
            loading={loading}
            icon={Square}
            size="md"
          >
            {loading ? "Stopping..." : "Stop Session"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default FocusControls;
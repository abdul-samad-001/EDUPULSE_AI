import { useState } from "react";
import focusSessionService from "../../services/focusSessionService";
import { Card, Button } from "../ui";
import { Play, Square, FileText, Target, Clock } from "lucide-react";

function FocusControls({ session, skills = [], onSessionChange }) {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [duration, setDuration] = useState(25);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const DURATION_PRESETS = [15, 25, 45, 60, 90];

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
        notes: notes.trim(),
      });

      setNotes("");

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
    <Card
      title="🎯 Focus Controls & Setup"
      subtitle="Configure your target interval and focus objectives"
      className="w-full h-full flex flex-col justify-between"
    >
      {!session ? (
        <div className="space-y-4 my-auto py-1">
          {/* Skill Selection */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">
              <Target className="w-3.5 h-3.5 text-primary" />
              Target Skill <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs sm:text-sm p-3 focus:outline-none focus:border-primary/50"
            >
              <option value="">Choose a skill track</option>
              {skills.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.skillName} ({skill.category || "General"})
                </option>
              ))}
            </select>
          </div>

          {/* Duration Presets & Input */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Interval Duration (Minutes)
            </label>

            {/* Presets Row */}
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDuration(preset)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    duration === preset
                      ? "bg-primary text-dark-bg shadow-md scale-105"
                      : "bg-dark-bg border border-dark-border text-dark-muted hover:text-dark-text hover:border-primary/40"
                  }`}
                >
                  {preset}m
                </button>
              ))}
            </div>

            <input
              type="number"
              min="5"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs sm:text-sm p-2.5 focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Session Notes (NEW) */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              Session Goal / Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Build authentication endpoints, solve 2 LeetCode problems..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs sm:text-sm p-2.5 focus:outline-none focus:border-primary/50"
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={startSession}
            loading={loading}
            icon={Play}
            size="lg"
            className="mt-1 shadow-md shadow-primary/20"
          >
            {loading ? "Starting Session..." : "▶ Start Focus Session"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 my-auto py-2">
          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-dark-muted">
              <span>Active Skill Track</span>
              <span className="text-primary font-bold">In Progress</span>
            </div>
            <p className="text-base font-extrabold text-dark-text">
              {session.skill?.skillName || "Active Skill"}
            </p>
            {session.notes && (
              <p className="text-xs text-dark-muted italic border-t border-dark-border/60 pt-2 mt-2">
                "{session.notes}"
              </p>
            )}
          </div>

          <Button
            variant="danger"
            fullWidth
            onClick={stopSession}
            loading={loading}
            icon={Square}
            size="lg"
            className="shadow-md shadow-rose-500/20"
          >
            {loading ? "Stopping Session..." : "Stop Active Session"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default FocusControls;
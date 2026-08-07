import { useEffect, useState, useCallback } from "react";
import skillService from "../../services/skillService";
import focusSessionService from "../../services/focusSessionService";
import { Card, Button, Badge } from "../ui";
import { Target, Play, Square } from "lucide-react";

function FocusSessionCard() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [duration, setDuration] = useState(25);

  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [activeSession, setActiveSession] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const loadSkills = useCallback(async () => {
    try {
      const data = await skillService.getAllSkills();
      setSkills(data || []);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load skills.");
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  const loadActiveSession = useCallback(async () => {
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
  }, []);

  const stopActiveSession = useCallback(async () => {
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
  }, []);

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
    const fetchData = async () => {
      await loadSkills();
      await loadActiveSession();
    };
    fetchData();
  }, [loadSkills, loadActiveSession]);

  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          stopActiveSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, stopActiveSession]);

  return (
    <Card
      title="🎯 Focus Session"
      subtitle="Track your focus blocks with deep work timer"
      className="w-full"
    >
      {message && (
        <div className="mb-3 rounded-xl bg-dark-border/80 border border-dark-border p-2.5 text-xs text-primary font-medium">
          {message}
        </div>
      )}

      {activeSession ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
            <Badge variant="primary" icon={Target} className="mb-2" size="sm">
              Active Focus Mode
            </Badge>

            <div className="space-y-0.5 mb-2">
              <p className="text-xs font-semibold text-dark-text">
                {activeSession.skill?.skillName}
              </p>
              <p className="text-[11px] text-dark-muted">
                Planned Duration: {activeSession.plannedDurationMinutes} mins
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight my-1 font-mono">
              {formatTime(remainingSeconds)}
            </h1>
          </div>

          <Button
            variant="danger"
            fullWidth
            onClick={handleStop}
            loading={loading}
            icon={Square}
            size="md"
          >
            {loading ? "Stopping..." : "Stop Session"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-dark-muted mb-1">
              Select Skill
            </label>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              disabled={loadingSkills}
              className="w-full rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs sm:text-sm p-2.5 focus:outline-none focus:border-primary/50"
            >
              <option value="">
                {loadingSkills ? "Loading skills..." : "Choose a skill"}
              </option>

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
              min="1"
              max="240"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs sm:text-sm p-2.5 focus:outline-none focus:border-primary/50"
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleStart}
            loading={loading}
            disabled={loadingSkills}
            icon={Play}
            size="md"
            className="mt-1"
          >
            {loading ? "Starting Session..." : "Start Focus Session"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default FocusSessionCard;
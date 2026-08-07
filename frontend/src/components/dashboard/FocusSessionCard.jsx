import { useEffect, useState, useCallback } from "react";
import skillService from "../../services/skillService";
import focusSessionService from "../../services/focusSessionService";
import { Card, Button, Badge, Progress } from "../ui";
import { Target, Play, Square, Clock } from "lucide-react";

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

  // Calculate progress percentage for current session
  const totalPlannedSecs = (activeSession?.plannedDurationMinutes || 25) * 60;
  const elapsedSecs = Math.max(0, totalPlannedSecs - remainingSeconds);
  const sessionProgressPct = totalPlannedSecs > 0 ? Math.min(100, Math.round((elapsedSecs / totalPlannedSecs) * 100)) : 0;

  return (
    <Card
      title="🎯 Focus Session"
      subtitle="Deep work timer and active session manager"
      className="w-full h-full flex flex-col justify-between"
      id="focus-session-card"
    >
      {message && (
        <div className="mb-3 rounded-xl bg-dark-border/80 border border-dark-border p-2.5 text-xs text-primary font-medium">
          {message}
        </div>
      )}

      {activeSession ? (
        <div className="space-y-4 my-auto">
          <div className="rounded-2xl border border-primary/40 bg-linear-to-b from-primary/10 via-dark-bg to-dark-bg p-5 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Clock className="w-24 h-24 text-primary" />
            </div>

            <Badge variant="primary" icon={Target} className="mb-2" size="sm">
              Active Focus Mode
            </Badge>

            <div className="space-y-0.5 mb-3">
              <h4 className="text-base font-bold text-dark-text">
                {activeSession.skill?.skillName || "Target Skill"}
              </h4>
              <p className="text-xs text-dark-muted font-medium">
                Planned Block: {activeSession.plannedDurationMinutes} mins
              </p>
            </div>

            <div className="relative inline-flex items-center justify-center my-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight font-mono drop-shadow-[0_0_15px_rgba(124,231,208,0.3)]">
                {formatTime(remainingSeconds)}
              </h1>
            </div>

            <div className="w-full max-w-xs mx-auto mt-3">
              <Progress value={sessionProgressPct} max={100} size="md" color="primary" showLabel label="Session Elapsed" />
            </div>
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
        <div className="space-y-3.5 my-auto">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1.5">
              Select Target Skill
            </label>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              disabled={loadingSkills}
              className="w-full rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs sm:text-sm p-3 focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="">
                {loadingSkills ? "Loading skills..." : "Choose a skill..."}
              </option>

              {skills.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.skillName} ({skill.category || "General"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-muted mb-1.5">
              Planned Duration (minutes)
            </label>

            <div className="grid grid-cols-4 gap-2 mb-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    Number(duration) === mins
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text"
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

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
            size="lg"
            className="mt-2 shadow-lg shadow-primary/20"
          >
            {loading ? "Starting Session..." : "Start Focus Session"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default FocusSessionCard;
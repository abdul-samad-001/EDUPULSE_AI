import { useEffect, useState, useRef } from "react";
import { Card, Badge, Button } from "../ui";
import { Target, Pause, Play, Square, Clock, Sparkles } from "lucide-react";

// Web Audio API chime on timer completion
const playCompletionChime = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.9);
  } catch {
    // Audio Context not allowed without prior user gesture
  }
};

function FocusTimer({ session, onStopSession }) {
  const [now, setNow] = useState(() => Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTimeOffset] = useState(0);
  const lastFinishedSessionIdRef = useRef(null);

  useEffect(() => {
    if (!session || isPaused) return;

    const interval = setInterval(() => {
      const currentTimestamp = Date.now();
      setNow(currentTimestamp);

      // Check if timer elapsed
      if (session?.startedAt && session?.plannedDurationMinutes) {
        const started = new Date(session.startedAt).getTime();
        const plannedSecs = session.plannedDurationMinutes * 60;
        const elapsedSecs = Math.floor((currentTimestamp - started - pausedTimeOffset) / 1000);

        if (elapsedSecs >= plannedSecs && lastFinishedSessionIdRef.current !== session._id) {
          lastFinishedSessionIdRef.current = session._id;
          playCompletionChime();
          if (onStopSession) {
            onStopSession();
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, isPaused, pausedTimeOffset, onStopSession]);

  const { remainingSeconds, progressPercent, estimatedFinish } = (() => {
    if (!session?.startedAt || !session?.plannedDurationMinutes) {
      return { remainingSeconds: 0, progressPercent: 0, estimatedFinish: "--:--" };
    }

    const started = new Date(session.startedAt).getTime();
    const plannedSecs = session.plannedDurationMinutes * 60;
    const elapsedSecs = Math.floor((now - started - pausedTimeOffset) / 1000);
    const rem = Math.max(plannedSecs - elapsedSecs, 0);

    const progress = Math.min(100, Math.round(((plannedSecs - rem) / plannedSecs) * 100));

    // Calculate Estimated Finish Time
    const finishDate = new Date(now + rem * 1000);
    const finishStr = finishDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return { remainingSeconds: rem, progressPercent: progress, estimatedFinish: finishStr };
  })();

  const formatTime = () => {
    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;

    if (h > 0) {
      return [
        h.toString().padStart(2, "0"),
        m.toString().padStart(2, "0"),
        s.toString().padStart(2, "0"),
      ].join(":");
    }
    return [
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // SVG Circular progress dimensions
  const strokeWidth = 8;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <Card
      title="⏳ Modern Focus Timer"
      subtitle="Track your focus block with precision"
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="flex flex-col items-center justify-center my-auto py-4 space-y-4">
        {/* SVG Circular Progress & Large Timer */}
        <div className="relative flex items-center justify-center w-52 h-52">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track Circle */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              className="text-dark-border"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Fill Circle */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              className="text-primary transition-all duration-1000 ease-linear"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Timer Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight font-mono">
              {session ? formatTime() : "25:00"}
            </span>
            <span className="text-[10px] uppercase font-bold text-dark-muted mt-1 tracking-wider">
              {session ? (remainingSeconds === 0 ? "Completed!" : (isPaused ? "Paused" : "Focusing")) : "Ready to Start"}
            </span>
          </div>
        </div>

        {/* Session Metadata & Badges */}
        {session ? (
          <div className="space-y-2 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="primary" icon={Target} size="sm">
                {session.skill?.skillName || "Active Skill"}
              </Badge>
              <Badge variant={remainingSeconds === 0 ? "success" : (isPaused ? "warning" : "success")} size="sm">
                {remainingSeconds === 0 ? "Completed" : (isPaused ? "Paused" : "Active Session")}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-dark-muted">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Planned {session.plannedDurationMinutes} mins
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Est. Finish: {estimatedFinish}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-dark-muted text-center">
            Configure your skill and interval below to start a focus session.
          </p>
        )}

        {/* Action Buttons for Active Session */}
        {session && (
          <div className="flex items-center justify-center gap-3 pt-2 w-full max-w-xs">
            <Button
              variant={isPaused ? "primary" : "secondary"}
              size="sm"
              icon={isPaused ? Play : Pause}
              onClick={togglePause}
              className="flex-1"
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>

            <Button
              variant="danger"
              size="sm"
              icon={Square}
              onClick={onStopSession}
              className="flex-1"
            >
              Stop
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default FocusTimer;
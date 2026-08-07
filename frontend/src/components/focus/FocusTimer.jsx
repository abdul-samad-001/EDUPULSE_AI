import { useEffect, useState } from "react";
import { Card, Badge } from "../ui";
import { Target } from "lucide-react";

function FocusTimer({ session }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const remaining = (() => {
    if (!session?.startedAt || !session?.plannedDurationMinutes) return 0;
    const started = new Date(session.startedAt).getTime();
    const planned = session.plannedDurationMinutes * 60;
    const elapsed = Math.floor((now - started) / 1000);
    return Math.max(planned - elapsed, 0);
  })();

  const formatTime = () => {
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");
  };

  return (
    <Card title="⏳ Focus Timer" className="w-full text-center py-6">
      <div className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight my-4 font-mono">
        {formatTime()}
      </div>

      {session ? (
        <div className="mt-4 space-y-1">
          <Badge variant="primary" icon={Target} size="sm">
            {session.skill?.skillName}
          </Badge>
          <p className="text-xs text-dark-muted mt-1">
            Planned {session.plannedDurationMinutes} minutes
          </p>
        </div>
      ) : (
        <p className="mt-4 text-xs text-dark-muted">
          No active focus session
        </p>
      )}
    </Card>
  );
}

export default FocusTimer;
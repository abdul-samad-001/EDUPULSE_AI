import { useEffect, useState } from "react";

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
    <div className="bg-white rounded-xl shadow p-8 text-center">

      <h2 className="text-xl font-bold mb-6">
        ⏳ Focus Timer
      </h2>

      <div className="text-6xl font-bold text-blue-600 tracking-wider">
        {formatTime()}
      </div>

      {session && (
        <div className="mt-6">

          <p className="font-semibold">
            {session.skill?.skillName}
          </p>

          <p className="text-sm text-slate-500">
            Planned {session.plannedDurationMinutes} minutes
          </p>

        </div>
      )}

      {!session && (
        <p className="mt-6 text-slate-500">
          No active focus session
        </p>
      )}

    </div>
  );
}

export default FocusTimer;
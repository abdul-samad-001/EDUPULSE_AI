import { Card, Badge, EmptyState, Button } from "../ui";
import { Timer, Award, FileText, Play } from "lucide-react";

function SessionHistory({ history = [], onStartFirstSession }) {
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <EmptyState
        icon={Timer}
        title="No focus sessions yet."
        description="Start your first Pomodoro interval to log focus time and earn XP."
        action={
          <Button variant="primary" icon={Play} size="sm" onClick={onStartFirstSession}>
            Start First Session
          </Button>
        }
      />
    );
  }

  return (
    <Card
      title="📜 Focus Session History"
      subtitle={`Total ${history.length} focus sessions recorded`}
      className="p-0 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead className="bg-dark-bg text-dark-muted border-b border-dark-border uppercase text-[10px] font-semibold tracking-wider">
            <tr>
              <th className="p-3.5 sm:p-4">Date & Time</th>
              <th className="p-3.5 sm:p-4">Skill Track</th>
              <th className="p-3.5 sm:p-4">Duration</th>
              <th className="p-3.5 sm:p-4">XP Earned</th>
              <th className="p-3.5 sm:p-4">Goal / Notes</th>
              <th className="p-3.5 sm:p-4 text-right">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-dark-border text-dark-text">
            {history.map((session) => {
              const dateStr = session.startedAt
                ? new Date(session.startedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recent";

              const actualMins = session.actualDurationMinutes || 0;
              const plannedMins = session.plannedDurationMinutes || 25;
              const isCompleted = session.status === "completed";
              const xpEarned = isCompleted ? Math.round(actualMins * 2) || 50 : 0;

              return (
                <tr
                  key={session._id}
                  className="hover:bg-dark-border/40 transition-colors duration-150"
                >
                  {/* Date */}
                  <td className="p-3.5 sm:p-4 text-dark-muted text-xs whitespace-nowrap">
                    {dateStr}
                  </td>

                  {/* Skill */}
                  <td className="p-3.5 sm:p-4 font-bold text-dark-text">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {session.skill?.skillName || "General Learning"}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">
                    <span className="font-semibold text-primary">{actualMins}m</span>
                    <span className="text-dark-muted text-xs ml-1">({plannedMins}m planned)</span>
                  </td>

                  {/* XP Earned */}
                  <td className="p-3.5 sm:p-4 font-bold text-amber-400 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      +{xpEarned} XP
                    </span>
                  </td>

                  {/* Notes */}
                  <td className="p-3.5 sm:p-4 text-xs text-dark-muted max-w-xs truncate">
                    {session.notes ? (
                      <span className="inline-flex items-center gap-1 italic">
                        <FileText className="w-3 h-3 text-sky-400 shrink-0" />
                        "{session.notes}"
                      </span>
                    ) : (
                      <span className="opacity-40">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                    <Badge
                      variant={isCompleted ? "success" : "info"}
                      size="sm"
                    >
                      {isCompleted ? "Completed" : "Active"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default SessionHistory;
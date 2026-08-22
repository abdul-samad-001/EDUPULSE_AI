import { useState } from "react";
import { Card, Badge, EmptyState, Button } from "../ui";
import { Timer, Award, FileText, Play, ChevronDown, ChevronUp } from "lucide-react";

function SessionHistory({ history = [], onStartFirstSession }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 4;

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

  const visibleSessions = isExpanded ? history : history.slice(0, INITIAL_COUNT);
  const remainingCount = Math.max(0, history.length - INITIAL_COUNT);

  return (
    <Card
      title="📜 Focus Session History"
      subtitle={
        isExpanded
          ? `Showing all ${history.length} focus sessions recorded`
          : `Showing latest ${visibleSessions.length} of ${history.length} focus sessions`
      }
      headerAction={
        history.length > INITIAL_COUNT && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? ChevronUp : ChevronDown}
            className="text-xs font-bold text-primary hover:bg-primary/10 border border-primary/20"
          >
            {isExpanded ? "Show Less" : `View More (+${remainingCount})`}
          </Button>
        )
      }
      className="p-0 overflow-hidden shadow-lg border border-dark-border"
    >
      <div className={`overflow-x-auto ${isExpanded && history.length > 8 ? "max-h-96 overflow-y-auto" : ""}`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-dark-bg text-dark-muted border-b border-dark-border uppercase text-[10px] font-bold tracking-wider sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-3.5 sm:px-4">Date & Time</th>
              <th className="py-2.5 px-3.5 sm:px-4">Skill Track</th>
              <th className="py-2.5 px-3.5 sm:px-4">Duration</th>
              <th className="py-2.5 px-3.5 sm:px-4">XP Earned</th>
              <th className="py-2.5 px-3.5 sm:px-4">Goal / Notes</th>
              <th className="py-2.5 px-3.5 sm:px-4 text-right">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-dark-border text-dark-text">
            {visibleSessions.map((session) => {
              const dateStr = session.startedAt
                ? new Date(session.startedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
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
                  <td className="py-2.5 px-3.5 sm:px-4 text-dark-muted text-xs whitespace-nowrap font-medium">
                    {dateStr}
                  </td>

                  {/* Skill */}
                  <td className="py-2.5 px-3.5 sm:px-4 font-bold text-dark-text">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="truncate max-w-35 sm:max-w-none">
                        {session.skill?.skillName || "General Learning"}
                      </span>
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-2.5 px-3.5 sm:px-4 whitespace-nowrap">
                    <span className="font-extrabold text-primary">{actualMins}m</span>
                    <span className="text-dark-muted text-[10px] ml-1">({plannedMins}m planned)</span>
                  </td>

                  {/* XP Earned */}
                  <td className="py-2.5 px-3.5 sm:px-4 font-black text-amber-400 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      +{xpEarned} XP
                    </span>
                  </td>

                  {/* Notes */}
                  <td className="py-2.5 px-3.5 sm:px-4 text-xs text-dark-muted max-w-40 truncate">
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
                  <td className="py-2.5 px-3.5 sm:px-4 text-right whitespace-nowrap">
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

      {/* Bottom Collapsible Bar */}
      {history.length > INITIAL_COUNT && (
        <div className="p-2.5 bg-dark-bg/60 border-t border-dark-border flex items-center justify-between text-xs">
          <span className="text-dark-muted text-[11px]">
            {isExpanded
              ? `All ${history.length} sessions displayed`
              : `${remainingCount} older sessions hidden`}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? ChevronUp : ChevronDown}
            className="text-xs font-bold text-primary hover:bg-primary/10 h-7 px-3"
          >
            {isExpanded ? "Show Less" : `View More (${remainingCount} more)`}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default SessionHistory;
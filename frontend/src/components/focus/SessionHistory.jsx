import { Card, Badge } from "../ui";

function SessionHistory({ history = [] }) {
  return (
    <Card title="📜 Focus Session History" className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead className="bg-dark-bg text-dark-muted border-b border-dark-border uppercase text-[10px] font-semibold tracking-wider">
            <tr>
              <th className="p-3 sm:p-4">Date</th>
              <th className="p-3 sm:p-4">Skill</th>
              <th className="p-3 sm:p-4">Planned</th>
              <th className="p-3 sm:p-4">Actual</th>
              <th className="p-3 sm:p-4 text-right">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-dark-border text-dark-text">
            {history.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-xs text-dark-muted"
                >
                  No focus sessions recorded yet.
                </td>
              </tr>
            )}

            {history.map((session) => (
              <tr
                key={session._id}
                className="hover:bg-dark-border/40 transition-colors"
              >
                <td className="p-3 sm:p-4 text-dark-muted">
                  {new Date(session.startedAt).toLocaleDateString()}
                </td>

                <td className="p-3 sm:p-4 font-semibold text-dark-text">
                  {session.skill?.skillName || "-"}
                </td>

                <td className="p-3 sm:p-4 text-dark-muted">
                  {session.plannedDurationMinutes} min
                </td>

                <td className="p-3 sm:p-4 font-medium text-primary">
                  {session.actualDurationMinutes || 0} min
                </td>

                <td className="p-3 sm:p-4 text-right">
                  <Badge
                    variant={session.status === "completed" ? "success" : "info"}
                    size="sm"
                  >
                    {session.status === "completed" ? "Completed" : "Active"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default SessionHistory;
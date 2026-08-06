function SessionHistory({ history = [] }) {
  return (
    <div className="bg-white rounded-xl shadow">

      <div className="p-6 border-b">

        <h2 className="text-xl font-bold">
          📜 Focus Session History
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Skill</th>
              <th className="p-4 text-left">Planned</th>
              <th className="p-4 text-left">Actual</th>
              <th className="p-4 text-left">Status</th>
            </tr>

          </thead>

          <tbody>

            {history.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-slate-500"
                >
                  No focus sessions found.
                </td>
              </tr>
            )}

            {history.map((session) => (
              <tr
                key={session._id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4">
                  {new Date(
                    session.startedAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {session.skill?.skillName || "-"}
                </td>

                <td className="p-4">
                  {session.plannedDurationMinutes} min
                </td>

                <td className="p-4">
                  {session.actualDurationMinutes || 0} min
                </td>

                <td className="p-4">

                  {session.status === "completed" ? (
                    <span className="text-green-600 font-semibold">
                      Completed
                    </span>
                  ) : (
                    <span className="text-blue-600 font-semibold">
                      Active
                    </span>
                  )}

                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default SessionHistory;
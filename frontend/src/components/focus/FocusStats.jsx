function FocusStats({ history = [] }) {
  const totalSessions = history.length;

  const totalMinutes = history.reduce(
    (sum, session) => sum + (session.actualDurationMinutes || 0),
    0
  );

  const longestSession = history.reduce(
    (max, session) =>
      Math.max(max, session.actualDurationMinutes || 0),
    0
  );

  const averageSession =
    totalSessions > 0
      ? Math.round(totalMinutes / totalSessions)
      : 0;

  const cards = [
    {
      title: "Today's Sessions",
      value: totalSessions,
    },
    {
      title: "Focus Time",
      value: `${totalMinutes} min`,
    },
    {
      title: "Longest Session",
      value: `${longestSession} min`,
    },
    {
      title: "Average Session",
      value: `${averageSession} min`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow p-6"
        >
          <p className="text-sm text-slate-500">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}

    </div>
  );
}

export default FocusStats;
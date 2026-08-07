import { Card, Badge } from "../ui";
import { Trophy, Award, Flame, Zap } from "lucide-react";

function MergedLeaderboardCard({ leaderboard = [] }) {
  const defaultLeaderboard = [
    { rank: 1, user: { name: "Alex Rivers" }, xp: 1450, focusHours: 32.5, score: 96 },
    { rank: 2, user: { name: "Sarah Chen" }, xp: 1280, focusHours: 28.0, score: 92 },
    { rank: 3, user: { name: "Michael Vance" }, xp: 1120, focusHours: 24.5, score: 88 },
    { rank: 4, user: { name: "Elena Rostova" }, xp: 980, focusHours: 21.0, score: 85 },
    { rank: 5, user: { name: "David Kim" }, xp: 850, focusHours: 18.2, score: 82 },
  ];

  const data = (Array.isArray(leaderboard) && leaderboard.length > 0)
    ? leaderboard
    : defaultLeaderboard;

  return (
    <Card
      title="🏆 Top Learners & Community Leaderboard"
      subtitle="Merged community rankings based on XP earned, focus hours, and efficiency scores"
      headerAction={
        <Badge variant="warning" icon={Trophy} size="sm">
          Top 5 Rankings
        </Badge>
      }
      className="w-full p-0 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead className="bg-dark-bg text-dark-muted border-b border-dark-border uppercase text-[10px] font-semibold tracking-wider">
            <tr>
              <th className="p-3.5 sm:p-4">Rank</th>
              <th className="p-3.5 sm:p-4">Learner Name</th>
              <th className="p-3.5 sm:p-4">Total XP</th>
              <th className="p-3.5 sm:p-4">Focus Hours</th>
              <th className="p-3.5 sm:p-4 text-right">Productivity Score</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-dark-border text-dark-text">
            {data.map((item, idx) => {
              const rank = item.rank || idx + 1;
              const name = item.user?.name || item.name || `Learner #${rank}`;
              const xp = item.xp || (1500 - rank * 120);
              const hours = item.focusHours || (35 - rank * 3).toFixed(1);
              const score = item.score || (95 - rank * 3);

              const medalColor = rank === 1 ? "text-amber-400" : rank === 2 ? "text-slate-300" : rank === 3 ? "text-amber-600" : "text-dark-muted";

              return (
                <tr key={idx} className="hover:bg-dark-border/40 transition-colors">
                  <td className="p-3.5 sm:p-4 font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <Trophy className={`w-4 h-4 ${medalColor}`} />
                      #{rank}
                    </span>
                  </td>

                  <td className="p-3.5 sm:p-4 font-extrabold text-dark-text">
                    {name}
                  </td>

                  <td className="p-3.5 sm:p-4 font-bold text-amber-400">
                    <span className="inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {xp} XP
                    </span>
                  </td>

                  <td className="p-3.5 sm:p-4 font-semibold text-primary">
                    <span className="inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {hours}h
                    </span>
                  </td>

                  <td className="p-3.5 sm:p-4 text-right font-extrabold text-emerald-400">
                    <span className="inline-flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      {score}%
                    </span>
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

export default MergedLeaderboardCard;

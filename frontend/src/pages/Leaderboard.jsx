import { useEffect, useState } from "react";
import leaderboardService from "../services/leaderboardService";
import { SectionHeader, Card, Badge, LoadingSpinner } from "../components/ui";
import { Trophy, Award } from "lucide-react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [leaders, me] = await Promise.all([
          leaderboardService.getLeaderboard(),
          leaderboardService.getMyRank(),
        ]);

        setLeaderboard(leaders || []);
        setMyRank(me);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading leaderboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Leaderboard 🏆"
        subtitle="Compete with peers and see top learners ranked by total XP."
        icon={Trophy}
      />

      {myRank && (
        <Card className="bg-linear-to-r from-primary/10 via-dark-card to-dark-card border-primary/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-dark-text">
              Your Current Ranking
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
              <p className="text-xs text-dark-muted uppercase font-semibold">Rank</p>
              <p className="text-2xl font-bold text-primary mt-1">
                #{myRank.rank}
              </p>
            </div>

            <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
              <p className="text-xs text-dark-muted uppercase font-semibold">Level</p>
              <p className="text-2xl font-bold text-dark-text mt-1">
                {myRank.level}
              </p>
            </div>

            <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
              <p className="text-xs text-dark-muted uppercase font-semibold">XP</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {myRank.totalXP}
              </p>
            </div>

            <div className="bg-dark-bg/60 p-4 rounded-xl border border-dark-border">
              <p className="text-xs text-dark-muted uppercase font-semibold">Next Level XP</p>
              <p className="text-2xl font-bold text-dark-text mt-1">
                {myRank.nextLevelXP}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-dark-bg text-dark-muted border-b border-dark-border uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Student</th>
                <th className="p-4">Level</th>
                <th className="p-4 text-right">Total XP</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-border text-dark-text">
              {leaderboard.map((user) => (
                <tr
                  key={user.userId || user._id}
                  className="hover:bg-dark-border/40 transition-colors"
                >
                  <td className="p-4 font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${
                        user.rank === 1
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                          : user.rank === 2
                          ? "bg-slate-300/20 text-slate-200 border border-slate-300/40"
                          : user.rank === 3
                          ? "bg-amber-700/20 text-amber-500 border border-amber-700/40"
                          : "bg-dark-border text-dark-muted"
                      }`}
                    >
                      #{user.rank}
                    </span>
                  </td>

                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-dark-text">
                        {user.name}
                      </p>
                      <p className="text-xs text-dark-muted">
                        {user.email}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 font-medium">
                    <Badge variant="neutral" icon={Award}>
                      Lvl {user.level}
                    </Badge>
                  </td>

                  <td className="p-4 text-right font-bold text-primary">
                    {user.totalXP} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Leaderboard;
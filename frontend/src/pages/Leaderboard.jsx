import { useEffect, useState } from "react";
import leaderboardService from "../services/leaderboardService";

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

        setLeaderboard(leaders);
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
      <div className="p-10 text-center">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          🏆 Leaderboard
        </h1>

        {myRank && (
          <div className="bg-blue-600 text-white rounded-xl p-6 mb-8 shadow">
            <h2 className="text-xl font-semibold">
              Your Rank
            </h2>

            <div className="mt-3 grid grid-cols-4 gap-4">

              <div>
                <p className="text-sm">Rank</p>
                <p className="text-2xl font-bold">
                  #{myRank.rank}
                </p>
              </div>

              <div>
                <p className="text-sm">Level</p>
                <p className="text-2xl font-bold">
                  {myRank.level}
                </p>
              </div>

              <div>
                <p className="text-sm">XP</p>
                <p className="text-2xl font-bold">
                  {myRank.totalXP}
                </p>
              </div>

              <div>
                <p className="text-sm">Next Level</p>
                <p className="text-2xl font-bold">
                  {myRank.nextLevelXP}
                </p>
              </div>

            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-900 text-white">

              <tr>
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Level</th>
                <th className="p-4 text-left">XP</th>
              </tr>

            </thead>

            <tbody>

              {leaderboard.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="p-4">
                    #{user.rank}
                  </td>

                  <td className="p-4">
                    <div>
                      <p className="font-semibold">
                        {user.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </td>

                  <td className="p-4">
                    {user.level}
                  </td>

                  <td className="p-4 font-bold text-blue-600">
                    {user.totalXP}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default Leaderboard;
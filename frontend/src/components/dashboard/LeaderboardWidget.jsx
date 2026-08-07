import { Card, Badge } from "../ui";
import { Trophy } from "lucide-react";

function LeaderboardWidget({ users = [] }) {
  return (
    <Card
      title="🏆 Top Learners"
      subtitle="Community ranking leaderboard"
      className="w-full"
    >
      <div className="space-y-1.5 mt-0.5">
        {users.slice(0, 3).map((user) => (
          <div
            key={user.userId || user._id}
            className="flex items-center justify-between p-2 px-3 rounded-xl bg-dark-bg border border-dark-border"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
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
              <span className="text-xs font-semibold text-dark-text truncate">
                {user.name}
              </span>
            </div>

            <Badge variant="primary" icon={Trophy} size="sm" className="shrink-0">
              {user.totalXP} XP
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default LeaderboardWidget;
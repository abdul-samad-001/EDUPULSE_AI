import { useEffect, useState, useMemo } from "react";
import leaderboardService from "../services/leaderboardService";
import { Card, Badge, LoadingSpinner } from "../components/ui";
import {
  Trophy,
  Award,
  Crown,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // all | top10 | nearby
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [leaders, me] = await Promise.all([
          leaderboardService.getLeaderboard().catch(() => []),
          leaderboardService.getMyRank().catch(() => null),
        ]);

        if (isMounted) {
          setLeaderboard(leaders || []);
          setMyRank(me);
        }
      } catch (error) {
        console.error("Leaderboard loading error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Search
  const filteredLeaderboard = useMemo(() => {
    let list = [...leaderboard];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }

    if (filterMode === "top10") {
      list = list.slice(0, 10);
    } else if (filterMode === "nearby" && myRank?.rank) {
      const myIdx = list.findIndex((u) => u.rank === myRank.rank);
      if (myIdx !== -1) {
        const start = Math.max(0, myIdx - 3);
        const end = Math.min(list.length, myIdx + 4);
        list = list.slice(start, end);
      }
    }

    return list;
  }, [leaderboard, searchQuery, filterMode, myRank]);

  // Pagination
  const totalPages = Math.ceil(filteredLeaderboard.length / PAGE_SIZE) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLeaderboard.slice(start, start + PAGE_SIZE);
  }, [filteredLeaderboard, currentPage]);

  const top3 = useMemo(() => {
    return leaderboard.slice(0, 3);
  }, [leaderboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading EduPulse Community Leaderboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-6">
      {/* 1. SLEEK COMPACT HERO & USER CURRENT STATS BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border p-4 sm:p-5 shadow-xl transition-all hover:border-primary/30">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="warning" icon={Trophy} size="sm">
                Global Rankings
              </Badge>
              <span className="text-[11px] font-bold text-dark-muted hidden sm:inline-block">
                Real-Time XP Leaderboard
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-dark-text tracking-tight flex items-center gap-2">
                EduPulse Community Leaderboard 🏆
              </h1>
              <p className="text-xs sm:text-sm text-dark-muted font-medium">
                Compete with peers, climb global tiers, and earn XP with every deep work interval.
              </p>
            </div>
          </div>

          {/* User's Personal Ranking Bar */}
          {myRank && (
            <div className="flex items-center gap-2.5 bg-dark-bg/90 border border-primary/30 p-2.5 sm:p-3 rounded-xl w-full lg:w-auto shrink-0 shadow-inner">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/15 text-primary font-black text-base border border-primary/30 shrink-0">
                #{myRank.rank}
              </div>

              <div className="space-y-1 min-w-36 flex-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-dark-text flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-primary" /> You (Lvl {myRank.level})
                  </span>
                  <span className="font-black text-amber-400">{myRank.totalXP} XP</span>
                </div>

                {/* Progress bar to next level */}
                <div className="w-full bg-dark-card h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-primary to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          ((myRank.totalXP % 1000) / ((myRank.nextLevelXP || 1000) % 1000 || 1000)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-dark-muted">
                  <span>Tier Progress</span>
                  <span>Next: {myRank.nextLevelXP} XP</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. TOP 3 PODIUM ROW */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Rank 2 (Silver) */}
          <div className="relative overflow-hidden rounded-xl bg-dark-card border border-slate-400/30 p-3 flex items-center gap-3 order-2 sm:order-1">
            <div className="w-10 h-10 rounded-xl bg-slate-400/15 border border-slate-400/30 flex items-center justify-center text-slate-300 font-extrabold text-sm shrink-0">
              🥈 #2
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-dark-text truncate">{top3[1]?.name}</p>
              <div className="flex items-center gap-2 text-[10px] text-dark-muted">
                <span>Lvl {top3[1]?.level}</span>
                <span>•</span>
                <span className="font-bold text-slate-300">{top3[1]?.totalXP} XP</span>
              </div>
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="relative overflow-hidden rounded-xl bg-dark-card border border-amber-400/40 p-3 flex items-center gap-3 order-1 sm:order-2 shadow-md shadow-amber-500/5 bg-linear-to-r from-amber-500/10 via-dark-card to-dark-card">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-extrabold text-sm shrink-0">
              🥇 #1
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <p className="text-xs font-black text-amber-300 truncate">{top3[0]?.name}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-dark-muted">
                <span>Lvl {top3[0]?.level}</span>
                <span>•</span>
                <span className="font-extrabold text-amber-400">{top3[0]?.totalXP} XP</span>
              </div>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="relative overflow-hidden rounded-xl bg-dark-card border border-amber-700/30 p-3 flex items-center gap-3 order-3 sm:order-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700/15 border border-amber-700/30 flex items-center justify-center text-amber-600 font-extrabold text-sm shrink-0">
              🥉 #3
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-dark-text truncate">{top3[2]?.name}</p>
              <div className="flex items-center gap-2 text-[10px] text-dark-muted">
                <span>Lvl {top3[2]?.level}</span>
                <span>•</span>
                <span className="font-bold text-amber-600">{top3[2]?.totalXP} XP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTAINED LEADERBOARD TABLE WITH SEARCH, FILTERS & PAGINATION */}
      <Card className="p-0 overflow-hidden shadow-lg border border-dark-border">
        {/* Controls Toolbar */}
        <div className="p-3 sm:p-4 bg-dark-bg/60 border-b border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-muted" />
            <input
              type="text"
              placeholder="Search learner name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-dark-card border border-dark-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-dark-text placeholder:text-dark-muted focus:outline-hidden focus:border-primary transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 self-start sm:self-center bg-dark-card p-1 rounded-xl border border-dark-border">
            {[
              { id: "all", label: "All Learners" },
              { id: "top10", label: "Top 10" },
              { id: "nearby", label: "Nearby Me" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilterMode(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterMode === tab.id
                    ? "bg-primary text-dark-bg shadow-xs"
                    : "text-dark-muted hover:text-dark-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-dark-bg text-dark-muted border-b border-dark-border uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-4 w-16">Rank</th>
                <th className="py-2.5 px-4">Learner</th>
                <th className="py-2.5 px-4">Mastery Level</th>
                <th className="py-2.5 px-4 text-right">Total XP</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-border text-dark-text">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-dark-muted text-xs">
                    No learners found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                paginatedList.map((user) => {
                  const isMe = myRank && user.rank === myRank.rank;

                  return (
                    <tr
                      key={user.userId || user._id || user.rank}
                      className={`transition-colors ${
                        isMe
                          ? "bg-primary/10 hover:bg-primary/15 font-semibold"
                          : "hover:bg-dark-border/40"
                      }`}
                    >
                      <td className="py-2.5 px-4 font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] font-black ${
                            user.rank === 1
                              ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                              : user.rank === 2
                              ? "bg-slate-300/20 text-slate-200 border border-slate-300/40"
                              : user.rank === 3
                              ? "bg-amber-700/20 text-amber-500 border border-amber-700/40"
                              : isMe
                              ? "bg-primary text-dark-bg font-extrabold"
                              : "bg-dark-border/60 text-dark-muted"
                          }`}
                        >
                          #{user.rank}
                        </span>
                      </td>

                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-dark-border flex items-center justify-center font-extrabold text-[11px] text-dark-text shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-dark-text truncate flex items-center gap-1.5">
                              {user.name}
                              {isMe && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-primary text-dark-bg font-black uppercase">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-dark-muted truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-4">
                        <Badge variant={isMe ? "primary" : "neutral"} icon={Award} size="sm">
                          Lvl {user.level}
                        </Badge>
                      </td>

                      <td className="py-2.5 px-4 text-right font-black text-amber-400">
                        {user.totalXP?.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Compact Pagination Bar */}
        <div className="p-3 bg-dark-bg/60 border-t border-dark-border flex items-center justify-between text-xs text-dark-muted">
          <span>
            Showing <strong>{paginatedList.length}</strong> of <strong>{filteredLeaderboard.length}</strong> learners
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-lg border border-dark-border hover:bg-dark-border/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-dark-text cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-xs font-bold text-dark-text">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded-lg border border-dark-border hover:bg-dark-border/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-dark-text cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Leaderboard;
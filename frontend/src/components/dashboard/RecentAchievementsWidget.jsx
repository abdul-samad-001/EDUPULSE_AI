import { Card, Badge, Progress } from "../ui";
import { Award, Trophy, Star } from "lucide-react";

function RecentAchievementsWidget({ achievements = [] }) {
  const displayList = (Array.isArray(achievements) ? achievements : []).slice(0, 4);

  return (
    <Card
      title="🏆 Recent Achievements & Milestones"
      subtitle="Your unlocked badges and milestone progress"
      headerAction={
        <Badge variant="warning" icon={Trophy} size="sm">
          Achievements
        </Badge>
      }
      className="w-full h-full flex flex-col justify-between"
    >
      {displayList.length === 0 ? (
        <div className="space-y-2.5 my-1">
          {/* Fallback default unlocked badges if backend is empty */}
          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-dark-text">First Focus Session</p>
                <p className="text-[10px] text-dark-muted">Completed your first 25m focus block</p>
              </div>
            </div>
            <Badge variant="success" size="sm">Unlocked</Badge>
          </div>

          <div className="p-3 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-dark-text">3-Day Streak</p>
                <p className="text-[10px] text-dark-muted">Studied 3 days in a row</p>
              </div>
            </div>
            <Badge variant="primary" size="sm">Active</Badge>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 my-1">
          {displayList.map((item, idx) => (
            <div
              key={item._id || item.id || idx}
              className="p-3 rounded-xl bg-dark-bg border border-dark-border space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-dark-text">
                    {item.title || item.name}
                  </span>
                </div>
                <Badge variant={item.unlocked ? "success" : "neutral"} size="sm">
                  {item.unlocked ? "Unlocked" : `${item.progress || 0}%`}
                </Badge>
              </div>
              {item.description && (
                <p className="text-[11px] text-dark-muted">
                  {item.description}
                </p>
              )}
              {item.progress !== undefined && !item.unlocked && (
                <Progress value={item.progress} max={100} size="sm" color="primary" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 text-right">
        <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">
          View All Achievements &rarr;
        </span>
      </div>
    </Card>
  );
}

export default RecentAchievementsWidget;

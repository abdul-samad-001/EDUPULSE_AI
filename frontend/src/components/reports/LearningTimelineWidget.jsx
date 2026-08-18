import { Card, Badge } from "../ui";
import { BookOpen, CheckCircle2, Timer, Award, Sparkles, Zap, Flame } from "lucide-react";

const FALLBACK_EVENTS = [
  {
    id: "ev-1",
    type: "Task Completed",
    title: "Finished milestone: Build JWT Auth Controllers",
    subtitle: "Skill Track: Node.js & Express",
    timestamp: "2026-08-07T14:00:00.000Z",
    icon: "CheckCircle2",
  },
  {
    id: "ev-2",
    type: "Focus Session",
    title: "Completed 45m Pomodoro focus interval",
    subtitle: "Productivity rating: 92%",
    timestamp: "2026-08-07T11:00:00.000Z",
    icon: "Timer",
  },
  {
    id: "ev-3",
    type: "Achievement",
    title: "Unlocked Badge: 3-Day Focus Streak",
    subtitle: "+100 XP Bonus Awarded",
    timestamp: "2026-08-07T02:00:00.000Z",
    icon: "Award",
  },
  {
    id: "ev-4",
    type: "Skill Added",
    title: "Started learning React.js & Tailwind CSS",
    subtitle: "Category: Web Development",
    timestamp: "2026-08-06T14:00:00.000Z",
    icon: "BookOpen",
  },
];

function LearningTimelineWidget({ timelineEvents = [] }) {
  const events = (Array.isArray(timelineEvents) && timelineEvents.length > 0)
    ? timelineEvents
    : FALLBACK_EVENTS;

  const getEventIcon = (type) => {
    switch (type) {
      case "Skill Added": return BookOpen;
      case "Task Completed": return CheckCircle2;
      case "Focus Session": return Timer;
      case "Achievement": return Award;
      case "Level Up": return Sparkles;
      case "Challenge Completed": return Zap;
      default: return Flame;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case "Skill Added": return "primary";
      case "Task Completed": return "success";
      case "Focus Session": return "info";
      case "Achievement": return "warning";
      default: return "neutral";
    }
  };

  return (
    <Card
      title="📜 Learning Timeline & Milestone Activity"
      subtitle="Chronological feed of your completed focus sessions, skills, and achievements"
      className="w-full"
    >
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-dark-border py-2 max-h-85 overflow-y-auto pr-2">
        {events.map((ev) => {
          const IconComponent = getEventIcon(ev.type);
          const dateFormatted = ev.timestamp
            ? new Date(ev.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recently";

          return (
            <div key={ev.id} className="relative group flex items-start justify-between gap-4">
              {/* Timeline Bullet */}
              <div className="absolute -left-7.25 top-1 p-1.5 rounded-full bg-dark-card border border-primary/50 text-primary shadow-md">
                <IconComponent className="w-3.5 h-3.5" />
              </div>

              {/* Event Content */}
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(ev.type)} size="sm">
                    {ev.type}
                  </Badge>
                  <span className="text-[11px] text-dark-muted font-medium">{dateFormatted}</span>
                </div>
                <p className="text-sm font-bold text-dark-text pt-0.5">{ev.title}</p>
                <p className="text-xs text-dark-muted">{ev.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default LearningTimelineWidget;

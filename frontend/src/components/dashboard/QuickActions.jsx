import { useNavigate } from "react-router-dom";
import { Card } from "../ui";
import { Play, PlusCircle, Compass, FileText } from "lucide-react";

function QuickActions({ onStartFocusClick }) {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Start Focus",
      description: "Begin timed deep work",
      icon: Play,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50",
      onClick: onStartFocusClick,
    },
    {
      label: "Add Skill",
      description: "Track new learning goal",
      icon: PlusCircle,
      color: "text-primary bg-primary/10 border-primary/20 hover:border-primary/50",
      onClick: () => navigate("/skills"),
    },
    {
      label: "Generate Roadmap",
      description: "AI structured milestones",
      icon: Compass,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20 hover:border-sky-500/50",
      onClick: () => navigate("/skills"),
    },
    {
      label: "View Reports",
      description: "Export performance logs",
      icon: FileText,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50",
      onClick: () => navigate("/reports"),
    },
  ];

  return (
    <Card title="⚡ Quick Actions" subtitle="Shortcuts for daily learning workflow" className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${action.color}`}
            >
              <div className="p-2 rounded-lg bg-dark-bg/80 border border-dark-border mb-2.5">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-dark-text tracking-tight">
                {action.label}
              </span>
              <span className="text-[10px] text-dark-muted mt-0.5 leading-tight">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default QuickActions;

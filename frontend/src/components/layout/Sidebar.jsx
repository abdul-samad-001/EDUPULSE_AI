import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Trophy,
  Timer,
  BookOpen,
  FileText,
  Flag,
  Award,
  User,
  Settings,
  LogOut,
  X,
  Zap,
} from "lucide-react";

function Sidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { name: "Focus", icon: Timer, path: "/focus" },
    { name: "Skills", icon: BookOpen, path: "/skills" },
    { name: "Reports", icon: FileText, path: "/reports" },
    { name: "Milestones", icon: Flag, path: "/milestones" },
    { name: "Achievements", icon: Award, path: "/achievements" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Main Navigation"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-dark-card border-r border-dark-border flex flex-col justify-between p-4 sm:p-5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-2 mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-md shadow-primary/10">
                <Zap className="w-4 h-4 fill-primary" />
              </div>
              <span className="text-lg font-bold text-dark-text tracking-tight">
                EduPulse<span className="text-primary">.AI</span>
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close sidebar"
                className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-border lg:hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                      isActive
                        ? "bg-primary/10 text-primary border-r-2 border-primary shadow-sm font-semibold"
                        : "text-dark-muted hover:bg-dark-border/50 hover:text-dark-text"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Action */}
        <div className="pt-3 border-t border-dark-border">
          <button
            onClick={logout}
            aria-label="Log out"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 w-full text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
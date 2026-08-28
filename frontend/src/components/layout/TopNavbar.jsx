import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Search,
  Menu,
  Moon,
  Sun,
  X,
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
  ChevronDown,
  Sparkles,
  Layers,
} from "lucide-react";
import { NotificationBell } from "../notifications";
import xpService from "../../services/xpService";

const SEARCH_ITEMS = [
  { title: "Dashboard", category: "Page", path: "/dashboard", icon: LayoutDashboard, keywords: "overview home focus ai insights stats" },
  { title: "Analytics", category: "Page", path: "/analytics", icon: BarChart3, keywords: "procrastination productivity ML telemetry graphs performance" },
  { title: "Focus Sessions", category: "Page", path: "/focus", icon: Timer, keywords: "pomodoro timer study distraction tracker session" },
  { title: "Skill Roadmap", category: "Page", path: "/skills", icon: BookOpen, keywords: "skills docker python java fastapi nodejs ai recommendation" },
  { title: "Study Reports", category: "Page", path: "/reports", icon: FileText, keywords: "weekly monthly telemetry summary cards exported statistics" },
  { title: "Learning Milestones", category: "Page", path: "/milestones", icon: Flag, keywords: "milestones checkpoints progress goals badges" },
  { title: "Achievements", category: "Page", path: "/achievements", icon: Award, keywords: "trophies badges xp rewards unlocked list" },
  { title: "Leaderboard", category: "Page", path: "/leaderboard", icon: Trophy, keywords: "rank competition top learners xp points" },
  { title: "User Profile & Security", category: "Page", path: "/settings?tab=profile", icon: User, keywords: "user info bio level streak account details name password" },
  { title: "Browser Extension", category: "Page", path: "/settings?tab=extension", icon: Layers, keywords: "extension chrome edge brave download setup install load unpacked telemetry" },
  { title: "Settings", category: "Page", path: "/settings", icon: Settings, keywords: "preferences notifications theme password security" },
  { title: "Docker", category: "Skill", path: "/skills", icon: BookOpen, keywords: "docker container DevOps virtualization deployment" },
  { title: "Python", category: "Skill", path: "/skills", icon: BookOpen, keywords: "python backend ML machine learning scripting" },
  { title: "FastAPI", category: "Skill", path: "/skills", icon: BookOpen, keywords: "fastapi python async rest api web framework" },
  { title: "Kubernetes", category: "Skill", path: "/skills", icon: BookOpen, keywords: "k8s orchestration containers cloud devops" },
  { title: "TypeScript", category: "Skill", path: "/skills", icon: BookOpen, keywords: "ts javascript typed frontend react node" },
];

function TopNavbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [userXP, setUserXP] = useState(null);
  const { logout: authLogout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // Fetch real XP/Level on mount
  useEffect(() => {
    let isMounted = true;

    const loadXP = async () => {
      try {
        const data = await xpService.getXP();
        if (isMounted && data) {
          setUserXP(data);
        }
      } catch (err) {
        console.warn("TopNavbar XP Load Warning:", err?.message);
      }
    };

    loadXP();

    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh XP when profile dropdown opens
  useEffect(() => {
    if (isProfileOpen) {
      xpService.getXP().then((data) => {
        if (data) setUserXP(data);
      }).catch(() => {});
    }
  }, [isProfileOpen]);

  // Click Outside Handler for Dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (authLogout) {
      authLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setIsProfileOpen(false);
    navigate("/");
  };

  const filteredSearchResults = searchQuery.trim()
    ? SEARCH_ITEMS.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelectSearchResult = (path) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Section: Mobile Menu Toggle & Global Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-dark-border lg:hidden transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Live Search Input with Dropdown Overlay */}
        <div ref={searchRef} className="relative flex-1 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsSearchOpen(false);
                if (e.key === "Enter" && filteredSearchResults.length > 0) {
                  handleSelectSearchResult(filteredSearchResults[0].path);
                }
              }}
              placeholder="Search skills, reports, analytics..."
              aria-label="Search skills, reports, analytics"
              className="w-full bg-dark-card border border-dark-border text-dark-text text-xs sm:text-sm rounded-xl pl-10 pr-9 py-2 placeholder:text-dark-muted/60 focus:outline-none focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Overlay */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 text-[10px] font-bold uppercase text-dark-muted tracking-wider border-b border-dark-border flex items-center justify-between">
                <span>Search Results</span>
                <span>{filteredSearchResults.length} found</span>
              </div>

              <div className="max-h-72 overflow-y-auto p-1 space-y-0.5">
                {filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={`${item.title}-${idx}`}
                        onClick={() => handleSelectSearchResult(item.path)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary text-dark-text transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-dark-muted group-hover:text-primary group-hover:border-primary/30 transition-colors shrink-0">
                            <ItemIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-dark-bg border border-dark-border text-dark-muted uppercase shrink-0">
                          {item.category}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-dark-muted">
                    No results found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Theme Toggle Button, Notifications, User Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Interactive Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-card hover:bg-dark-border/60 border border-dark-border text-xs font-semibold text-dark-text transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {theme === "dark" ? (
            <>
              <Moon className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">EduPulse Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">EduPulse Light</span>
            </>
          )}
        </button>

        {/* Notification Bell */}
        <NotificationBell />

        {/* Interactive User Profile Dropdown Menu */}
        <div ref={profileRef} className="relative border-l border-dark-border pl-3">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-label="User Profile Menu"
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-dark-card transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none group text-left"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-tr from-primary to-emerald-500 text-dark-bg font-extrabold text-xs flex items-center justify-center shadow-md shadow-primary/10 shrink-0">
              {initials}
            </div>

            <div className="hidden sm:block text-left">
              <h4 className="font-semibold text-xs sm:text-sm text-dark-text leading-tight group-hover:text-primary transition-colors">
                {user.name || "User"}
              </h4>
              <p className="text-[11px] text-dark-muted mt-0.5">Learner</p>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-dark-muted hidden sm:block transition-transform duration-200 ${
                isProfileOpen ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {/* User Profile Dropdown Overlay Card */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Profile Card Header */}
              <div className="p-4 bg-linear-to-br from-primary/10 via-dark-card to-dark-card border-b border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-emerald-500 text-dark-bg font-extrabold text-sm flex items-center justify-center shadow-md">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-sm text-dark-text truncate">
                      {user.name || "EduPulse Learner"}
                    </h3>
                    <p className="text-xs text-dark-muted truncate">
                      {user.email || "student@edupulse.ai"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-dark-bg border border-dark-border text-xs">
                  <span className="text-dark-muted flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    Level & XP
                  </span>
                  <span className="font-bold text-primary">
                    Level {userXP?.level ?? 1} • {userXP?.totalXP ?? 0} XP
                  </span>
                </div>
              </div>

              {/* Profile Menu Links */}
              <div className="p-1.5 space-y-0.5">
                <Link
                  to="/settings?tab=profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-dark-text hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <User className="w-4 h-4 text-dark-muted" />
                  <span>My Profile & Security</span>
                </Link>

                <Link
                  to="/settings?tab=extension"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-dark-text hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Layers className="w-4 h-4 text-dark-muted" />
                  <span>Browser Extension</span>
                </Link>

                <Link
                  to="/milestones"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-dark-text hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Flag className="w-4 h-4 text-dark-muted" />
                  <span>Learning Milestones</span>
                </Link>

                <Link
                  to="/achievements"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-dark-text hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Award className="w-4 h-4 text-dark-muted" />
                  <span>Achievements</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-dark-text hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Settings className="w-4 h-4 text-dark-muted" />
                  <span>Account Settings</span>
                </Link>
              </div>

              {/* Profile Card Footer Action */}
              <div className="p-1.5 border-t border-dark-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
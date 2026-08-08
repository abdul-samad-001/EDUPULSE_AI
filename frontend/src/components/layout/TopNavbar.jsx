import { useEffect } from "react";
import { Search, Menu, Moon } from "lucide-react";
import { NotificationBell } from "../notifications";

function TopNavbar({ onMenuToggle }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.postMessage({ type: "EDUPULSE_AUTH_TOKEN", token }, "*");
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-20 h-16 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Section: Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-dark-border lg:hidden transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative flex-1 hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
          <input
            type="text"
            placeholder="Search skills, reports, analytics..."
            aria-label="Search skills, reports, analytics"
            className="w-full bg-dark-card border border-dark-border text-dark-text text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2 placeholder:text-dark-muted/60 focus:outline-none focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Right Section: Theme Placeholder, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Badge Placeholder */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-card border border-dark-border text-xs font-medium text-dark-muted">
          <Moon className="w-3.5 h-3.5 text-primary" />
          <span>EduPulse Dark</span>
        </div>

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Profile Avatar & Details */}
        <div className="flex items-center gap-3 pl-3 border-l border-dark-border">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-tr from-primary to-emerald-500 text-dark-bg font-bold text-xs flex items-center justify-center shadow-md shadow-primary/10 shrink-0">
            {initials}
          </div>

          <div className="hidden sm:block text-left">
            <h4 className="font-semibold text-xs sm:text-sm text-dark-text leading-tight">
              {user.name || "User"}
            </h4>
            <p className="text-[11px] text-dark-muted mt-0.5">Learner</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
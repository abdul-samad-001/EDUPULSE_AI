import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  BookOpen,
  User,
  Settings,
  LogOut,
  Trophy,
  Timer

} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      name: "Leaderboard",
      icon: Trophy,
      path: "/leaderboard",
    },
    {
      name: "Focus",
      icon: Timer,
      path: "/focus",
    },
    {
      name: "Reports",
      icon: FileText,
      path: "/reports",
    },
    {
      name: "Achievements",
      icon: Trophy,
      path: "/achievements",
    },
    {
      name: "Skills",
      icon: BookOpen,
      path: "/skills",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-10">
        EduPulse AI
      </h1>

      <nav className="space-y-2">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />

              {item.name}
            </NavLink>
          );
        })}

      </nav>

      <button
        onClick={logout}
        className="mt-10 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 w-full"
      >
        <LogOut size={20} />

        Logout
      </button>

    </aside>
  );
}

export default Sidebar;
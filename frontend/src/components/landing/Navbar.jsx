import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import logoImg from "../../assets/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null));
  const { toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Preview", href: "#preview" },
    { name: "Privacy", href: "#privacy" },
  ];

  return (
    <motion.header
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-dark-bg/85 backdrop-blur-lg border-b border-dark-border py-2.5 shadow-xs"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-full p-0.5 bg-linear-to-tr from-purple-500 via-indigo-500 to-teal-400 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img
                src={logoImg}
                alt="EduPulse AI Logo"
                className="w-full h-full object-cover rounded-full bg-dark-bg"
              />
            </div>
            <span className="text-sm font-bold tracking-tight text-dark-text flex items-center gap-1">
              EduPulse <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-dark-border text-teal-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-dark-card/90 border border-dark-border rounded-full px-3 py-1 backdrop-blur-md shadow-xs">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-dark-muted hover:text-dark-text px-3 py-1 rounded-full hover:bg-dark-surface transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
              className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text bg-dark-card hover:bg-dark-card-hover border border-dark-border transition-all cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </button>

            {token ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-medium text-white bg-teal-600 hover:bg-teal-500 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-medium text-dark-muted hover:text-dark-text px-2.5 py-1.5 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-linear-to-r from-purple-600 to-teal-500 hover:opacity-90 px-3.5 py-1.5 rounded-lg transition-all shadow-xs group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Bar */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text bg-dark-card border border-dark-border cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text bg-dark-card border border-dark-border"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-dark-card/95 backdrop-blur-xl border-b border-dark-border px-4 py-3 mt-2 space-y-2 shadow-lg"
          >
            <div className="space-y-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs font-medium text-dark-muted hover:text-dark-text hover:bg-dark-surface transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-dark-border flex flex-col gap-1.5">
              {token ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-1.5 rounded-lg text-xs font-medium text-white bg-teal-600"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-1.5 rounded-lg text-xs font-medium text-dark-muted hover:text-dark-text bg-dark-surface border border-dark-border"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-1.5 rounded-lg text-xs font-semibold text-white bg-linear-to-r from-purple-600 to-teal-500"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

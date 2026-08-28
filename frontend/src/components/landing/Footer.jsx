import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-dark-surface/60 border-t border-dark-border py-8 text-dark-muted text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="EduPulse AI Logo"
              className="w-6 h-6 rounded-full object-cover shadow-xs border border-white/10 shrink-0"
            />
            <span className="text-xs font-bold tracking-tight text-dark-text flex items-center gap-1">
              EduPulse <span className="text-teal-500 text-[10px] font-mono font-medium px-1 py-0.2 rounded bg-dark-border">AI</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <a href="#features" className="hover:text-dark-text transition-colors">Features</a>
            <a href="#preview" className="hover:text-dark-text transition-colors">Preview</a>
            <a href="#privacy" className="hover:text-dark-text transition-colors">Privacy</a>
            <Link to="/login" className="hover:text-dark-text transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-dark-text transition-colors">Sign Up</Link>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/abdul-samad-001/EDUPULSE_AI"
              target="_blank"
              rel="noreferrer"
              className="w-6 h-6 rounded-md bg-dark-card border border-dark-border flex items-center justify-center text-dark-muted hover:text-dark-text transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/abdul-samad025"
              target="_blank"
              rel="noreferrer"
              className="w-6 h-6 rounded-md bg-dark-card border border-dark-border flex items-center justify-center text-dark-muted hover:text-dark-text transition-colors"
              title="LinkedIn Profile"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-dark-muted">
          <div>
            © {new Date().getFullYear()} EduPulse AI.
          </div>
          <div>
            AI-Based Student Productivity and Progress Monitoring System
          </div>
        </div>
      </div>
    </footer>
  );
}

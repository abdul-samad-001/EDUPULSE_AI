import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col overflow-x-hidden">
      {/* Sidebar - Desktop Fixed / Mobile Overlay */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area (Offset by Sidebar on Desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Sticky Top Navbar */}
        <TopNavbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Page Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
import { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import FeatureBento from "../components/landing/FeatureBento";
import DashboardShowcase from "../components/landing/DashboardShowcase";
import SecuritySection from "../components/landing/SecuritySection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

export default function Home() {
  useEffect(() => {
    document.title = "EduPulse AI — AI-Based Procrastination Detection & Student Progress Monitoring";
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text selection:bg-purple-500/25 selection:text-white font-sans antialiased overflow-x-hidden transition-colors duration-200">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Hero />
        <FeatureBento />
        <DashboardShowcase />
        <SecuritySection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import React from "react";
import Sidebar from "./Sidebar";
import PortfolioPanel from "./PortfolioPanel";
import RecommendationsPanel from "./RecommendationsPanel";
import OptionsTradingPanel from "./OptionsTradingPanel";

function DashboardLayout({ theme, onThemeToggle }) {
  /**
   * Dashboard layout with sidebar, portfolio main area, and right-side panels.
   */
  return (
    <div className="dashboard-root">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <span className="dashboard-title">Stock Portfolio Dashboard</span>
          <button className="theme-toggle-btn" onClick={onThemeToggle}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
        <section className="dashboard-content">
          <div className="portfolio-section">
            <PortfolioPanel />
          </div>
          <aside className="right-panels">
            <RecommendationsPanel />
            <OptionsTradingPanel />
          </aside>
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;

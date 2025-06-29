import React from "react";

/**
 * Sidebar component for navigation (minimal, left-aligned).
 */
function Sidebar() {
  return (
    <nav className="sidebar">
      <h2 className="sidebar-title" style={{ color: `var(--primary)` }}>Portfolio</h2>
      <ul className="sidebar-nav">
        <li><a href="#portfolio">My Holdings</a></li>
        <li><a href="#recommendations">Recommendations</a></li>
        <li><a href="#options">Options Trading</a></li>
      </ul>
      <div className="sidebar-footer">
        <span style={{ fontSize: "0.85em", color: "var(--secondary)" }}>Powered by Zerodha MCP</span>
      </div>
    </nav>
  );
}

export default Sidebar;

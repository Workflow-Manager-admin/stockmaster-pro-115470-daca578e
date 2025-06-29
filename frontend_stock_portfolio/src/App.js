import React, { useState, useMemo } from "react";
import "./App.css";
import "./index.css";
import DashboardLayout from "./components/DashboardLayout";
import PortfolioProvider from "./hooks/usePortfolioProvider";
import ZerodhaProvider from "./hooks/useZerodhaProvider";
import ZerodhaAuthProvider from "./hooks/useZerodhaAuthProvider"; // NEW FOR AUTH

// PUBLIC_INTERFACE
function App() {
  /**
   * Top-level app entrypoint. Provides Portfolio and Zerodha Kite API context.
   */
  const [theme, setTheme] = useState("light");
  const handleThemeToggle = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Apply root-level CSS variables for supplied theme colors
  useMemo(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--accent", "#ffd600");
    document.documentElement.style.setProperty("--primary", "#1976d2");
    document.documentElement.style.setProperty("--secondary", "#424242");
  }, [theme]);

  return (
    <div className={`App`} data-theme={theme}>
      <ZerodhaAuthProvider>
        <ZerodhaProvider>
          <PortfolioProvider>
            <DashboardLayout theme={theme} onThemeToggle={handleThemeToggle} />
          </PortfolioProvider>
        </ZerodhaProvider>
      </ZerodhaAuthProvider>
    </div>
  );
}

export default App;

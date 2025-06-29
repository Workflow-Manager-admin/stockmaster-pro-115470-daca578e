import React from "react";
import { useZerodhaAuth } from "../hooks/useZerodhaAuthProvider";

/**
 * ZerodhaLoginPanel - Handles Zerodha MCP authentication user interface:
 * - Shows login, logged-in state, error, and logout controls.
 * - Guides the user through the OAuth or SSO authentication flow.
 */
function ZerodhaLoginPanel() {
  const {
    isAuthenticated,
    isLoading,
    error,
    user,
    login,
    logout,
  } = useZerodhaAuth();

  return (
    <div className="panel zerodha-login-panel" style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div
          style={{
            fontWeight: 500,
            marginBottom: 4,
            color: "var(--primary)",
            fontSize: "1.05em",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: "1.2em" }} role="img" aria-label="lock">
            🔒
          </span>
          Zerodha Account Login
        </div>
        {isAuthenticated ? (
          <>
            <div
              style={{
                margin: "5px 0 10px 0",
                fontSize: "1em",
                color: "var(--text-primary)",
              }}
            >
              <span style={{ color: "#32c159", fontWeight: 600 }}>Connected</span>
              <span style={{ marginLeft: 12, fontWeight: 400 }}>
                {user && user.name ? `as ${user.name}` : ""}
              </span>
            </div>
            <button
              onClick={logout}
              className="btn"
              style={{
                background: "#e53935",
                color: "white",
                fontWeight: 600,
                padding: "8px 22px",
                borderRadius: "7px",
                fontSize: "1em",
                border: "none",
                marginTop: 3,
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn"
              style={{
                background: "var(--primary)",
                color: "var(--accent)",
                fontWeight: 600,
                padding: "11px 22px",
                borderRadius: "7px",
                fontSize: "1.09em",
                border: "none",
                marginBottom: 4,
                minWidth: 128,
                letterSpacing: ".015em",
                boxShadow: "0 1.5px 6px var(--shadow-color)",
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "wait" : "pointer"
              }}
              disabled={isLoading}
              onClick={login}
            >
              {isLoading ? "Redirecting..." : <><span style={{marginRight:7}}>🔗</span>Login with Zerodha</>}
            </button>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.99em",
                marginTop: 5,
                maxWidth: 340,
                lineHeight: "1.42"
              }}
            >
              Connect your Zerodha account using MCP server to enable trading and portfolio syncing.
            </div>
          </>
        )}
        {error && (
          <div
            style={{
              color: "#e53935",
              fontSize: "0.97em",
              marginTop: 7,
              fontWeight: 500,
            }}
          >
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default ZerodhaLoginPanel;

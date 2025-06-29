import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// PUBLIC_INTERFACE
const ZerodhaAuthContext = createContext();

/**
 * Fake MCP API endpoints (replace with real MCP integration),
 * Simulate: login (redirect/OAuth), token store, error, logout.
 */
const MCP_AUTH_URL = "https://zerodha-mcp.example.com/login"; // REPLACE with actual MCP endpoint
const MCP_LOGOUT_URL = "https://zerodha-mcp.example.com/logout"; // REPLACE with actual MCP endpoint

// PUBLIC_INTERFACE
export function useZerodhaAuth() {
  return useContext(ZerodhaAuthContext);
}

const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem("zerodha_token_auth");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

// PUBLIC_INTERFACE
const ZerodhaAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // for login process
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // { name, ... }
  const [token, setToken] = useState(null);

  // Try to grab auth from storage on mount
  useEffect(() => {
    const auth = getStoredAuth();
    if (auth && auth.token) {
      setIsAuthenticated(true);
      setToken(auth.token);
      setUser(auth.user);
    }
  }, []);

  // PUBLIC_INTERFACE
  const login = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Simulate redirect to OAuth, handle in popup for demo
    setTimeout(() => {
      // Replace with MCP server flow:
      // - Open new window to MCP_AUTH_URL, handle callback with token
      // Simulate success:
      const dummyUser = { name: "DemoUser", email: "user@example.com" };
      const dummyToken = "demo_zerodha_token_" + Date.now();
      setToken(dummyToken);
      setUser(dummyUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      try {
        localStorage.setItem(
          "zerodha_token_auth",
          JSON.stringify({ token: dummyToken, user: dummyUser })
        );
      } catch (_) {}
    }, 1200);

    // Uncomment for error test:
    // setTimeout(() => { setIsLoading(false); setError('Login failed: example error.') }, 1200);
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("zerodha_token_auth");
    } catch (_) {}
    // Real MCP: do MCP_LOGOUT_URL call if needed
  }, []);

  // Helper (for showing errors on logout etc)
  const setAuthError = (msg) => {
    setError(msg);
    setIsLoading(false);
  };

  // Provide full context API
  const contextValue = {
    isAuthenticated,
    isLoading,
    error,
    user,
    token,
    login,
    logout,
    setAuthError,
  };

  return (
    <ZerodhaAuthContext.Provider value={contextValue}>
      {children}
    </ZerodhaAuthContext.Provider>
  );
};

export default ZerodhaAuthProvider;

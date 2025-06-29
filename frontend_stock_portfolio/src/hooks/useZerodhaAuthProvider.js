import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  mcpLoginPopup,
  mcpLogout,
  mcpGetUser,
} from "./mcpClient";

const ZerodhaAuthContext = createContext();

// PUBLIC_INTERFACE
export function useZerodhaAuth() {
  return useContext(ZerodhaAuthContext);
}

const AUTH_STORE_KEY = "zerodha_token_auth";
const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

/**
 * ZerodhaAuthProvider
 * Live auth using MCP OAuth login and token.
 */
const ZerodhaAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // On mount, restore auth, and verify user info (to avoid using expired token)
  useEffect(() => {
    async function restore() {
      setIsLoading(true);
      const auth = getStoredAuth();
      if (auth && auth.token) {
        try {
          // Try fetching profile, fail if token invalid
          const profile = await mcpGetUser(auth.token);
          setToken(auth.token);
          setUser(profile);
          setIsAuthenticated(true);
        } catch (e) {
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem(AUTH_STORE_KEY);
        }
      }
      setIsLoading(false);
    }
    restore();
  }, []);

  // PUBLIC_INTERFACE
  const login = useCallback(() => {
    setIsLoading(true);
    setError(null);
    mcpLoginPopup({
      onBegin: () => setIsLoading(true),
      onComplete: async ({ token, user }) => {
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        setIsLoading(false);
        try {
          localStorage.setItem(AUTH_STORE_KEY, JSON.stringify({ token, user }));
        } catch (_) {}
      },
      onError: (msg) => {
        setIsLoading(false);
        setIsAuthenticated(false);
        setError(msg);
      },
    });
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await mcpLogout(token);
    } catch (_) {
      // ignore API logout errors, client-side logout regardless
    }
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setIsLoading(false);
    try {
      localStorage.removeItem(AUTH_STORE_KEY);
    } catch (_) {}
  }, [token]);

  // Helper (for showing errors)
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

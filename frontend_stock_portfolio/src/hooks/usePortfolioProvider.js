import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useZerodhaAuth } from "./useZerodhaAuthProvider";
import { mcpGetPortfolio, mcpGetRecommendations } from "./mcpClient";

/**
 * PortfolioProvider - handles fetching and updating user's portfolio and recs via live MCP.
 */
const PortfolioContext = createContext();

export function usePortfolio() {
  // PUBLIC_INTERFACE
  return useContext(PortfolioContext);
}

const PortfolioProvider = ({ children }) => {
  const [holdings, setHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  const { token, isAuthenticated } = useZerodhaAuth();

  // fetch portfolio (holdings)
  const fetchHoldings = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setHoldings([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await mcpGetPortfolio(token);
      // Adapts raw data to {ticker, quantity, avg_price, last_price}
      const mapped = (Array.isArray(data?.holdings) ? data.holdings : data).map((item) => ({
        ticker: item.symbol || item.ticker,
        quantity: item.quantity,
        avg_price: item.average_price || item.avg_price || 0,
        last_price: item.last_price,
      })) || [];
      setHoldings(mapped);
    } catch (_) {
      setHoldings([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated]);

  // fetch recommendations
  const fetchRecommendations = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setRecommendations([]);
      setRecommendationsLoading(false);
      return;
    }
    setRecommendationsLoading(true);
    try {
      const data = await mcpGetRecommendations(token);
      setRecommendations(
        Array.isArray(data?.recommendations) ? data.recommendations : (data || [])
      );
    } catch (_) {
      setRecommendations([]);
    } finally {
      setRecommendationsLoading(false);
    }
  }, [token, isAuthenticated]);

  // Fetch on auth/token change
  useEffect(() => {
    fetchHoldings();
    fetchRecommendations();
    // We rely on the above being memoized
    // eslint-disable-next-line
  }, [token, isAuthenticated]);

  // PUBLIC_INTERFACE
  const contextValue = {
    holdings,
    isLoading,
    recommendations,
    recommendationsLoading,
    // Live fetch methods for manual refresh
    fetchHoldings,
    fetchRecommendations,
  };
  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioProvider;

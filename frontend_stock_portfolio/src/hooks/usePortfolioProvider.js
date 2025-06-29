import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * PortfolioProvider - handles fetching and updating user's portfolio and recs.
 */
const PortfolioContext = createContext();

export function usePortfolio() {
  // PUBLIC_INTERFACE
  return useContext(PortfolioContext);
}

/**
 * Demo data until hooked up with backend/db.
 */
const DEMO_HOLDINGS = [
  { ticker: "INFY", quantity: 10, avg_price: 1410, last_price: 1481 },
  { ticker: "TCS", quantity: 5, avg_price: 3320, last_price: 3355 },
  { ticker: "HDFCBANK", quantity: 12, avg_price: 1575, last_price: 1599.5 },
  { ticker: "RELIANCE", quantity: 6, avg_price: 2720, last_price: 2698 },
];
const DEMO_RECOMMENDATIONS = [
  { ticker: "ITC", type: "BUY", description: "Strong breakout above 430 zone" },
  { ticker: "ICICIBANK", type: "WATCH", description: "Earnings due, high volatility expected" },
  { ticker: "RELIANCE", type: "SELL", description: "Near resistance, consider booking profits" },
];

const PortfolioProvider = ({ children }) => {
  const [holdings, setHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  useEffect(() => {
    // Simulated load for demo
    setTimeout(() => {
      setHoldings(DEMO_HOLDINGS);
      setIsLoading(false);
    }, 400);
    setTimeout(() => {
      setRecommendations(DEMO_RECOMMENDATIONS);
      setRecommendationsLoading(false);
    }, 700);
  }, []);

  // PUBLIC_INTERFACE
  const contextValue = {
    holdings,
    isLoading,
    recommendations,
    recommendationsLoading,
    // API expansion: fetchHoldings, refresh, etc.
  };
  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioProvider;

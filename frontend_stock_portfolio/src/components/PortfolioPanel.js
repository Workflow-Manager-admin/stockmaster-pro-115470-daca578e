import React from "react";
import { usePortfolio } from "../hooks/usePortfolioProvider";

/**
 * PortfolioPanel - Displays user's holdings and real-time profit & loss.
 */
function PortfolioPanel() {
  const { holdings, isLoading } = usePortfolio();

  // PUBLIC_INTERFACE
  function formatAmount(val) {
    // Formats float as INR, with ± sign for gains/losses
    return (val >= 0 ? "+" : "-") + "₹" + Math.abs(val).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }

  if (isLoading) return <div className="panel portfolio-panel">Loading portfolio...</div>;

  return (
    <div className="panel portfolio-panel" id="portfolio">
      <h3>My Holdings</h3>
      <table className="holdings-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Shares</th>
            <th>Cost/Share</th>
            <th>Last Price</th>
            <th>P&L / Share</th>
            <th>P&L (%)</th>
            <th>Total P&L</th>
          </tr>
        </thead>
        <tbody>
          {holdings.length === 0 ? (
            <tr><td colSpan={7}>No holdings.</td></tr>
          ) : (
            holdings.map((item) => {
              const cost = item.avg_price;
              const last = item.last_price;
              const pnl = last - cost;
              const pnlPct = 100 * pnl / cost;
              const totalPnl = pnl * item.quantity;
              return (
                <tr key={item.ticker}>
                  <td>{item.ticker}</td>
                  <td>{item.quantity}</td>
                  <td>₹{cost.toFixed(2)}</td>
                  <td>₹{last.toFixed(2)}</td>
                  <td className={pnl >= 0 ? "pnl-pos" : "pnl-neg"}>{formatAmount(pnl)}</td>
                  <td className={pnl >= 0 ? "pnl-pos" : "pnl-neg"}>{pnlPct.toFixed(2)}%</td>
                  <td className={totalPnl >= 0 ? "pnl-pos" : "pnl-neg"}>{formatAmount(totalPnl)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioPanel;

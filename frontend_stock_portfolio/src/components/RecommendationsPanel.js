import React from "react";
import { usePortfolio } from "../hooks/usePortfolioProvider";

/**
 * RecommendationsPanel - Shows AI or server-based investment ideas.
 */
function RecommendationsPanel() {
  const { recommendations, recommendationsLoading } = usePortfolio();

  return (
    <div className="panel recommendations-panel" id="recommendations">
      <h3>Investment Recommendations</h3>
      {recommendationsLoading ? (
        <div>Loading...</div>
      ) : recommendations.length === 0 ? (
        <div>No recommendations at the moment.</div>
      ) : (
        <ul className="recommendation-list">
          {recommendations.map((rec, i) => (
            <li key={i} className="recommendation-card">
              <span className="rec-ticker">{rec.ticker}</span>
              <span className="rec-type">{rec.type}</span>
              <span className="rec-desc">{rec.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecommendationsPanel;

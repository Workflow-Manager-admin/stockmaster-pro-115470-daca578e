import React, { createContext, useContext, useState } from "react";
import { useZerodhaAuth } from "./useZerodhaAuthProvider";
import { mcpPlaceOrder } from "./mcpClient";

/**
 * ZerodhaProvider: API integration for order placement. LIVE via MCP server!
 */
const ZerodhaContext = createContext();

export function useZerodha() {
  // PUBLIC_INTERFACE
  return useContext(ZerodhaContext);
}

const ZerodhaProvider = ({ children }) => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const { token, isAuthenticated } = useZerodhaAuth();

  // PUBLIC_INTERFACE
  async function placeOrder(order) {
    setOrderLoading(true);
    setOrderStatus(null);
    setOrderError(null);

    if (!isAuthenticated || !token) {
      setOrderError("Not authenticated. Please login.");
      setOrderLoading(false);
      return;
    }
    try {
      const placed = await mcpPlaceOrder(token, order);
      setOrderStatus(
        placed.status
          ? `${placed.status}: ${placed.order_id || ""}`
          : "Order submitted"
      );
    } catch (e) {
      setOrderError(e.message || "Failed to place order.");
    } finally {
      setOrderLoading(false);
    }
  }

  const contextValue = {
    placeOrder,
    orderStatus,
    orderLoading,
    orderError,
  };

  return (
    <ZerodhaContext.Provider value={contextValue}>
      {children}
    </ZerodhaContext.Provider>
  );
};

export default ZerodhaProvider;

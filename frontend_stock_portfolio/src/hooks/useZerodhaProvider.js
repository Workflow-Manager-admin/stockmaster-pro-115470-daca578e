import React, { createContext, useContext, useState } from "react";

/**
 * ZerodhaProvider: API integration for order placement.
 *
 * To wire up to real Zerodha MCP REST endpoints, add logic/API calls inside placeOrder().
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

  // PUBLIC_INTERFACE
  function placeOrder(order) {
    setOrderLoading(true);
    setOrderStatus(null);
    setOrderError(null);

    // Simulate a fake order & response
    setTimeout(() => {
      if (!order.symbol || !order.price || !order.strike) {
        setOrderError("Invalid order details");
        setOrderLoading(false);
        return;
      }
      setOrderStatus(
        `${order.direction} ${order.qty} ${order.symbol} ${order.option_type} @ ₹${order.price} (strike ${order.strike})`
      );
      setOrderLoading(false);
    }, 850);
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

import React, { useState } from "react";
import { useZerodha } from "../hooks/useZerodhaProvider";
import { useZerodhaAuth } from "../hooks/useZerodhaAuthProvider";

/**
 * OptionsTradingPanel - Simple UI for trading stock options with Zerodha MCP integration.
 */
function OptionsTradingPanel() {
  const { placeOrder, orderStatus, orderLoading, orderError } = useZerodha();
  const [form, setForm] = useState({
    symbol: "",
    option_type: "CALL",
    strike: "",
    qty: 1,
    direction: "BUY",
    price: "",
  });

  const { isAuthenticated } = useZerodhaAuth();

  // PUBLIC_INTERFACE
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.symbol || !form.strike || !form.price) return;
    placeOrder(form);
  }

  return (
    <div className="panel options-trading-panel" id="options">
      <h3>Options Trading (Zerodha MCP Demo)</h3>
      {!isAuthenticated && (
        <div
          style={{
            background: "#fff4e9",
            color: "#e65100",
            margin: "5px 0 10px 0",
            padding: "8px 15px",
            borderRadius: 7,
            fontSize: "0.98em",
            fontWeight: 500,
          }}
        >
          <span role="img" aria-label="warning" style={{ marginRight: 4 }}>
            ⚠️
          </span>
          Login with Zerodha to place live trades.
        </div>
      )}
      <form onSubmit={handleSubmit} className="options-form">
        <input type="text" name="symbol" placeholder="Symbol (e.g. INFY)" value={form.symbol} onChange={handleChange} required />
        <input type="number" name="strike" placeholder="Strike Price" value={form.strike} min="1" onChange={handleChange} required />
        <select name="option_type" value={form.option_type} onChange={handleChange}>
          <option value="CALL">CALL</option>
          <option value="PUT">PUT</option>
        </select>
        <input type="number" name="qty" placeholder="Qty" value={form.qty} min="1" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Order Price" value={form.price} min="0" step="0.05" onChange={handleChange} required />
        <select name="direction" value={form.direction} onChange={handleChange}>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <button className="btn" type="submit" disabled={orderLoading || !isAuthenticated}>Place Order</button>
      </form>
      {orderStatus && <div className="order-success">Order placed: {orderStatus}</div>}
      {orderError && <div className="order-error">Error: {orderError}</div>}
    </div>
  );
}

export default OptionsTradingPanel;

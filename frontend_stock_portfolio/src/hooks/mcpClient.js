//
// MCP REST client for Zerodha Kite using MCP server (https://mcp.kite.trade/mcp)
// Handles login (OAuth), token management, portfolio, and trading actions
//

const MCP_BASE = "https://mcp.kite.trade/mcp";

/**
 * Utility function to handle API errors.
 */
async function handleMcpResponse(res) {
  let body;
  try {
    body = await res.json();
  } catch (_) {}
  if (!res.ok) {
    const msg =
      body && body.error
        ? body.error
        : res.statusText || "API error";
    throw new Error(msg);
  }
  return body;
}

/**
 * Starts the OAuth login flow with Zerodha via MCP server.
 * Returns: Promise<{ token, user: {...} }>
 * Opens login in a popup, waits for redirect back to our page with code.
 * Uses window.postMessage to catch completion.
 */
export async function mcpLoginPopup({ onBegin = () => {}, onComplete = () => {}, onError = () => {} }) {
  return new Promise((resolve, reject) => {
    const width = 520, height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    const authUrl = `${MCP_BASE}/login/oauth/authorize`; // Assume MCP documents this endpoint for OAuth
    const popup = window.open(
      authUrl,
      "ZerodhaOAuth",
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
    );
    if (!popup) {
      onError("Popup blocked for login");
      reject(new Error("Popup blocked"));
      return;
    }
    onBegin();
    // listen for success/fail postMessage from the popup
    function receiveMsg(ev) {
      if (!ev.data || typeof ev.data !== "object" || !ev.data.mcpAuthDone) return;
      window.removeEventListener("message", receiveMsg);
      if (popup) try { popup.close(); } catch (_) {}
      if (ev.data.error) {
        onError(ev.data.error);
        reject(new Error(ev.data.error));
        return;
      }
      // { token, user }
      onComplete(ev.data);
      resolve(ev.data);
    }
    window.addEventListener("message", receiveMsg);

    // fallback timeout
    setTimeout(() => {
      window.removeEventListener("message", receiveMsg);
      try { if (popup) popup.close(); } catch (_) {}
      onError("Login timed out");
      reject(new Error("Login timed out"));
    }, 90 * 1000);
  });
}

/**
 * Log out via MCP server; removes session on backend.
 */
export async function mcpLogout(token) {
  const res = await fetch(`${MCP_BASE}/logout`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
  if (res.status === 204) return true;
  await handleMcpResponse(res);
  return true;
}

/**
 * Get user profile information from MCP
 * @param {string} token Zerodha bearer token
 */
export async function mcpGetUser(token) {
  const res = await fetch(`${MCP_BASE}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return await handleMcpResponse(res);
}

/**
 * Get the user's live portfolio/holdings (GET /portfolio)
 */
export async function mcpGetPortfolio(token) {
  const res = await fetch(`${MCP_BASE}/portfolio`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return await handleMcpResponse(res);
}

/**
 * Get investment recommendations (GET /recommendations)
 */
export async function mcpGetRecommendations(token) {
  const res = await fetch(`${MCP_BASE}/recommendations`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return await handleMcpResponse(res);
}

/**
 * Place a trade order (POST /orders)
 * @param {object} order { symbol, option_type, strike, qty, direction, price }
 */
export async function mcpPlaceOrder(token, order) {
  const res = await fetch(`${MCP_BASE}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  return await handleMcpResponse(res);
}

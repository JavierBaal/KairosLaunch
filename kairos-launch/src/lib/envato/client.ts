/**
 * Envato API Client
 * Handles OAuth token exchange and API requests to Envato
 */

const ENVATO_API_BASE = "https://api.envato.com";

export interface EnvatoTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface EnvatoUser {
  username: string;
  email: string;
  image: string;
}

export interface EnvatoPurchase {
  code: string;
  item: {
    id: number;
    name: string;
  };
  license: string;
  purchased_at: string;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeEnvatoToken(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<EnvatoTokenResponse> {
  const response = await fetch(`${ENVATO_API_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange token: ${error}`);
  }

  return response.json();
}

/**
 * Get user information from Envato API
 */
export async function getEnvatoUser(accessToken: string): Promise<EnvatoUser> {
  const response = await fetch(`${ENVATO_API_BASE}/v1/market/private/user/account.json`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get user info: ${error}`);
  }

  const data = await response.json();
  return {
    username: data.username,
    email: data.email,
    image: data.image,
  };
}

/**
 * Get user's purchases from Envato API
 */
export async function getEnvatoPurchases(accessToken: string): Promise<EnvatoPurchase[]> {
  const response = await fetch(`${ENVATO_API_BASE}/v3/market/buyer/purchases`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }
    const error = await response.text();
    throw new Error(`Failed to get purchases: ${error}`);
  }

  const data = await response.json();
  return data.purchases || [];
}

/**
 * Check if user has purchased a specific item
 */
export async function hasPurchasedItem(
  accessToken: string,
  itemId: string
): Promise<boolean> {
  try {
    const purchases = await getEnvatoPurchases(accessToken);
    return purchases.some((purchase) => purchase.item.id.toString() === itemId);
  } catch (error) {
    console.error("Error checking purchase:", error);
    return false;
  }
}


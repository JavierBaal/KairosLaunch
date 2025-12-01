/**
 * License Verification Logic
 * Handles license verification with caching and rate limiting
 */

import { hasPurchasedItem } from "./client";

// In-memory cache for license verification results
// In production, consider using Redis or similar
const licenseCache = new Map<string, { verified: boolean; expiresAt: number }>();

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

export interface LicenseVerificationResult {
  verified: boolean;
  cached: boolean;
  error?: string;
}

/**
 * Verify license with caching
 */
export async function verifyLicense(
  accessToken: string,
  itemId: string,
  userId: string
): Promise<LicenseVerificationResult> {
  const cacheKey = `${userId}:${itemId}`;
  
  // Check cache first
  const cached = licenseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      verified: cached.verified,
      cached: true,
    };
  }

  try {
    // Verify with Envato API
    const verified = await hasPurchasedItem(accessToken, itemId);
    
    // Cache the result
    licenseCache.set(cacheKey, {
      verified,
      expiresAt: Date.now() + CACHE_TTL,
    });

    return {
      verified,
      cached: false,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Log failed verification attempts
    console.error("License verification failed:", {
      userId,
      itemId,
      error: errorMessage,
    });

    return {
      verified: false,
      cached: false,
      error: errorMessage,
    };
  }
}

/**
 * Clear cache for a specific user/item combination
 */
export function clearLicenseCache(userId: string, itemId: string): void {
  const cacheKey = `${userId}:${itemId}`;
  licenseCache.delete(cacheKey);
}

/**
 * Clear all license cache (useful for testing)
 */
export function clearAllLicenseCache(): void {
  licenseCache.clear();
}


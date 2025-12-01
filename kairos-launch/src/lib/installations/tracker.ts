/**
 * Installation Tracking Logic
 * Tracks deployment records and detects duplicate license usage
 */

import { db } from "@/lib/db/client";
import { installation } from "../../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface CreateInstallationParams {
  productId: string;
  purchaseCode: string;
  userEmail: string;
  vercelDeploymentUrl: string;
  vercelProjectId: string;
  status: "success" | "failed" | "pending";
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create installation record
 */
export async function createInstallation(
  params: CreateInstallationParams
): Promise<string> {
  // Check for duplicate license usage
  const existing = await db
    .select()
    .from(installation)
    .where(
      and(
        eq(installation.productId, params.productId),
        eq(installation.purchaseCode, params.purchaseCode)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Log duplicate detection but allow (as per requirements)
    console.warn("Duplicate license detected:", {
      productId: params.productId,
      purchaseCode: params.purchaseCode,
      existingInstallation: existing[0].id,
    });
  }

  const installationId = nanoid();

  await db.insert(installation).values({
    id: installationId,
    productId: params.productId,
    purchaseCode: params.purchaseCode,
    userEmail: params.userEmail,
    vercelDeploymentUrl: params.vercelDeploymentUrl,
    vercelProjectId: params.vercelProjectId,
    status: params.status,
    errorMessage: params.errorMessage,
    metadata: params.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return installationId;
}

/**
 * Update installation status
 */
export async function updateInstallationStatus(
  installationId: string,
  status: "success" | "failed" | "pending",
  errorMessage?: string
): Promise<void> {
  await db
    .update(installation)
    .set({
      status,
      errorMessage,
      updatedAt: new Date(),
    })
    .where(eq(installation.id, installationId));
}

/**
 * Get installation by ID
 */
export async function getInstallation(installationId: string) {
  const results = await db
    .select()
    .from(installation)
    .where(eq(installation.id, installationId))
    .limit(1);

  return results[0] || null;
}

/**
 * Get installations by product ID
 */
export async function getInstallationsByProduct(productId: string) {
  return db
    .select()
    .from(installation)
    .where(eq(installation.productId, productId));
}

/**
 * Get installations by purchase code
 */
export async function getInstallationsByPurchaseCode(purchaseCode: string) {
  return db
    .select()
    .from(installation)
    .where(eq(installation.purchaseCode, purchaseCode));
}

/**
 * Check if license has been used before
 */
export async function hasLicenseBeenUsed(
  productId: string,
  purchaseCode: string
): Promise<boolean> {
  const results = await db
    .select()
    .from(installation)
    .where(
      and(
        eq(installation.productId, productId),
        eq(installation.purchaseCode, purchaseCode)
      )
    )
    .limit(1);

  return results.length > 0;
}


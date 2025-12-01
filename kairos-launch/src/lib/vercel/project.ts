/**
 * Vercel Project Creation Logic
 * Handles project creation and configuration
 */

import {
  createVercelProject,
  getVercelProject,
  type CreateProjectOptions,
} from "./client";
import { db } from "@/lib/db/client";
import { productConfig } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";

export interface CreateProjectParams {
  accessToken: string;
  productId: string;
  purchaseCode: string;
  userId: string;
}

/**
 * Generate project name from product ID and purchase code
 */
export function generateProjectName(productId: string, purchaseCode: string): string {
  // Use last 6 characters of purchase code as suffix
  const suffix = purchaseCode.slice(-6).toLowerCase();
  return `${productId}-${suffix}`;
}

/**
 * Create Vercel project for product deployment
 */
export async function createProjectForProduct(
  params: CreateProjectParams
): Promise<{ projectId: string; projectName: string }> {
  const { accessToken, productId, purchaseCode } = params;

  // Load product config
  const configs = await db
    .select()
    .from(productConfig)
    .where(productConfig.productId.eq(productId))
    .limit(1);

  if (configs.length === 0) {
    throw new Error(`Product config not found: ${productId}`);
  }

  const config = configs[0].config as any;
  const repoConfig = config.repository;

  // Generate project name
  const projectName = generateProjectName(productId, purchaseCode);

  // Create project options
  const projectOptions: CreateProjectOptions = {
    name: projectName,
    framework: config.deployment?.framework || "nextjs",
    gitRepository: {
      type: "github",
      repo: repoConfig.repo,
      owner: repoConfig.owner,
      ref: repoConfig.branch || "main",
    },
  };

  // Create project in Vercel
  const project = await createVercelProject(accessToken, projectOptions);

  return {
    projectId: project.id,
    projectName: project.name,
  };
}

/**
 * Verify project exists and is accessible
 */
export async function verifyProjectAccess(
  accessToken: string,
  projectId: string
): Promise<boolean> {
  try {
    await getVercelProject(accessToken, projectId);
    return true;
  } catch (error) {
    console.error("Project verification failed:", error);
    return false;
  }
}


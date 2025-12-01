/**
 * Deployment Orchestration Logic
 * Handles deployment flow with polling and status tracking
 */

import { getDeploymentStatus, type VercelDeployment } from "./client";

export interface DeploymentStatus {
  deploymentId: string;
  status: "pending" | "building" | "ready" | "error";
  url?: string;
  progress?: number;
  error?: string;
}

const POLL_INTERVAL = 5000; // 5 seconds
const MAX_DEPLOYMENT_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Poll deployment status until completion or timeout
 */
export async function pollDeploymentStatus(
  accessToken: string,
  deploymentId: string,
  onProgress?: (status: DeploymentStatus) => void
): Promise<DeploymentStatus> {
  const startTime = Date.now();

  while (true) {
    // Check timeout
    if (Date.now() - startTime > MAX_DEPLOYMENT_TIME) {
      return {
        deploymentId,
        status: "error",
        error: "Deployment timeout exceeded",
      };
    }

    try {
      const deployment = await getDeploymentStatus(accessToken, deploymentId);

      const status: DeploymentStatus = {
        deploymentId,
        status: mapDeploymentState(deployment.readyState),
        url: deployment.url,
        progress: calculateProgress(deployment.readyState),
      };

      // Call progress callback
      if (onProgress) {
        onProgress(status);
      }

      // Check if deployment is complete
      if (deployment.readyState === "READY") {
        return {
          ...status,
          status: "ready",
        };
      }

      if (deployment.readyState === "ERROR" || deployment.readyState === "CANCELED") {
        return {
          ...status,
          status: "error",
          error: "Deployment failed or was canceled",
        };
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        deploymentId,
        status: "error",
        error: errorMessage,
      };
    }
  }
}

/**
 * Map Vercel deployment state to our status
 */
function mapDeploymentState(
  state: VercelDeployment["readyState"]
): DeploymentStatus["status"] {
  switch (state) {
    case "QUEUED":
    case "INITIALIZING":
      return "pending";
    case "BUILDING":
      return "building";
    case "READY":
      return "ready";
    case "ERROR":
    case "CANCELED":
      return "error";
    default:
      return "pending";
  }
}

/**
 * Calculate deployment progress percentage
 */
function calculateProgress(state: VercelDeployment["readyState"]): number {
  switch (state) {
    case "QUEUED":
      return 10;
    case "INITIALIZING":
      return 25;
    case "BUILDING":
      return 60;
    case "READY":
      return 100;
    case "ERROR":
    case "CANCELED":
      return 0;
    default:
      return 0;
  }
}

/**
 * Get deployment status (single check, no polling)
 */
export async function getDeploymentStatusOnce(
  accessToken: string,
  deploymentId: string
): Promise<DeploymentStatus> {
  try {
    const deployment = await getDeploymentStatus(accessToken, deploymentId);
    return {
      deploymentId,
      status: mapDeploymentState(deployment.readyState),
      url: deployment.url,
      progress: calculateProgress(deployment.readyState),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      deploymentId,
      status: "error",
      error: errorMessage,
    };
  }
}


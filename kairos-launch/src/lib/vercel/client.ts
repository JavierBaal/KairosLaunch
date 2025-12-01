/**
 * Vercel API Client
 * Handles Vercel API requests for project creation and deployment
 */

const VERCEL_API_BASE = "https://api.vercel.com";

export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  updatedAt: number;
  createdAt: number;
}

export interface VercelDeployment {
  uid: string;
  url: string;
  state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED";
  readyState: "QUEUED" | "BUILDING" | "ERROR" | "INITIALIZING" | "READY" | "CANCELED";
  createdAt: number;
  buildingAt?: number;
  readyAt?: number;
}

export interface CreateProjectOptions {
  name: string;
  framework?: string;
  gitRepository?: {
    type: "github";
    repo: string;
    owner: string;
    ref?: string;
  };
}

/**
 * Create a new Vercel project
 */
export async function createVercelProject(
  accessToken: string,
  options: CreateProjectOptions
): Promise<VercelProject> {
  const response = await fetch(`${VERCEL_API_BASE}/v9/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: options.name,
      framework: options.framework || "nextjs",
      gitRepository: options.gitRepository,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create project: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Get deployment status
 */
export async function getDeploymentStatus(
  accessToken: string,
  deploymentId: string
): Promise<VercelDeployment> {
  const response = await fetch(`${VERCEL_API_BASE}/v13/deployments/${deploymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get deployment status: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Create environment variable in Vercel project
 */
export async function createEnvironmentVariable(
  accessToken: string,
  projectId: string,
  key: string,
  value: string,
  environment: ("production" | "preview" | "development")[] = ["production", "preview"]
): Promise<void> {
  const response = await fetch(
    `${VERCEL_API_BASE}/v9/projects/${projectId}/env`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: environment,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create environment variable: ${JSON.stringify(error)}`);
  }
}

/**
 * Get Vercel project information
 */
export async function getVercelProject(
  accessToken: string,
  projectId: string
): Promise<VercelProject> {
  const response = await fetch(`${VERCEL_API_BASE}/v9/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get project: ${JSON.stringify(error)}`);
  }

  return response.json();
}


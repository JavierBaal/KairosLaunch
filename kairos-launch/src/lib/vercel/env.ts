/**
 * Environment Variables Management
 * Handles injection of environment variables into Vercel projects
 */

import { createEnvironmentVariable } from "./client";
import type { ProductConfig } from "@/types/config";

export interface EnvironmentVariable {
  key: string;
  value: string;
  environment?: ("production" | "preview" | "development")[];
}

/**
 * Inject system environment variables
 */
export async function injectSystemEnvVars(
  accessToken: string,
  projectId: string,
  purchaseCode: string,
  userEmail: string,
  productId: string
): Promise<void> {
  const systemVars: EnvironmentVariable[] = [
    {
      key: "LICENSE_KEY",
      value: purchaseCode,
      environment: ["production", "preview"],
    },
    {
      key: "USER_EMAIL",
      value: userEmail,
      environment: ["production", "preview"],
    },
    {
      key: "PRODUCT_ID",
      value: productId,
      environment: ["production", "preview"],
    },
  ];

  for (const envVar of systemVars) {
    await createEnvironmentVariable(
      accessToken,
      projectId,
      envVar.key,
      envVar.value,
      envVar.environment || ["production", "preview"]
    );
  }
}

/**
 * Inject user-provided environment variables
 */
export async function injectUserEnvVars(
  accessToken: string,
  projectId: string,
  userVars: Record<string, string>
): Promise<void> {
  for (const [key, value] of Object.entries(userVars)) {
    if (value.trim()) {
      // Never inject empty values
      await createEnvironmentVariable(
        accessToken,
        projectId,
        key,
        value,
        ["production", "preview"]
      );
    }
  }
}

/**
 * Inject all environment variables based on product config
 */
export async function injectAllEnvVars(
  accessToken: string,
  projectId: string,
  config: ProductConfig,
  purchaseCode: string,
  userEmail: string,
  userProvidedVars?: Record<string, string>
): Promise<void> {
  // Inject system variables first
  await injectSystemEnvVars(
    accessToken,
    projectId,
    purchaseCode,
    userEmail,
    config.product.id
  );

  // Process config-defined variables
  if (config.deployment.requiredEnvVars) {
    for (const envVar of config.deployment.requiredEnvVars) {
      if (envVar.userInput && userProvidedVars?.[envVar.key]) {
        // User-provided variable
        await createEnvironmentVariable(
          accessToken,
          projectId,
          envVar.key,
          userProvidedVars[envVar.key],
          ["production", "preview"]
        );
      } else if (envVar.value) {
        // Auto-injected variable (replace placeholders)
        let value = envVar.value;
        value = value.replace("{{PURCHASE_CODE}}", purchaseCode);
        value = value.replace("{{USER_EMAIL}}", userEmail);
        value = value.replace("{{PRODUCT_ID}}", config.product.id);

        await createEnvironmentVariable(
          accessToken,
          projectId,
          envVar.key,
          value,
          ["production", "preview"]
        );
      }
    }
  }

  // Inject additional user-provided variables
  if (userProvidedVars) {
    await injectUserEnvVars(accessToken, projectId, userProvidedVars);
  }
}


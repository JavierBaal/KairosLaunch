/**
 * Audit Logger
 * Logs all system actions for security and debugging
 */

import { db } from "@/lib/db/client";
import { auditLog } from "../../../drizzle/schema";
import { nanoid } from "nanoid";

export interface AuditLogEntry {
  action: string;
  userId?: string;
  details: Record<string, unknown>;
}

/**
 * Log an audit event
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    await db.insert(auditLog).values({
      id: nanoid(),
      action: entry.action,
      userId: entry.userId,
      details: entry.details,
      timestamp: new Date(),
    });
  } catch (error) {
    // Don't throw errors from audit logging - log to console as fallback
    console.error("Failed to log audit event:", error);
    console.error("Audit entry:", entry);
  }
}

/**
 * Common audit actions
 */
export const AuditActions = {
  USER_SIGN_IN: "user.sign_in",
  USER_SIGN_OUT: "user.sign_out",
  LICENSE_VERIFIED: "license.verified",
  LICENSE_VERIFICATION_FAILED: "license.verification_failed",
  VERCEL_CONNECTED: "vercel.connected",
  DEPLOYMENT_STARTED: "deployment.started",
  DEPLOYMENT_COMPLETED: "deployment.completed",
  DEPLOYMENT_FAILED: "deployment.failed",
  INSTALLATION_CREATED: "installation.created",
  API_ERROR: "api.error",
} as const;


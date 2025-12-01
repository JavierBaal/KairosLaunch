import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { getDeploymentStatusOnce, pollDeploymentStatus } from "@/lib/vercel/deployment";
import { updateInstallationStatus } from "@/lib/installations/tracker";
import { logAuditEvent, AuditActions } from "@/lib/audit/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const deploymentId = searchParams.get("deploymentId");
    const installationId = searchParams.get("installationId");
    const poll = searchParams.get("poll") === "true";

    if (!deploymentId) {
      return NextResponse.json(
        { error: "deploymentId is required" },
        { status: 400 }
      );
    }

    const vercelToken = (session as any).vercelAccessToken;
    if (!vercelToken) {
      return NextResponse.json(
        { error: "Vercel not connected" },
        { status: 401 }
      );
    }

    if (poll) {
      // Poll until completion
      const status = await pollDeploymentStatus(vercelToken, deploymentId);

      // Update installation status if installationId provided
      if (installationId) {
        if (status.status === "ready") {
          await updateInstallationStatus(installationId, "success");
          await logAuditEvent({
            action: AuditActions.DEPLOYMENT_COMPLETED,
            userId: session.user.id || session.user.email || undefined,
            details: { installationId, deploymentId, url: status.url },
          });
        } else if (status.status === "error") {
          await updateInstallationStatus(installationId, "failed", status.error);
          await logAuditEvent({
            action: AuditActions.DEPLOYMENT_FAILED,
            userId: session.user.id || session.user.email || undefined,
            details: { installationId, deploymentId, error: status.error },
          });
        }
      }

      return NextResponse.json(status);
    } else {
      // Single status check
      const status = await getDeploymentStatusOnce(vercelToken, deploymentId);
      return NextResponse.json(status);
    }
  } catch (error) {
    console.error("Deployment status error:", error);

    await logAuditEvent({
      action: AuditActions.API_ERROR,
      details: {
        endpoint: "/api/deploy/status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      { error: "Failed to get deployment status" },
      { status: 500 }
    );
  }
}


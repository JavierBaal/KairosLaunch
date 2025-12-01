import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { createProjectForProduct } from "@/lib/vercel/project";
import { injectAllEnvVars } from "@/lib/vercel/env";
import { createInstallation } from "@/lib/installations/tracker";
import { loadProductConfig } from "@/lib/config/loader";
import { logAuditEvent, AuditActions } from "@/lib/audit/logger";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, purchaseCode, userEnvVars } = body;

    if (!productId || !purchaseCode) {
      return NextResponse.json(
        { error: "productId and purchaseCode are required" },
        { status: 400 }
      );
    }

    // Get Vercel access token from session
    const vercelToken = (session as any).vercelAccessToken;
    if (!vercelToken) {
      return NextResponse.json(
        { error: "Vercel not connected. Please connect your Vercel account." },
        { status: 401 }
      );
    }

    // Load product config
    const config = await loadProductConfig(productId);

    // Create Vercel project
    const { projectId, projectName } = await createProjectForProduct({
      accessToken: vercelToken,
      productId,
      purchaseCode,
      userId: session.user.id || session.user.email || "unknown",
    });

    // Inject environment variables
    await injectAllEnvVars(
      vercelToken,
      projectId,
      config,
      purchaseCode,
      session.user.email || "",
      userEnvVars
    );

    // Create installation record
    const installationId = await createInstallation({
      productId,
      purchaseCode,
      userEmail: session.user.email || "",
      vercelDeploymentUrl: `https://${projectName}.vercel.app`, // Temporary URL
      vercelProjectId: projectId,
      status: "pending",
      metadata: {
        projectName,
        userEnvVarsProvided: !!userEnvVars,
      },
    });

    // Log audit event
    await logAuditEvent({
      action: AuditActions.DEPLOYMENT_STARTED,
      userId: session.user.id || session.user.email || undefined,
      details: {
        productId,
        projectId,
        installationId,
      },
    });

    return NextResponse.json({
      success: true,
      installationId,
      projectId,
      projectName,
    });
  } catch (error) {
    console.error("Deployment start error:", error);

    await logAuditEvent({
      action: AuditActions.API_ERROR,
      details: {
        endpoint: "/api/deploy/start",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      {
        error: "Failed to start deployment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


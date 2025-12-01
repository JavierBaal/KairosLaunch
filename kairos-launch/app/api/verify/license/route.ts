import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { verifyLicense } from "@/lib/envato/license";
import { logAuditEvent, AuditActions } from "@/lib/audit/logger";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId is required" },
        { status: 400 }
      );
    }

    // Get access token from session
    const accessToken = (session as any).accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found. Please sign in again." },
        { status: 401 }
      );
    }

    // Verify license
    const result = await verifyLicense(
      accessToken,
      itemId,
      session.user.id || session.user.email || "unknown"
    );

    // Log audit event
    await logAuditEvent({
      action: result.verified
        ? AuditActions.LICENSE_VERIFIED
        : AuditActions.LICENSE_VERIFICATION_FAILED,
      userId: session.user.id || session.user.email || undefined,
      details: {
        itemId,
        verified: result.verified,
        cached: result.cached,
        error: result.error,
      },
    });

    if (!result.verified) {
      return NextResponse.json(
        {
          verified: false,
          error: result.error || "License verification failed",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      verified: true,
      cached: result.cached,
    });
  } catch (error) {
    console.error("License verification error:", error);
    
    await logAuditEvent({
      action: AuditActions.API_ERROR,
      details: {
        endpoint: "/api/verify/license",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


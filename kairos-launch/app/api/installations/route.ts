import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import {
  getInstallationsByProduct,
  getInstallationsByPurchaseCode,
} from "@/lib/installations/tracker";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const purchaseCode = searchParams.get("purchaseCode");

    if (productId) {
      const installations = await getInstallationsByProduct(productId);
      return NextResponse.json({ installations });
    }

    if (purchaseCode) {
      const installations = await getInstallationsByPurchaseCode(purchaseCode);
      return NextResponse.json({ installations });
    }

    return NextResponse.json(
      { error: "productId or purchaseCode is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Installations API error:", error);
    return NextResponse.json(
      { error: "Failed to get installations" },
      { status: 500 }
    );
  }
}


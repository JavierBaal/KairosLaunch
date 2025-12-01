"use client";

import { useSearchParams } from "next/navigation";
import { SuccessScreen } from "@/components/install/SuccessScreen";
import { useParams } from "next/navigation";

export default function SuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.productId as string;
  const deploymentUrl = searchParams.get("url") || "";

  return <SuccessScreen productId={productId} deploymentUrl={deploymentUrl} />;
}


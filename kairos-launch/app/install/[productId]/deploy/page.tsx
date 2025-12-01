"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { DeploymentProgress } from "@/components/install/DeploymentProgress";
import { Loader2 } from "lucide-react";

export default function DeployPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/install/${productId}/configure`);
    }
  }, [status, router, productId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <DeploymentProgress productId={productId} />;
}


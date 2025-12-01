"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface LicenseVerificationProps {
  productId: string;
}

export function LicenseVerification({ productId }: LicenseVerificationProps) {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    verifyLicense();
  }, []);

  const verifyLicense = async () => {
    try {
      // Get itemId from product config (would need to load config)
      // For now, using a placeholder - in real implementation, load config first
      const response = await fetch("/api/verify/license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: "12345678", // This should come from product config
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "License verification failed");
        setStatus("error");
        return;
      }

      setStatus("success");
      // Redirect to next step after a short delay
      setTimeout(() => {
        router.push(`/install/${productId}/connect`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Verifying License</CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "verifying" && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">Checking your Envato purchase...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <p className="text-lg font-semibold text-green-600">License verified! ✓</p>
              <p className="text-sm text-gray-600">Redirecting to next step...</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-red-600" />
              <p className="text-lg font-semibold text-red-600">Verification Failed</p>
              <p className="text-sm text-gray-600 text-center">{error}</p>
              <div className="flex flex-col space-y-2 w-full">
                <Button
                  onClick={verifyLicense}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => router.push(`/install/${productId}`)}
                  variant="ghost"
                  className="w-full"
                >
                  Go Back
                </Button>
                <a
                  href="https://codecanyon.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline text-center"
                >
                  Purchase on Codecanyon
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


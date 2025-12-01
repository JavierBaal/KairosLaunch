"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

interface VercelConnectionProps {
  productId: string;
}

export function VercelConnection({ productId }: VercelConnectionProps) {
  const [connecting, setConnecting] = useState(false);
  const router = useRouter();

  const handleConnect = () => {
    setConnecting(true);
    signIn("vercel", {
      callbackUrl: `/install/${productId}/configure`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Connect Vercel</CardTitle>
          <CardDescription className="text-center">
            Connect your Vercel account to deploy your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {connecting ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">Connecting to Vercel...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  We&apos;ll need permission to create projects and deploy to your Vercel account.
                </p>
                <Button onClick={handleConnect} size="lg" className="w-full">
                  Connect Vercel
                </Button>
                <Button
                  onClick={() => router.push(`/install/${productId}/verify`)}
                  variant="ghost"
                  className="w-full"
                >
                  Go Back
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


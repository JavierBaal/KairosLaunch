"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessTimeline } from "./ProcessTimeline";
import type { ProductConfig } from "@/types/config";
import { signIn } from "next-auth/react";

interface LandingPageProps {
  config: ProductConfig;
}

export function LandingPage({ config }: LandingPageProps) {
  const handleEnvatoLogin = () => {
    signIn("envato", {
      callbackUrl: `/install/${config.product.id}/verify`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            {config.product.logo && (
              <img
                src={config.product.logo}
                alt={config.product.name}
                className="h-16 mx-auto mb-6"
              />
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {config.product.name}
            </h1>
            {config.product.description && (
              <p className="text-xl text-gray-600 mb-8">
                {config.product.description}
              </p>
            )}
          </div>

          {/* Main CTA */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Ready to Install?
              </CardTitle>
              <CardDescription className="text-center">
                Get started in less than 5 minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleEnvatoLogin}
                size="lg"
                className="w-full"
              >
                Login with Envato
              </Button>
              <p className="text-sm text-center text-gray-500">
                Already have a license?{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Click here
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Process Timeline */}
          <ProcessTimeline />

          {/* FAQ Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Do I need technical knowledge?
                </h3>
                <p className="text-gray-600 text-sm">
                  No! The installation process is fully automated. You just need
                  to log in with your Envato account and connect your Vercel
                  account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  How long does installation take?
                </h3>
                <p className="text-gray-600 text-sm">
                  Typically 2-3 minutes. The entire process is automated and
                  you&apos;ll see real-time progress.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Is my code secure?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes! Your source code stays in a private repository and is
                  never exposed publicly. Only the deployed application is
                  accessible.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <div className="text-center mt-12 text-gray-600">
            <p>
              Need help?{" "}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


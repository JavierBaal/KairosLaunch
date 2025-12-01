"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ExternalLink, Mail, Twitter, Linkedin } from "lucide-react";

interface SuccessScreenProps {
  productId: string;
  deploymentUrl: string;
}

export function SuccessScreen({ productId, deploymentUrl }: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(deploymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Just deployed ${productId} using KairosLaunch! 🚀`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-3xl">Deployment Successful! 🎉</CardTitle>
          <CardDescription className="text-lg">
            Your app is now live and ready to use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Deployment URL */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Your Deployment URL</Label>
            <div className="flex space-x-2">
              <Input value={deploymentUrl} readOnly className="flex-1" />
              <Button onClick={copyToClipboard} variant="outline" size="icon">
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => window.open(deploymentUrl, "_blank")}
                variant="outline"
                size="icon"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-2">
            <h3 className="font-semibold">Next Steps</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Visit your app and log in with the admin credentials</li>
              <li>Configure your branding and settings</li>
              <li>Set up your database and integrations</li>
              <li>Contact support if you need help</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => window.open(deploymentUrl, "_blank")}
              size="lg"
              className="w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Go to My App
            </Button>

            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(deploymentUrl)}`,
                    "_blank"
                  );
                }}
                variant="outline"
                className="flex-1"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Share on Twitter
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(deploymentUrl)}`,
                    "_blank"
                  );
                }}
                variant="outline"
                className="flex-1"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                Share on LinkedIn
              </Button>
            </div>
          </div>

          {/* Support */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


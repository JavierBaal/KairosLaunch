"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";

interface DeploymentProgressProps {
  productId: string;
}

const deploymentSteps = [
  { id: "creating", label: "Creating project", icon: Clock },
  { id: "variables", label: "Injecting variables", icon: Clock },
  { id: "deploying", label: "Deploying code", icon: Loader2 },
  { id: "verifying", label: "Verifying deployment", icon: Clock },
];

export function DeploymentProgress({ productId }: DeploymentProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"deploying" | "success" | "error">("deploying");
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    startDeployment();
  }, []);

  const startDeployment = async () => {
    try {
      // Step 1: Create project
      setCurrentStep(0);
      setProgress(25);
      const startResponse = await fetch("/api/deploy/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          purchaseCode: "MOCK_CODE", // In real implementation, get from session
        }),
      });

      if (!startResponse.ok) {
        throw new Error("Failed to start deployment");
      }

      const { installationId, projectId } = await startResponse.json();

      // Step 2: Inject variables
      setCurrentStep(1);
      setProgress(50);

      // Step 3: Poll deployment status
      setCurrentStep(2);
      setProgress(60);

      const pollStatus = async () => {
        const statusResponse = await fetch(
          `/api/deploy/status?deploymentId=${projectId}&installationId=${installationId}&poll=true`
        );

        if (!statusResponse.ok) {
          throw new Error("Failed to get deployment status");
        }

        const statusData = await statusResponse.json();

        if (statusData.status === "ready") {
          setCurrentStep(3);
          setProgress(100);
          setStatus("success");
          setDeploymentUrl(statusData.url);
          setTimeout(() => {
            router.push(`/install/${productId}/success?url=${encodeURIComponent(statusData.url)}`);
          }, 2000);
        } else if (statusData.status === "error") {
          setStatus("error");
          setError(statusData.error || "Deployment failed");
        } else {
          setProgress(statusData.progress || 60);
          // Continue polling
          setTimeout(pollStatus, 5000);
        }
      };

      await pollStatus();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Deploying Your App</CardTitle>
          <CardDescription className="text-center">
            This will take a few minutes. Please don&apos;t close this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="h-2" />

          <div className="space-y-4">
            {deploymentSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep && status === "deploying";
              const isComplete = index < currentStep || status === "success";

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg ${
                    isActive ? "bg-blue-50" : isComplete ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : isActive ? (
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  ) : (
                    <StepIcon className="h-6 w-6 text-gray-400" />
                  )}
                  <span
                    className={`font-medium ${
                      isActive ? "text-blue-600" : isComplete ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {status === "error" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">Deployment Failed</span>
              </div>
              <p className="text-sm text-gray-600">{error}</p>
              <Button onClick={startDeployment} className="w-full">
                Retry Deployment
              </Button>
            </div>
          )}

          {status === "success" && deploymentUrl && (
            <div className="text-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
              <p className="font-semibold text-green-600">Deployment Successful!</p>
              <p className="text-sm text-gray-600">Redirecting...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

interface EnvVarFormProps {
  productId: string;
}

// Mock config - in real implementation, load from product config
const optionalEnvVars = [
  {
    key: "DATABASE_URL",
    description: "PostgreSQL connection (optional)",
    required: false,
  },
];

export function EnvVarForm({ productId }: EnvVarFormProps) {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (skip = false) => {
    setLoading(true);
    // Store env vars in session or pass to next step
    // For now, just proceed to deploy
    router.push(`/install/${productId}/deploy`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Configuration (Optional)</CardTitle>
          <CardDescription className="text-center">
            Optionally configure environment variables for your deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="w-full"
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Hide Advanced Options
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show Advanced Options
              </>
            )}
          </Button>

          {expanded && (
            <div className="space-y-4 pt-4 border-t">
              {optionalEnvVars.map((envVar) => (
                <div key={envVar.key} className="space-y-2">
                  <Label htmlFor={envVar.key}>{envVar.key}</Label>
                  <Input
                    id={envVar.key}
                    type="password"
                    placeholder={envVar.description}
                    value={envVars[envVar.key] || ""}
                    onChange={(e) =>
                      setEnvVars({ ...envVars, [envVar.key]: e.target.value })
                    }
                  />
                  {envVar.description && (
                    <p className="text-xs text-gray-500">{envVar.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <Button
              onClick={() => handleSubmit(true)}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Skip
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              className="flex-1"
              disabled={loading}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


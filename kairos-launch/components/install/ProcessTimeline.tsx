"use client";

import { Check } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Login with Envato",
    description: "Verify your purchase",
  },
  {
    number: 2,
    title: "Connect Vercel",
    description: "Link your Vercel account",
  },
  {
    number: 3,
    title: "Configure (Optional)",
    description: "Set environment variables",
  },
  {
    number: 4,
    title: "Deploy",
    description: "Watch your app deploy",
  },
  {
    number: 5,
    title: "Done!",
    description: "Start using your app",
  },
];

export function ProcessTimeline() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-semibold mb-2">
              {step.number}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {step.title}
            </h3>
            <p className="text-xs text-gray-600 text-center">
              {step.description}
            </p>
            {index < steps.length - 1 && (
              <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-300 -z-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


import { z } from "zod";

// Product Configuration Schema
export const productConfigSchema = z.object({
  product: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    logo: z.string().url().optional(),
    version: z.string().optional(),
  }),
  marketplace: z.object({
    platform: z.enum(["codecanyon", "gumroad", "lemon-squeezy"]),
    itemId: z.string().min(1),
    authorUsername: z.string().optional(),
  }),
  repository: z.object({
    provider: z.enum(["github"]),
    owner: z.string().min(1),
    repo: z.string().min(1),
    branch: z.string().default("main"),
    isPrivate: z.boolean().default(true),
  }),
  deployment: z.object({
    platform: z.enum(["vercel"]),
    framework: z.string().default("nextjs"),
    buildCommand: z.string().optional(),
    outputDirectory: z.string().optional(),
    installCommand: z.string().optional(),
    requiredEnvVars: z
      .array(
        z.object({
          key: z.string().min(1),
          value: z.string().optional(),
          userInput: z.boolean().default(false),
          required: z.boolean().default(false),
          description: z.string().optional(),
          validation: z
            .object({
              type: z.enum(["regex", "length", "url", "email"]),
              pattern: z.string().optional(),
              minLength: z.number().optional(),
              maxLength: z.number().optional(),
            })
            .optional(),
        })
      )
      .default([]),
  }),
  validation: z
    .object({
      endpoint: z.string().url().optional(),
      method: z.enum(["GET", "POST", "PUT"]).default("POST"),
    })
    .optional(),
});

export type ProductConfig = z.infer<typeof productConfigSchema>;


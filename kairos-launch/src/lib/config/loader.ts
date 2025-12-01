import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { productConfigSchema, type ProductConfig } from "@/types/config";

const CONFIGS_DIR = join(process.cwd(), "configs");

/**
 * Load a single product configuration file
 */
export async function loadProductConfig(productId: string): Promise<ProductConfig> {
  const configPath = join(CONFIGS_DIR, `${productId}.config.json`);
  
  try {
    const fileContent = await readFile(configPath, "utf-8");
    const config = JSON.parse(fileContent);
    
    // Validate with Zod schema
    return productConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config for product ${productId}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load all product configurations from the configs directory
 */
export async function loadAllProductConfigs(): Promise<Map<string, ProductConfig>> {
  const configs = new Map<string, ProductConfig>();
  
  try {
    const files = await readdir(CONFIGS_DIR);
    const configFiles = files.filter((file) => file.endsWith(".config.json"));
    
    for (const file of configFiles) {
      const productId = file.replace(".config.json", "");
      try {
        const config = await loadProductConfig(productId);
        configs.set(productId, config);
      } catch (error) {
        console.error(`Failed to load config from ${file}:`, error);
        // Continue loading other configs even if one fails
      }
    }
    
    return configs;
  } catch (error) {
    if (error instanceof Error && error.code === "ENOENT") {
      // Configs directory doesn't exist yet, return empty map
      return configs;
    }
    throw error;
  }
}

/**
 * Get product ID from config file name
 */
export function getProductIdFromFilename(filename: string): string | null {
  const match = filename.match(/^(.+)\.config\.json$/);
  return match ? match[1] : null;
}


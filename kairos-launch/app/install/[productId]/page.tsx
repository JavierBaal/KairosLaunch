import { loadProductConfig } from "@/lib/config/loader";
import { LandingPage } from "@/components/install/LandingPage";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function InstallPage({ params }: PageProps) {
  const { productId } = await params;

  try {
    const config = await loadProductConfig(productId);
    return <LandingPage config={config} />;
  } catch (error) {
    console.error("Failed to load product config:", error);
    notFound();
  }
}


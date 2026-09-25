import PricingClient from "@/app/pricing/PricingClient";
import { getCurrentUserTier } from "@/lib/auth";

export default async function PricingPage() {
  const tier = await getCurrentUserTier();
  return <PricingClient currentTier={tier} />;
}

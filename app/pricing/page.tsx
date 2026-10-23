import PricingClient from "@/app/pricing/PricingClient";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserTier } from "@/lib/auth";
import { PAYHIP_PRODUCT_URL } from "@/lib/payhip";

export default async function PricingPage() {
  const tier = await getCurrentUserTier();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PricingClient
      currentTier={tier}
      userEmail={user?.email ?? null}
      payhipUrl={PAYHIP_PRODUCT_URL || null}
    />
  );
}

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanTier } from "@/lib/moods";

/** Returns the current session's user id, or null if the visitor is anonymous. */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Returns the current visitor's plan tier (free / paid — one-time SGD 12
 * "Full Access"), from either a Stripe purchase (subscriptions row) or a
 * Payhip purchase recorded under the same email (payhip_purchases).
 * Anonymous visitors and anyone without a completed purchase get "free". The app owner (OWNER_EMAIL) always gets "paid" without needing a
 * purchase on file.
 */
export async function getCurrentUserTier(): Promise<PlanTier> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "free";

  const ownerEmail = process.env.OWNER_EMAIL?.toLowerCase();
  if (ownerEmail && user.email?.toLowerCase() === ownerEmail) return "paid";

  const { data } = await supabase
    .from("subscriptions")
    .select("plan_tier, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (data && data.status === "active" && data.plan_tier === "paid") return "paid";

  if (user.email && (await hasPayhipPurchase(user.email))) return "paid";

  return "free";
}

/**
 * True if Payhip's webhook has recorded a (non-refunded) Full Access purchase
 * for this email. Read with the service-role client: payhip_purchases has no
 * RLS policies, so buyers' emails are never readable from the browser.
 */
async function hasPayhipPurchase(email: string): Promise<boolean> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("payhip_purchases")
      .select("transaction_id")
      .eq("email", email.trim().toLowerCase())
      .eq("status", "paid")
      .limit(1);
    return !!data && data.length > 0;
  } catch {
    return false;
  }
}

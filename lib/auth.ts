import { createClient } from "@/lib/supabase/server";
import type { PlanTier } from "@/lib/moods";

/** Returns the current session's user id, or null if the visitor is anonymous. */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

/**
 * Returns the current visitor's plan tier (free / pro $3 / pro_plus $6),
 * read from the subscriptions row Stripe's webhook keeps up to date.
 * Anonymous visitors and anyone without an active/trialing subscription
 * get "free".
 */
export async function getCurrentUserTier(): Promise<PlanTier> {
  const userId = await getCurrentUserId();
  if (!userId) return "free";

  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan_tier, status")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data || !ACTIVE_STATUSES.has(data.status)) return "free";
  return data.plan_tier as PlanTier;
}

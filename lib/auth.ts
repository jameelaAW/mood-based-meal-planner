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

/**
 * Returns the current visitor's plan tier (free / paid — one-time $12 "Full
 * Access"), read from the subscriptions row Stripe's webhook keeps up to
 * date. Anonymous visitors and anyone without a completed purchase get
 * "free".
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

  if (!data || data.status !== "active") return "free";
  return data.plan_tier as PlanTier;
}

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
 * Returns the current visitor's plan tier (free / pro $3 / pro_plus $6).
 * There's no billing/subscriptions table yet, so this always returns "free"
 * until paid plans launch — meals.tier = 'pro' rows and the Pro-only moods
 * stay excluded for everyone in the meantime rather than being given away.
 */
export async function getCurrentUserTier(): Promise<PlanTier> {
  return "free";
}

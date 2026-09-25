import { createClient } from "@/lib/supabase/server";

/** Returns the current session's user id, or null if the visitor is anonymous. */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Returns the current visitor's plan tier. There's no billing/subscriptions
 * table yet, so this always returns "free" until the Pro tier launches —
 * meals.tier = 'pro' rows stay excluded from matching for everyone in the
 * meantime rather than being given away for free.
 */
export async function getCurrentUserTier(): Promise<"free" | "pro"> {
  return "free";
}

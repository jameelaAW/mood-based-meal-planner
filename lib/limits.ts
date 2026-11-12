import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Daily cap on meal suggestions for the free tier. Each suggestion can call
 * GPT-4o, so the cap keeps API costs predictable and gives free users a clear
 * moment to upgrade. Full Access (paid) users are never limited.
 */
export const FREE_DAILY_LIMIT = 3;

/** Name of the cookie that counts anonymous (not signed-in) visitors' uses. */
export const ANON_USES_COOKIE = "mmp_free_uses";

/** Today's date in Singapore, e.g. "2026-11-11" — the limit resets at SGT midnight. */
export function sgToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(now);
}

/** Midnight SGT at the start of today, as an ISO timestamp for DB queries. */
export function sgStartOfToday(now: Date = new Date()): string {
  return new Date(`${sgToday(now)}T00:00:00+08:00`).toISOString();
}

/**
 * Signed-in free users: count today's suggestions from mood_checkins.
 * RLS already lets a user read their own rows, so the normal client works.
 */
export async function countTodayForUser(supabase: SupabaseClient, userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("mood_checkins")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", sgStartOfToday());
  if (error) {
    // Fail open: a DB hiccup shouldn't block a free user's meal.
    console.error("countTodayForUser failed:", error);
    return 0;
  }
  return count ?? 0;
}

/**
 * Anonymous visitors: the count lives in a cookie as "YYYY-MM-DD:n".
 * A cookie from a previous day counts as 0. (Clearing cookies resets it —
 * acceptable for a soft limit; signing in moves them to the DB count.)
 */
export function readAnonCount(cookieValue: string | undefined): number {
  if (!cookieValue) return 0;
  const [day, n] = cookieValue.split(":");
  if (day !== sgToday()) return 0;
  const parsed = Number.parseInt(n ?? "0", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function anonCookieValue(count: number): string {
  return `${sgToday()}:${count}`;
}

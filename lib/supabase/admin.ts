import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS. Only for server code with no user
 * session to act on behalf of (e.g. the Stripe webhook), never exposed to
 * the browser.
 */
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

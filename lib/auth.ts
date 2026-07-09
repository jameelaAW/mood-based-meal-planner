import { createClient } from "@/lib/supabase/server";

/** Returns the current session's user id, or null if the visitor is anonymous. */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

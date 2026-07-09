"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoaded(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  if (!loaded) return <div className="h-5" />;

  return (
    <div className="flex items-center justify-end gap-4 font-mono text-xs uppercase tracking-wider text-paper-dim">
      {user ? (
        <>
          <a href="/history" className="hover:text-brand">
            History
          </a>
          <button onClick={handleSignOut} className="hover:text-brand">
            Sign out
          </button>
        </>
      ) : (
        <a href="/login" className="hover:text-brand">
          Sign in
        </a>
      )}
    </div>
  );
}

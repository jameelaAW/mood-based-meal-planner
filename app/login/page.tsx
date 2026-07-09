"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-paper">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">Mood-based meal planner</p>
          <h1 className="mt-3 font-display text-3xl italic">Sign in</h1>
          <p className="mt-2 text-sm text-paper-dim">
            Save your mood history and favourite meals. You don&rsquo;t need an account to use the app itself.
          </p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full rounded-lg border border-paper-dim/20 bg-ink-soft py-3 font-medium text-paper transition hover:border-brand/40"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-xs text-paper-dim">
          <span className="h-px flex-1 bg-paper-dim/15" /> or <span className="h-px flex-1 bg-paper-dim/15" />
        </div>

        {status === "sent" ? (
          <p className="rounded-lg border border-brand/30 bg-brand/10 px-4 py-4 text-center text-sm">
            Check <span className="font-medium">{email}</span> for a sign-in link.
          </p>
        ) : (
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-3 text-sm text-paper placeholder:text-paper-dim/60 focus:border-brand"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-brand py-3 font-medium text-ink transition hover:brightness-110 disabled:opacity-60"
            >
              {status === "sending" ? "Sending link…" : "Email me a sign-in link"}
            </button>
          </form>
        )}

        {status === "error" && errorMsg && (
          <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-200">
            {errorMsg}
          </p>
        )}

        <a href="/" className="block text-center font-mono text-xs uppercase tracking-wider text-paper-dim hover:text-brand">
          ← Back to the app
        </a>
      </div>
    </main>
  );
}

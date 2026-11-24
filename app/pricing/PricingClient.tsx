"use client";

import type { CatalogStats } from "@/lib/recipes";

import { useState } from "react";
import type { PlanTier } from "@/lib/moods";

const SUPPORT_URL = "https://payhip.com/MZDIgitalbuys/contact";

export default function PricingClient({
  currentTier,
  userEmail,
  payhipUrl,
  stats,
}: {
  currentTier: PlanTier;
  userEmail: string | null;
  payhipUrl: string | null;
  stats: CatalogStats;
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setErrorMsg(data.message ?? "Couldn't start checkout — please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setErrorMsg("Couldn't start checkout — please try again.");
      setLoading(false);
    }
  }

  const isPaid = currentTier === "paid";

  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-paper">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">Mood-based meal planner</p>
          <h1 className="mt-3 font-display text-4xl italic">Choose your plan</h1>
        </div>

        {errorMsg && (
          <p className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-200">
            {errorMsg}
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-paper-dim/15 bg-ink-soft p-6">
            <h2 className="font-display text-2xl italic">Free</h2>
            <p className="mt-1 text-2xl font-medium">SGD 0</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-paper-dim">
              <li>• 4 moods</li>
              <li>• {stats.free} recipes — {stats.freePerMood} per mood</li>
              <li>• 3 meal ideas per day</li>
              <li>• Weekly plan, cook from what you have & shopping lists</li>
            </ul>
            <a
              href={isPaid || userEmail ? "/" : "/login"}
              className="mt-6 rounded-lg border border-paper-dim/20 py-3 text-center text-sm font-medium hover:border-brand/40"
            >
              {isPaid ? "Use the app" : userEmail ? "Your plan" : "Sign in free"}
            </a>
          </div>

          <div className="flex flex-col rounded-2xl border border-brand/40 bg-ink-soft p-6">
            <h2 className="font-display text-2xl italic">Full Access</h2>
            <p className="mt-1 text-2xl font-medium">SGD 12 <span className="text-sm font-normal text-paper-dim">one-time</span></p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-paper-dim">
              <li>• All 6 moods</li>
              <li>
                • All {stats.total} recipes — {stats.perMood} per mood ({stats.total - stats.free} more than Free)
              </li>
              <li>• Unlimited meal ideas per day</li>
              <li>• Describe any mood in your own words</li>
              <li>• Yours forever — no subscription</li>
            </ul>
            {isPaid ? (
              <p className="mt-6 rounded-lg border border-brand/40 py-3 text-center text-sm font-medium text-brand">
                You own this ✓
              </p>
            ) : payhipUrl ? (
              <>
                <a
                  href={payhipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 rounded-lg bg-brand py-3 text-center text-sm font-medium text-ink transition hover:brightness-110"
                >
                  Get Full Access — SGD 12
                </a>
                <p className="mt-3 text-center text-xs text-paper-dim">
                  No sign-in needed to pay — checkout opens on Payhip.
                  {userEmail ? (
                    <>
                      {" "}Use <span className="text-paper">{userEmail}</span> at checkout and Full Access
                      unlocks here automatically.
                    </>
                  ) : (
                    <>
                      {" "}Afterwards,{" "}
                      <a href="/login" className="text-brand hover:underline">
                        sign in
                      </a>{" "}
                      with the email you paid with to unlock Full Access and save your mood history and
                      favourites.
                    </>
                  )}
                </p>
              </>
            ) : (
              <button
                onClick={handleBuy}
                disabled={loading}
                className="mt-6 rounded-lg bg-brand py-3 text-sm font-medium text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Redirecting…" : "Get Full Access — SGD 12"}
              </button>
            )}
          </div>
        </div>

        {payhipUrl && !isPaid && (
          <p className="mt-8 text-center text-xs text-paper-dim">
            Already paid?{" "}
            <a href="/login" className="text-brand hover:underline">
              Sign in
            </a>{" "}
            with the same email and refresh. Still locked?{" "}
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              Contact us
            </a>
            .
          </p>
        )}

        <a
          href="/"
          className="mt-10 block text-center font-mono text-xs uppercase tracking-wider text-paper-dim hover:text-brand"
        >
          ← Back to the app
        </a>
      </div>
    </main>
  );
}

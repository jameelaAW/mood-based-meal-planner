"use client";

import { useState } from "react";
import type { PlanTier } from "@/lib/moods";

export default function PricingClient({ currentTier }: { currentTier: PlanTier }) {
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
            <p className="mt-1 text-2xl font-medium">$0</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-paper-dim">
              <li>• 4 moods</li>
              <li>• 2 recipes per mood</li>
              <li>• Shopping list & check-off</li>
            </ul>
            <a
              href="/"
              className="mt-6 rounded-lg border border-paper-dim/20 py-3 text-center text-sm font-medium hover:border-brand/40"
            >
              {isPaid ? "Use the app" : "Your plan"}
            </a>
          </div>

          <div className="flex flex-col rounded-2xl border border-brand/40 bg-ink-soft p-6">
            <h2 className="font-display text-2xl italic">Full Access</h2>
            <p className="mt-1 text-2xl font-medium">$12 <span className="text-sm font-normal text-paper-dim">one-time</span></p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-paper-dim">
              <li>• All 6 moods</li>
              <li>• Full recipe catalog, incl. longer-prep recipes</li>
              <li>• Describe any mood in your own words</li>
              <li>• Yours forever — no subscription</li>
            </ul>
            {isPaid ? (
              <p className="mt-6 rounded-lg border border-brand/40 py-3 text-center text-sm font-medium text-brand">
                You own this ✓
              </p>
            ) : (
              <button
                onClick={handleBuy}
                disabled={loading}
                className="mt-6 rounded-lg bg-brand py-3 text-sm font-medium text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Redirecting…" : "Get Full Access — $12"}
              </button>
            )}
          </div>
        </div>

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

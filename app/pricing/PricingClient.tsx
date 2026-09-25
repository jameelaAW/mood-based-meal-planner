"use client";

import { useState } from "react";
import type { PlanTier } from "@/lib/moods";

const PLANS: {
  tier: PlanTier;
  name: string;
  price: string;
  features: string[];
}[] = [
  {
    tier: "free",
    name: "Free",
    price: "$0",
    features: ["4 moods", "2 recipes per mood", "Shopping list & check-off"],
  },
  {
    tier: "pro",
    name: "Pro",
    price: "$3/mo",
    features: ["All 6 moods", "Full recipe catalog", "Longer-prep recipes included"],
  },
  {
    tier: "pro_plus",
    name: "Plus",
    price: "$6/mo",
    features: ["Everything in Pro", "Describe any mood in your own words", "Quick-pick dropdown of extra feelings"],
  },
];

export default function PricingClient({ currentTier }: { currentTier: PlanTier }) {
  const [loadingPlan, setLoadingPlan] = useState<PlanTier | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubscribe(plan: "pro" | "pro_plus") {
    setLoadingPlan(plan);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setErrorMsg(data.message ?? "Couldn't start checkout — please try again.");
        setLoadingPlan(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setErrorMsg("Couldn't start checkout — please try again.");
      setLoadingPlan(null);
    }
  }

  async function handleManage() {
    setErrorMsg(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message ?? "Couldn't open billing portal.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setErrorMsg("Couldn't open billing portal.");
    }
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-paper">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">Mood-based meal planner</p>
          <h1 className="mt-3 font-display text-4xl italic">Choose your plan</h1>
        </div>

        {errorMsg && (
          <p className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-200">
            {errorMsg}
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = plan.tier === currentTier;
            return (
              <div
                key={plan.tier}
                className="flex flex-col rounded-2xl border border-paper-dim/15 bg-ink-soft p-6"
              >
                <h2 className="font-display text-2xl italic">{plan.name}</h2>
                <p className="mt-1 text-2xl font-medium">{plan.price}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-paper-dim">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>

                {plan.tier === "free" ? (
                  <a
                    href="/"
                    className="mt-6 rounded-lg border border-paper-dim/20 py-3 text-center text-sm font-medium hover:border-brand/40"
                  >
                    {isCurrent ? "Your plan" : "Use for free"}
                  </a>
                ) : isCurrent ? (
                  <button
                    onClick={handleManage}
                    className="mt-6 rounded-lg border border-brand/40 py-3 text-sm font-medium text-brand hover:bg-brand/10"
                  >
                    Manage subscription
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.tier as "pro" | "pro_plus")}
                    disabled={loadingPlan !== null}
                    className="mt-6 rounded-lg bg-brand py-3 text-sm font-medium text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loadingPlan === plan.tier ? "Redirecting…" : `Subscribe to ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
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

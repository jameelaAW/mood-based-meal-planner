import type { Metadata } from "next";
import PlanClient from "@/app/plan/PlanClient";
import { getCurrentUserId, getCurrentUserTier } from "@/lib/auth";
import SignInGate from "@/app/components/SignInGate";
import { lockedRecipesForTier, recipesForTier } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Weekly Plan · Mood-Based Meal Planner",
  description: "Plan a week of halal meals around how you expect to feel, then build one shopping list.",
};

export default async function PlanPage() {
  if (!(await getCurrentUserId())) {
    return (
      <SignInGate
        current="plan"
        eyebrow="Weekly plan"
        title="Plan your week by mood."
        blurb="Pick how you expect to feel each day, get a halal meal to match, then turn the whole week into one shopping list."
        samples={recipesForTier("free").filter((r) => ["sluggish-black-pepper-beef", "sad-tomato-egg-rice", "happy-ayam-penyet"].includes(r.id))}
      />
    );
  }
  const tier = await getCurrentUserTier();
  return <PlanClient tier={tier} recipes={recipesForTier(tier)} locked={lockedRecipesForTier(tier)} />;
}

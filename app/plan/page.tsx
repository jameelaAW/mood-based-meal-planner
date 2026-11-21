import type { Metadata } from "next";
import PlanClient from "@/app/plan/PlanClient";
import { getCurrentUserTier } from "@/lib/auth";
import { lockedRecipesForTier, recipesForTier } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Weekly Plan · Mood-Based Meal Planner",
  description: "Plan a week of halal meals around how you expect to feel, then build one shopping list.",
};

export default async function PlanPage() {
  const tier = await getCurrentUserTier();
  return <PlanClient tier={tier} recipes={recipesForTier(tier)} locked={lockedRecipesForTier(tier)} />;
}

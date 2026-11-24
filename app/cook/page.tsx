import type { Metadata } from "next";
import CookClient from "@/app/cook/CookClient";
import { getCurrentUserId, getCurrentUserTier } from "@/lib/auth";
import SignInGate from "@/app/components/SignInGate";
import { ALL_RECIPES, canAccessRecipe, recipesForTier } from "@/lib/recipes";
import { STAPLES } from "@/lib/recipe-utils";

export const metadata: Metadata = {
  title: "Cook From What You Have · Mood-Based Meal Planner",
  description: "Tell us what's in your kitchen and we'll find the halal recipes you can cook right now.",
};

export default async function CookPage() {
  if (!(await getCurrentUserId())) {
    return (
      <SignInGate
        current="cook"
        eyebrow="Cook from what you have"
        title="What’s in your kitchen?"
        blurb="Add the ingredients you already have and see which halal recipes you can cook now — and exactly what’s missing."
        samples={recipesForTier("free").filter((r) => ["stressed-fish-porridge", "sad-chicken-macaroni-soup", "happy-roti-john"].includes(r.id))}
      />
    );
  }
  const tier = await getCurrentUserTier();
  // For the upgrade prompt, free visitors get each locked recipe's title and
  // ingredient names only (to count matches) — never quantities or steps.
  const locked = ALL_RECIPES.filter((r) => !canAccessRecipe(r, tier)).map((r) => ({
    id: r.id,
    title: r.title,
    ingredientNames: r.ingredients.map((i) => i.name).filter((n) => !STAPLES.has(n)),
  }));
  return <CookClient tier={tier} recipes={recipesForTier(tier)} locked={locked} />;
}

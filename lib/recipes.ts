// SERVER-ONLY: imports the full recipe catalog. Import this from server
// components and API routes only — client components receive the recipes
// they're allowed to see as props (and share pure helpers via
// lib/recipe-utils.ts), so paid recipes never reach a free visitor's browser.
import recipesData from "@/data/recipes.json";
import { FREE_MOOD_LABELS, type PlanTier } from "@/lib/moods";
import type { LockedRecipe, Recipe } from "@/lib/recipe-utils";

export const ALL_RECIPES = recipesData as Recipe[];

/**
 * Free tier: the is_free recipes in the 4 free moods (2 per mood = 8).
 * Full Access: all 24 across all 6 moods.
 */
export function canAccessRecipe(recipe: Recipe, tier: PlanTier): boolean {
  if (tier === "paid") return true;
  return recipe.is_free && FREE_MOOD_LABELS.includes(recipe.mood);
}

export function recipesForTier(tier: PlanTier): Recipe[] {
  return ALL_RECIPES.filter((r) => canAccessRecipe(r, tier));
}

/** Title-only stubs for the upgrade prompts — no ingredients or steps. */
export function lockedRecipesForTier(tier: PlanTier): LockedRecipe[] {
  return ALL_RECIPES.filter((r) => !canAccessRecipe(r, tier)).map(({ id, mood, title }) => ({ id, mood, title }));
}

export function getRecipeById(id: string): Recipe | undefined {
  return ALL_RECIPES.find((r) => r.id === id);
}

export function recipesForMood(mood: string, tier: PlanTier): Recipe[] {
  return recipesForTier(tier).filter((r) => r.mood === mood);
}

/** How many recipes for this mood sit behind Full Access for this visitor (free: 2, paid: 0). */
export function lockedCountForMood(mood: string, tier: PlanTier): number {
  return ALL_RECIPES.filter((r) => r.mood === mood && !canAccessRecipe(r, tier)).length;
}

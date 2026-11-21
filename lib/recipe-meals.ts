// SERVER-ONLY. Bridges data/recipes.json (the one recipe catalog used by the
// homepage, /plan and /cook) to the existing `meals` table, so everything that
// already hangs off a meals row keeps working for catalog recipes: check-in
// history, saved meals (favourites) and the single-meal shopping list.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Recipe } from "@/lib/recipe-utils";
import type { Meal } from "@/lib/types";

/**
 * Returns the id of this recipe's row in `meals`, creating the row the first
 * time the recipe is suggested. No schema change: it is an ordinary meals row.
 * mood_tags is left empty on purpose — recipe selection reads recipes.json,
 * not the table, and an untagged row is never picked by the older DB-driven
 * suggestion code that may still be live on another deployment.
 * Returns null if the table can't be read or written; callers fall back to
 * the recipe's own id and the suggestion still works.
 */
export async function ensureMealRow(supabase: SupabaseClient, recipe: Recipe): Promise<string | null> {
  try {
    const { data: existing } = await supabase
      .from("meals")
      .select("id")
      .eq("title", recipe.title)
      .order("created_at", { ascending: true })
      .limit(1);
    if (existing && existing.length > 0) return existing[0].id as string;

    const { data: created, error } = await supabase
      .from("meals")
      .insert({
        title: recipe.title,
        description: recipe.description,
        mood_tags: [],
        ingredients: recipe.ingredients,
        instructions: recipe.steps.join(" "),
        image_url: null,
        prep_minutes: recipe.prep_minutes,
        calories: recipe.calories,
        protein_g: recipe.protein_g,
        why_it_fits: recipe.why_it_fits,
        why_it_fits_source: "recipes-json-v1",
        why_it_fits_confidence: 0.8,
        tier: recipe.is_free ? "free" : "pro",
      })
      .select("id")
      .single();
    if (error || !created) {
      console.error("ensureMealRow insert failed:", error);
      return null;
    }
    return created.id as string;
  } catch (err) {
    console.error("ensureMealRow failed:", err);
    return null;
  }
}

/** Shapes a catalog recipe like a `meals` row for the existing RecipeCard. */
export function recipeToMeal(recipe: Recipe, mealRowId: string | null): Meal {
  return {
    id: mealRowId ?? recipe.id,
    recipe_id: recipe.id,
    user_id: null,
    created_at: new Date().toISOString(),
    title: recipe.title,
    description: recipe.description,
    mood_tags: [recipe.mood],
    ingredients: recipe.ingredients,
    instructions: recipe.steps.join(" "),
    steps: recipe.steps,
    image_url: null,
    prep_minutes: recipe.prep_minutes,
    calories: recipe.calories,
    protein_g: recipe.protein_g,
    carbs_g: null,
    fat_g: null,
    why_it_fits: recipe.why_it_fits,
    why_it_fits_source: "recipes-json-v1",
    why_it_fits_confidence: 0.8,
    why_it_fits_review_status: null,
    tier: recipe.is_free ? "free" : "pro",
  };
}

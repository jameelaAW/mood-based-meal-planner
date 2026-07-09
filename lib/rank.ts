import { ADJACENT_TAGS } from "@/lib/moods";
import type { Meal } from "@/lib/types";

/**
 * rank_meals(mood_label) — scores candidate meals for a mood check-in.
 *
 * Scoring rule (docs/INTELLIGENCE_LAYER.md):
 *  1. Filter meals whose mood_tags contains the selected mood_label.
 *  2. exact tag match = +2, adjacent mood tag present = +1, prep_minutes < 20 = +1.
 *  3. Return highest-scoring meal first.
 */
export function rankMeals(meals: Meal[], moodLabel: string): Meal[] {
  const adjacent = ADJACENT_TAGS[moodLabel] ?? [];

  const candidates = meals.filter((m) => m.mood_tags?.includes(moodLabel));
  const pool = candidates.length > 0 ? candidates : meals;

  const scored = pool.map((meal) => {
    let score = 0;
    if (meal.mood_tags?.includes(moodLabel)) score += 2;
    if (meal.mood_tags?.some((t) => adjacent.includes(t))) score += 1;
    if (typeof meal.prep_minutes === "number" && meal.prep_minutes < 20) score += 1;
    return { meal, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.meal);
}

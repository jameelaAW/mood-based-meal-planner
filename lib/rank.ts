import { ADJACENT_TAGS } from "@/lib/moods";
import type { Meal } from "@/lib/types";

export interface ScoredMeal {
  meal: Meal;
  score: number;
}

/**
 * score_meals(mood_label) — scores candidate meals for a mood check-in.
 *
 * Scoring rule (docs/INTELLIGENCE_LAYER.md):
 *  1. Filter meals whose mood_tags contains the selected mood_label.
 *  2. exact tag match = +2, adjacent mood tag present = +1, prep_minutes < 20 = +1.
 *  3. Return highest-scoring meals first.
 */
export function scoreMeals(meals: Meal[], moodLabel: string): ScoredMeal[] {
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
  return scored;
}

/**
 * rank_meals(mood_label) — same scoring rule, meal list only (highest first).
 * Kept for callers that just want the ordering, not the raw scores.
 */
export function rankMeals(meals: Meal[], moodLabel: string): Meal[] {
  return scoreMeals(meals, moodLabel).map((s) => s.meal);
}

/**
 * Picks a meal for this check-in: scores candidates, then picks randomly
 * with probability proportional to score (weighted random). A meal with a
 * stronger match is more likely to come up, but with several seeded meals
 * per mood (docs/DATA_MODEL.md seed set) the same mood won't always return
 * the same recipe — picking strictly by top score would make one meal with
 * a unique tie-breaker bonus (e.g. a faster prep time) win every time.
 */
export function pickMeal(meals: Meal[], moodLabel: string): Meal | undefined {
  const scored = scoreMeals(meals, moodLabel);
  if (scored.length === 0) return undefined;

  const total = scored.reduce((sum, s) => sum + Math.max(s.score, 0), 0);
  if (total <= 0) return scored[Math.floor(Math.random() * scored.length)].meal;

  let r = Math.random() * total;
  for (const s of scored) {
    r -= Math.max(s.score, 0);
    if (r <= 0) return s.meal;
  }
  return scored[scored.length - 1].meal;
}


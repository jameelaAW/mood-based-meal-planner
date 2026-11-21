"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthNav from "@/app/components/AuthNav";
import FeatureNav from "@/app/components/FeatureNav";
import RecipeDetails from "@/app/components/RecipeDetails";
import { MOOD_OPTIONS, moodAccent, type PlanTier } from "@/lib/moods";
import {
  DAY_KEYS,
  DAY_NAMES,
  PANTRY_STORAGE_KEY,
  WEEK_PLAN_STORAGE_KEY,
  commonIngredients,
  matchRecipes,
  normalizeIngredient,
  pantryHas,
  parseWeekPlan,
  type Recipe,
} from "@/lib/recipe-utils";

interface LockedMatchSource {
  id: string;
  title: string;
  ingredientNames: string[];
}

export default function CookClient({
  tier,
  recipes,
  locked,
}: {
  tier: PlanTier;
  recipes: Recipe[];
  locked: LockedMatchSource[];
}) {
  const [pantry, setPantry] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(PANTRY_STORAGE_KEY) ?? "[]");
      if (Array.isArray(stored)) setPantry(stored.filter((x): x is string => typeof x === "string").slice(0, 60));
    } catch {
      /* nothing stored yet */
    }
  }, []);

  function savePantry(next: string[]) {
    setPantry(next);
    try {
      window.localStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function addItems(text: string) {
    const incoming = text
      .split(/[,\n]/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 1 && s.length <= 40);
    if (incoming.length === 0) return;
    const next = [...pantry];
    for (const item of incoming) {
      if (!next.some((p) => normalizeIngredient(p) === normalizeIngredient(item))) next.push(item);
    }
    savePantry(next.slice(0, 60));
    setDraft("");
  }

  function removeItem(item: string) {
    savePantry(pantry.filter((p) => p !== item));
  }

  const suggestions = useMemo(
    () => commonIngredients(recipes).filter((name) => !pantry.some((p) => pantryHas(p, name))),
    [recipes, pantry],
  );
  const matches = useMemo(() => matchRecipes(recipes, pantry), [recipes, pantry]);
  const lockedMatches = useMemo(
    () =>
      pantry.length === 0
        ? []
        : locked.filter((l) => {
            const have = l.ingredientNames.filter((n) => pantry.some((p) => pantryHas(p, n))).length;
            return l.ingredientNames.length > 0 && have / l.ingredientNames.length >= 0.5;
          }),
    [locked, pantry],
  );

  /** Drops the recipe onto the first free day of this week's plan. */
  function addToPlan(recipe: Recipe) {
    try {
      const plan = parseWeekPlan(
        window.localStorage.getItem(WEEK_PLAN_STORAGE_KEY),
        new Set(recipes.map((r) => r.id)),
      );
      const day = DAY_KEYS.find((k) => !plan.days[k]);
      if (!day) {
        setNotice((n) => ({ ...n, [recipe.id]: "Your week is full — remove a day in the weekly plan first." }));
        return;
      }
      plan.days[day] = { mood: recipe.mood, recipeId: recipe.id };
      window.localStorage.setItem(WEEK_PLAN_STORAGE_KEY, JSON.stringify(plan));
      setNotice((n) => ({ ...n, [recipe.id]: `Added to ${DAY_NAMES[day]}.` }));
    } catch {
      setNotice((n) => ({ ...n, [recipe.id]: "Couldn't save that on this device." }));
    }
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-lg">
        <div className="mb-4">
          <AuthNav />
        </div>
        <header className="mb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">Cook from what you have</p>
          <h1 className="mt-3 font-display text-4xl italic leading-tight">
            What&rsquo;s in your kitchen?
          </h1>
          <p className="mt-3 text-sm text-paper-dim">
            Add the ingredients you already have. We&rsquo;ll show the halal recipes you&rsquo;re closest to cooking,
            and exactly what&rsquo;s missing.
          </p>
        </header>

        <div className="mb-8">
          <FeatureNav current="cook" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addItems(draft);
          }}
          className="flex gap-2"
        >
          <label htmlFor="pantry-input" className="sr-only">
            Add ingredients you have
          </label>
          <input
            id="pantry-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. chicken, eggs, rice, tomato"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-3 text-sm text-paper placeholder:text-paper-dim/60 focus:border-brand"
          />
          <button
            type="submit"
            disabled={draft.trim().length < 2}
            className="rounded-lg bg-brand px-5 py-3 text-sm font-medium text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add
          </button>
        </form>
        <p className="mt-2 text-xs text-paper-dim/70">
          Separate several with commas. We assume you have oil, salt, sugar and pepper.
        </p>

        {pantry.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-wider text-paper-dim">
                In your kitchen · {pantry.length}
              </h2>
              <button onClick={() => savePantry([])} className="text-xs text-paper-dim hover:text-paper">
                Clear all
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {pantry.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => removeItem(item)}
                    aria-label={`Remove ${item}`}
                    className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs text-paper transition hover:bg-brand/20"
                  >
                    {item} <span aria-hidden className="ml-1 text-paper-dim">×</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 font-mono text-xs uppercase tracking-wider text-paper-dim">Quick add</h2>
            <ul className="flex flex-wrap gap-2">
              {suggestions.slice(0, 14).map((name) => (
                <li key={name}>
                  <button
                    onClick={() => addItems(name)}
                    className="rounded-full border border-paper-dim/20 px-3 py-1.5 text-xs text-paper-dim transition hover:border-brand/40 hover:text-paper"
                  >
                    + {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className="mt-8" aria-live="polite">
          {pantry.length === 0 ? (
            <p className="rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-6 text-center text-sm text-paper-dim">
              Add a few ingredients to see what you can cook.
            </p>
          ) : matches.length === 0 ? (
            <p className="rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-6 text-center text-sm text-paper-dim">
              No recipes use those yet — try adding a protein, a grain or a vegetable.
            </p>
          ) : (
            <>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-paper-dim">
                {matches.length} recipe{matches.length === 1 ? "" : "s"} you can work towards
              </h2>
              <ul className="space-y-3">
                {matches.map(({ recipe, have, missing, ratio }) => {
                  const mood = MOOD_OPTIONS.find((m) => m.label === recipe.mood);
                  const isOpen = openId === recipe.id;
                  const total = have.length + missing.length;
                  return (
                    <li key={recipe.id} className="rounded-2xl border border-paper-dim/15 bg-ink-soft p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-paper">{recipe.title}</h3>
                          <p className="mt-0.5 font-mono text-xs text-paper-dim">
                            {mood ? `${mood.emoji} ${mood.name} · ` : ""}
                            {recipe.calories} cal · {recipe.protein_g}g protein · {recipe.prep_minutes} min
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-xs ${
                            missing.length === 0 ? "bg-brand text-ink" : "border border-paper-dim/25 text-paper-dim"
                          }`}
                        >
                          {missing.length === 0 ? "Ready to cook" : `${have.length} of ${total}`}
                        </span>
                      </div>

                      <div
                        className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-dim/15"
                        role="img"
                        aria-label={`You have ${have.length} of ${total} ingredients`}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.round(ratio * 100)}%`, background: `var(${moodAccent(recipe.mood)})` }}
                        />
                      </div>

                      <p className="mt-3 text-sm text-paper-dim">
                        {missing.length === 0 ? (
                          "You have everything for this one."
                        ) : (
                          <>
                            <span className="text-paper">Still need:</span> {missing.join(", ")}
                          </>
                        )}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <button
                          onClick={() => setOpenId(isOpen ? null : recipe.id)}
                          aria-expanded={isOpen}
                          className="text-brand hover:underline"
                        >
                          {isOpen ? "Hide recipe" : "View recipe"}
                        </button>
                        <button onClick={() => addToPlan(recipe)} className="text-brand hover:underline">
                          Add to weekly plan
                        </button>
                        {notice[recipe.id] && (
                          <span className="text-paper-dim" role="status">
                            {notice[recipe.id]}{" "}
                            <Link href="/plan" className="text-brand hover:underline">
                              Open plan
                            </Link>
                          </span>
                        )}
                      </div>

                      {isOpen && (
                        <div className="mt-4">
                          <RecipeDetails recipe={recipe} missing={missing} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {tier === "free" && pantry.length > 0 && lockedMatches.length > 0 && (
            <p className="mt-4 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3 text-center text-xs text-paper-dim">
              {lockedMatches.length} more recipe{lockedMatches.length === 1 ? "" : "s"} you&rsquo;re at least halfway
              to cooking, including {lockedMatches[0].title} —{" "}
              <Link href="/pricing" className="font-medium text-brand hover:underline">
                get Full Access to unlock
              </Link>
              .
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

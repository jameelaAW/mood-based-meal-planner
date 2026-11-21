"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthNav from "@/app/components/AuthNav";
import FeatureNav from "@/app/components/FeatureNav";
import RecipeDetails from "@/app/components/RecipeDetails";
import { MOOD_OPTIONS, moodAccent, moodOptionsForTier, type PlanTier } from "@/lib/moods";
import {
  DAY_KEYS,
  DAY_NAMES,
  WEEK_PLAN_STORAGE_KEY,
  emptyWeekPlan,
  mondayOf,
  parseWeekPlan,
  pickRecipeForMood,
  planSignature,
  plannedRecipeIds,
  type DayKey,
  type LockedRecipe,
  type Recipe,
  type WeekPlan,
} from "@/lib/recipe-utils";

export default function PlanClient({
  tier,
  recipes,
  locked,
}: {
  tier: PlanTier;
  recipes: Recipe[];
  locked: LockedRecipe[];
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<WeekPlan>(() => emptyWeekPlan());
  const [loaded, setLoaded] = useState(false);
  const [openDay, setOpenDay] = useState<DayKey | null>(null);
  const [building, setBuilding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const moods = moodOptionsForTier(tier);
  const byId = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);

  // The plan lives in this browser (localStorage) so it works without an
  // account, exactly like the anonymous mood check-in.
  useEffect(() => {
    try {
      setPlan(parseWeekPlan(window.localStorage.getItem(WEEK_PLAN_STORAGE_KEY), new Set(recipes.map((r) => r.id))));
    } catch {
      /* storage unavailable (private mode) — plan just won't persist */
    }
    setLoaded(true);
  }, [recipes]);

  function update(next: WeekPlan) {
    setPlan(next);
    setErrorMsg(null);
    try {
      window.localStorage.setItem(WEEK_PLAN_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function setDayMood(day: DayKey, mood: string) {
    const current = plan.days[day];
    const usedElsewhere = DAY_KEYS.filter((k) => k !== day)
      .map((k) => plan.days[k]?.recipeId)
      .filter((id): id is string => Boolean(id));
    // Tapping the same mood again swaps to a different recipe for it.
    const recipe = pickRecipeForMood(recipes, mood, usedElsewhere, current?.mood === mood ? current.recipeId : undefined);
    if (!recipe) return;
    update({ ...plan, days: { ...plan.days, [day]: { mood, recipeId: recipe.id } } });
  }

  function clearDay(day: DayKey) {
    const days = { ...plan.days };
    delete days[day];
    if (openDay === day) setOpenDay(null);
    update({ ...plan, days });
  }

  function fillWeek() {
    const days = { ...plan.days };
    const used = plannedRecipeIds(plan);
    DAY_KEYS.forEach((day, i) => {
      if (days[day]) return;
      // Rotate through the moods so the week covers a spread of them.
      const mood = moods[i % moods.length].label;
      const recipe = pickRecipeForMood(recipes, mood, used);
      if (recipe) {
        days[day] = { mood, recipeId: recipe.id };
        used.push(recipe.id);
      }
    });
    update({ ...plan, days });
  }

  function clearWeek() {
    setOpenDay(null);
    update(emptyWeekPlan());
  }

  const plannedIds = plannedRecipeIds(plan);
  const planned = plannedIds.map((id) => byId.get(id)).filter((r): r is Recipe => Boolean(r));
  const signature = planSignature(plan);
  const existingListId = plan.list && plan.list.signature === signature ? plan.list.id : null;
  const avgCalories = planned.length ? Math.round(planned.reduce((s, r) => s + r.calories, 0) / planned.length) : 0;
  const avgProtein = planned.length ? Math.round(planned.reduce((s, r) => s + r.protein_g, 0) / planned.length) : 0;

  async function buildShoppingList() {
    if (plannedIds.length === 0) return;
    setBuilding(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/weekly-shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe_ids: plannedIds }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message ?? "Couldn't build your list — please try again.");
        setBuilding(false);
        return;
      }
      update({ ...plan, list: { id: data.shopping_list_id, signature } });
      router.push(`/list/${data.shopping_list_id}`);
    } catch {
      setErrorMsg("Couldn't build your list — please try again.");
      setBuilding(false);
    }
  }

  const monday = mondayOf();
  const today = new Date();
  const weekLabel = monday.toLocaleDateString("en-SG", { day: "numeric", month: "short" });

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-lg">
        <div className="mb-4">
          <AuthNav />
        </div>
        <header className="mb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">Week of {weekLabel}</p>
          <h1 className="mt-3 font-display text-4xl italic leading-tight">Plan your week by mood.</h1>
          <p className="mt-3 text-sm text-paper-dim">
            Pick how you expect to feel each day. We&rsquo;ll line up a halal meal to match, then turn the whole
            week into one shopping list.
          </p>
        </header>

        <div className="mb-8">
          <FeatureNav current="plan" />
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-paper-dim">
            {planned.length} / 7 days planned
          </span>
          <div className="flex gap-2">
            {planned.length < 7 && (
              <button
                onClick={fillWeek}
                disabled={!loaded}
                className="rounded-full border border-brand/40 px-3 py-1.5 text-xs text-paper transition hover:bg-brand/10 disabled:opacity-40"
              >
                Fill empty days for me
              </button>
            )}
            {planned.length > 0 && (
              <button
                onClick={clearWeek}
                className="rounded-full border border-paper-dim/20 px-3 py-1.5 text-xs text-paper-dim transition hover:border-paper-dim/40"
              >
                Clear week
              </button>
            )}
          </div>
        </div>

        <ol className="space-y-3">
          {DAY_KEYS.map((day, i) => {
            const entry = plan.days[day];
            const recipe = entry ? byId.get(entry.recipeId) : undefined;
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const isToday = date.toDateString() === today.toDateString();
            const accent = entry ? moodAccent(entry.mood) : "--color-brand";
            const moreForMood = entry ? recipes.filter((r) => r.mood === entry.mood).length > 1 : false;
            const lockedForMood = entry ? locked.filter((l) => l.mood === entry.mood).length : 0;
            const isOpen = openDay === day;

            return (
              <li
                key={day}
                className="rounded-2xl border bg-ink-soft p-4"
                style={{
                  borderColor: recipe ? `color-mix(in srgb, var(${accent}) 45%, transparent)` : "rgba(207,200,186,0.15)",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-lg italic">
                    {DAY_NAMES[day]}
                    {isToday && (
                      <span className="ml-2 rounded-full bg-brand/15 px-2 py-0.5 font-mono text-[10px] not-italic uppercase tracking-wider text-brand">
                        Today
                      </span>
                    )}
                  </h2>
                  <span className="font-mono text-xs text-paper-dim">
                    {date.toLocaleDateString("en-SG", { day: "numeric", month: "short" })}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Mood for ${DAY_NAMES[day]}`}>
                  {moods.map((mood) => {
                    const selected = entry?.mood === mood.label;
                    return (
                      <button
                        key={mood.label}
                        onClick={() => setDayMood(day, mood.label)}
                        disabled={!loaded}
                        aria-pressed={selected}
                        className="rounded-full border px-3 py-1.5 text-xs transition disabled:opacity-40"
                        style={{
                          borderColor: selected ? `var(${mood.accentVar})` : "rgba(207,200,186,0.2)",
                          background: selected ? `color-mix(in srgb, var(${mood.accentVar}) 22%, transparent)` : "transparent",
                        }}
                      >
                        <span aria-hidden>{mood.emoji}</span> {mood.name}
                      </button>
                    );
                  })}
                </div>

                {recipe && entry ? (
                  <div className="mt-4">
                    <p className="font-medium text-paper">{recipe.title}</p>
                    <p className="mt-0.5 text-sm text-paper-dim">{recipe.description}</p>
                    <p className="mt-2 font-mono text-xs text-paper-dim">
                      {recipe.calories} cal · {recipe.protein_g}g protein · {recipe.prep_minutes} min · {recipe.cuisine}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <button
                        onClick={() => setOpenDay(isOpen ? null : day)}
                        aria-expanded={isOpen}
                        className="text-brand hover:underline"
                      >
                        {isOpen ? "Hide recipe" : "View recipe"}
                      </button>
                      {moreForMood && (
                        <button onClick={() => setDayMood(day, entry.mood)} className="text-brand hover:underline">
                          Swap meal
                        </button>
                      )}
                      <button onClick={() => clearDay(day)} className="text-paper-dim hover:text-paper">
                        Remove
                      </button>
                    </div>
                    {lockedForMood > 0 && (
                      <p className="mt-2 text-xs text-paper-dim">
                        {lockedForMood} more {entry.mood} recipe{lockedForMood === 1 ? "" : "s"} with{" "}
                        <Link href="/pricing" className="text-brand hover:underline">
                          Full Access
                        </Link>
                        .
                      </p>
                    )}
                    {isOpen && (
                      <div className="mt-4">
                        <RecipeDetails recipe={recipe} />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-paper-dim/70">Pick a mood to get a meal for this day.</p>
                )}
              </li>
            );
          })}
        </ol>

        {tier === "free" && (
          <p className="mt-4 text-center text-xs text-paper-dim">
            You&rsquo;re planning with {recipes.length} free recipes across {moods.length} moods.{" "}
            <Link href="/pricing" className="text-brand hover:underline">
              Full Access (SGD 12 one-time)
            </Link>{" "}
            adds {locked.length} more recipes and {MOOD_OPTIONS.length - moods.length} more moods.
          </p>
        )}

        <section className="mt-8 rounded-2xl border border-paper-dim/15 bg-ink-soft p-5" aria-label="Weekly shopping list">
          <h2 className="font-display text-xl italic">Weekly shopping list</h2>
          {planned.length > 0 ? (
            <>
              <p className="mt-1 text-sm text-paper-dim">
                {planned.length} meal{planned.length === 1 ? "" : "s"} · about {avgCalories} cal and {avgProtein}g
                protein per meal. Shared ingredients are combined into one line.
              </p>
              {existingListId ? (
                <Link
                  href={`/list/${existingListId}`}
                  className="mt-4 block w-full rounded-lg bg-brand py-3 text-center font-medium text-ink transition hover:brightness-110"
                >
                  Open this week&rsquo;s shopping list
                </Link>
              ) : (
                <button
                  onClick={buildShoppingList}
                  disabled={building}
                  className="mt-4 w-full rounded-lg bg-brand py-3 font-medium text-ink transition hover:brightness-110 disabled:opacity-60"
                >
                  {building
                    ? "Building your list…"
                    : plan.list
                      ? "Rebuild shopping list for the updated week"
                      : "Build my weekly shopping list"}
                </button>
              )}
            </>
          ) : (
            <p className="mt-1 text-sm text-paper-dim">
              Plan at least one day and your combined shopping list will be ready to build here.
            </p>
          )}
          {errorMsg && (
            <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-200">
              {errorMsg}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

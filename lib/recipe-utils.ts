// Pure helpers shared by the Weekly Plan, Cook From What You Have, and Weekly
// Shopping List features. No data import here on purpose — this file is safe
// to bundle into client components. The recipe data itself (data/recipes.json)
// is only imported server-side, in lib/recipes.ts, so locked recipes never
// ship to a free visitor's browser.
import type { Ingredient } from "@/lib/types";

export interface Recipe {
  id: string;
  mood: string;
  title: string;
  description: string;
  why_it_fits: string;
  /** Verified photo of this dish (Wikimedia Commons or Unsplash). */
  image_url: string | null;
  /** Photo credit shown under the image, e.g. "Name / Wikimedia Commons, CC BY-SA 4.0". */
  image_credit: string | null;
  image_credit_url: string | null;
  cuisine: string;
  halal: boolean;
  is_free: boolean;
  servings: number;
  prep_minutes: number;
  calories: number;
  protein_g: number;
  /** Only on recipes from the original catalog. */
  carbs_g?: number | null;
  fat_g?: number | null;
  ingredients: Ingredient[];
  steps: string[];
  /** "original-catalog" for meals brought back from the first version of the app. */
  source?: string;
}

/** What a free visitor is allowed to know about a recipe they can't open. */
export interface LockedRecipe {
  id: string;
  mood: string;
  title: string;
}

// ---------------------------------------------------------------------------
// Weekly plan (stored in the browser — see app/plan/PlanClient.tsx)
// ---------------------------------------------------------------------------

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];
export const DAY_NAMES: Record<DayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/** Free accounts plan Monday–Wednesday; Full Access plans the whole week. */
export const FREE_PLAN_DAYS = 3;

export function plannableDays(tier: "free" | "paid"): DayKey[] {
  return tier === "paid" ? [...DAY_KEYS] : DAY_KEYS.slice(0, FREE_PLAN_DAYS);
}

/** Drops days this visitor can't plan (e.g. a plan made before a refund, or edited storage). */
export function restrictPlanToDays(plan: WeekPlan, days: DayKey[]): WeekPlan {
  const kept: WeekPlan["days"] = {};
  for (const d of days) if (plan.days[d]) kept[d] = plan.days[d];
  return { ...plan, days: kept };
}

export interface PlanEntry {
  mood: string;
  recipeId: string;
}

export interface WeekPlan {
  /** Monday of the planned week, "YYYY-MM-DD" in the visitor's local time. */
  weekKey: string;
  days: Partial<Record<DayKey, PlanEntry>>;
  /** Shopping list already built for this exact set of meals (avoids duplicates). */
  list?: { id: string; signature: string };
}

export const WEEK_PLAN_STORAGE_KEY = "mmp_week_plan_v1";
export const PANTRY_STORAGE_KEY = "mmp_pantry_v1";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Monday of the week containing `date`, at local midnight. */
export function mondayOf(date: Date = new Date()): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

export function weekKeyOf(date: Date = new Date()): string {
  const m = mondayOf(date);
  return `${m.getFullYear()}-${pad(m.getMonth() + 1)}-${pad(m.getDate())}`;
}

export function emptyWeekPlan(date: Date = new Date()): WeekPlan {
  return { weekKey: weekKeyOf(date), days: {} };
}

/**
 * Reads a stored plan defensively: a plan from a previous week, or one that
 * references recipes this visitor can no longer open, is trimmed rather than
 * trusted. Returns a fresh empty plan if nothing usable is stored.
 */
export function parseWeekPlan(raw: string | null, validRecipeIds: Set<string>, now: Date = new Date()): WeekPlan {
  const fresh = emptyWeekPlan(now);
  if (!raw) return fresh;
  try {
    const stored = JSON.parse(raw) as WeekPlan;
    if (!stored || stored.weekKey !== fresh.weekKey || typeof stored.days !== "object") return fresh;
    const days: WeekPlan["days"] = {};
    for (const key of DAY_KEYS) {
      const entry = stored.days[key];
      if (entry && typeof entry.recipeId === "string" && validRecipeIds.has(entry.recipeId)) {
        days[key] = { mood: String(entry.mood), recipeId: entry.recipeId };
      }
    }
    const list =
      stored.list && typeof stored.list.id === "string" && typeof stored.list.signature === "string"
        ? stored.list
        : undefined;
    return { weekKey: fresh.weekKey, days, list };
  } catch {
    return fresh;
  }
}

export function plannedRecipeIds(plan: WeekPlan): string[] {
  return DAY_KEYS.map((k) => plan.days[k]?.recipeId).filter((id): id is string => Boolean(id));
}

/** Identifies a set of planned meals regardless of which day each is on. */
export function planSignature(plan: WeekPlan): string {
  return [...plannedRecipeIds(plan)].sort().join(",");
}

/**
 * Picks a recipe for a mood, preferring ones not already used this week so a
 * 7-day plan has as much variety as the visitor's catalog allows.
 */
export function pickRecipeForMood(recipes: Recipe[], mood: string, usedIds: string[], excludeId?: string): Recipe | undefined {
  const pool = recipes.filter((r) => r.mood === mood && r.id !== excludeId);
  if (pool.length === 0) return recipes.find((r) => r.mood === mood);
  const useCount = (id: string) => usedIds.filter((u) => u === id).length;
  const least = Math.min(...pool.map((r) => useCount(r.id)));
  const candidates = pool.filter((r) => useCount(r.id) === least);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ---------------------------------------------------------------------------
// Cook From What You Have — pantry matching
// ---------------------------------------------------------------------------

/** Basics every kitchen is assumed to have; never counted as "missing". */
export const STAPLES = new Set(["cooking oil", "sugar", "white pepper", "black pepper", "salt", "water"]);

/** Generic words people type → the specific ingredient names used in recipes. */
const ALIASES: Record<string, string[]> = {
  chicken: ["chicken thigh", "chicken breast", "minced chicken"],
  fish: ["white fish fillet", "mackerel", "salmon fillet"],
  salmon: ["salmon fillet"],
  beef: ["beef sirloin", "beef mince"],
  rice: ["jasmine rice", "cooked rice", "brown rice"],
  tofu: ["firm tofu", "silken tofu"],
  noodle: ["yellow noodles", "rice vermicelli", "soba noodles", "sweet potato glass noodles"],
  "bee hoon": ["rice vermicelli"],
  beehoon: ["rice vermicelli"],
  vermicelli: ["rice vermicelli"],
  "glass noodle": ["sweet potato glass noodles"],
  soba: ["soba noodles"],
  chilli: ["red chilli", "green chilli"],
  chili: ["red chilli", "green chilli"],
  spinach: ["baby spinach"],
  mushroom: ["shiitake mushrooms"],
  miso: ["miso paste"],
  oil: ["cooking oil"],
  peanut: ["roasted peanuts"],
  anchovy: ["dried anchovies"],
  "ikan bilis": ["dried anchovies"],
  "soy sauce": ["light soy sauce"],
  "kicap": ["light soy sauce"],
  prawn: ["prawns"],
  shrimp: ["prawns"],
  sotong: ["squid"],
  "ladies finger": ["okra"],
  bendi: ["okra"],
  brinjal: ["eggplant"],
  aubergine: ["eggplant"],
  "bell pepper": ["capsicum"],
  "bean sprout": ["beansprouts"],
  taugeh: ["beansprouts"],
  scallion: ["spring onion"],
  "green onion": ["spring onion"],
  "cai xin": ["chye sim"],
  "choy sum": ["chye sim"],
  dal: ["yellow lentils"],
  dhal: ["yellow lentils"],
  lentil: ["yellow lentils"],
  pasta: ["macaroni"],
  bread: ["baguette"],
  turmeric: ["turmeric powder"],
  kunyit: ["turmeric powder"],
  serai: ["lemongrass"],
  basil: ["thai basil"],
  mint: ["mint leaves"],
  tamarind: ["tamarind paste"],
  assam: ["tamarind paste"],
  ketchup: ["tomato ketchup"],
  sambal: ["sambal belacan", "chilli paste"],
  stock: ["chicken stock", "beef stock"],
};

function singular(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith("oes")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** Lowercases, drops "(notes)" and punctuation, and singularises each word. */
export function normalizeIngredient(text: string): string {
  return text
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z\s-]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(singular)
    .join(" ");
}

/**
 * True if something the visitor typed covers a recipe ingredient.
 * "chicken" covers chicken thigh but not chicken stock; "tomato" does not
 * cover tomato ketchup; "soy sauce" covers light soy sauce.
 */
export function pantryHas(pantryTerm: string, ingredientName: string): boolean {
  const term = normalizeIngredient(pantryTerm);
  const ing = normalizeIngredient(ingredientName);
  if (!term || !ing) return false;
  if (term === ing) return true;

  const aliasTargets = ALIASES[term];
  if (aliasTargets) return aliasTargets.some((t) => normalizeIngredient(t) === ing);

  const termWords = term.split(" ");
  const ingWords = ing.split(" ");
  // Typed something more specific than the recipe asks for ("fresh ginger").
  if (ingWords.every((w) => termWords.includes(w))) return true;
  // Typed the tail of the ingredient name, including its head noun
  // ("thigh" / "soy sauce") — but not just a leading qualifier.
  const headNoun = ingWords[ingWords.length - 1];
  return term.length >= 3 && termWords.includes(headNoun) && termWords.every((w) => ingWords.includes(w));
}

export interface PantryMatch {
  recipe: Recipe;
  have: string[];
  missing: string[];
  /** Share of the non-staple ingredients already on hand, 0–1. */
  ratio: number;
}

export function matchRecipe(recipe: Recipe, pantry: string[]): PantryMatch {
  const needed = recipe.ingredients.map((i) => i.name).filter((n) => !STAPLES.has(n));
  const have = needed.filter((name) => pantry.some((p) => pantryHas(p, name)));
  const missing = needed.filter((name) => !have.includes(name));
  return { recipe, have, missing, ratio: needed.length === 0 ? 0 : have.length / needed.length };
}

/** Recipes that use at least one pantry item, best match first. */
export function matchRecipes(recipes: Recipe[], pantry: string[]): PantryMatch[] {
  if (pantry.length === 0) return [];
  return recipes
    .map((r) => matchRecipe(r, pantry))
    .filter((m) => m.have.length > 0)
    .sort((a, b) => b.ratio - a.ratio || a.missing.length - b.missing.length || a.recipe.prep_minutes - b.recipe.prep_minutes);
}

/** Most-used non-staple ingredients across a set of recipes — for quick-add chips. */
export function commonIngredients(recipes: Recipe[], limit = 18): string[] {
  const counts = new Map<string, number>();
  for (const r of recipes) {
    for (const i of r.ingredients) {
      if (!STAPLES.has(i.name)) counts.set(i.name, (counts.get(i.name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name]) => name);
}

// ---------------------------------------------------------------------------
// Weekly Shopping List — combining ingredients across the week's recipes
// ---------------------------------------------------------------------------

const UNIT_SINGULAR: Record<string, string> = {
  cloves: "clove",
  stalks: "stalk",
  cups: "cup",
  thumbs: "thumb",
  sprigs: "sprig",
  bunches: "bunch",
  heads: "head",
  pinches: "pinch",
  litres: "litre",
};
const UNIT_PLURAL: Record<string, string> = Object.fromEntries(Object.entries(UNIT_SINGULAR).map(([p, s]) => [s, p]));

function parseQty(qty: string): { amount: number; unit: string } | null {
  const m = qty.trim().match(/^(\d+\/\d+|\d+(?:\.\d+)?)\s*(.*)$/);
  if (!m) return null;
  const amount = m[1].includes("/") ? Number(m[1].split("/")[0]) / Number(m[1].split("/")[1]) : Number(m[1]);
  if (!Number.isFinite(amount)) return null;
  let unit = m[2].trim().toLowerCase();
  unit = UNIT_SINGULAR[unit] ?? unit;
  if (unit === "litre") return { amount: amount * 1000, unit: "ml" };
  if (unit === "kg") return { amount: amount * 1000, unit: "g" };
  if (unit === "tbsp") return { amount: amount * 3, unit: "tsp" };
  return { amount, unit };
}

function formatAmount(n: number): string {
  const whole = Math.floor(n + 1e-9);
  const frac = n - whole;
  const fractions: [number, string][] = [
    [0.25, "1/4"],
    [0.5, "1/2"],
    [0.75, "3/4"],
  ];
  const f = fractions.find(([v]) => Math.abs(frac - v) < 0.01);
  if (Math.abs(frac) < 0.01) return String(whole);
  if (f) return whole > 0 ? `${whole} ${f[1]}` : f[1];
  return String(Math.round(n * 10) / 10);
}

function formatQty(amount: number, unit: string): string {
  if (unit === "ml" && amount >= 1000) {
    const litres = amount / 1000;
    return `${formatAmount(litres)} ${litres > 1 ? "litres" : "litre"}`;
  }
  if (unit === "g" && amount >= 1000) return `${formatAmount(amount / 1000)} kg`;
  if (unit === "tsp" && amount >= 3) {
    // Spoon measures are totalled in teaspoons (1 tbsp = 3 tsp) and shown
    // as whole tablespoons plus any teaspoons left over.
    const tbsp = Math.floor(amount / 3 + 1e-9);
    const rest = amount - tbsp * 3;
    return rest > 0.01 ? `${tbsp} tbsp + ${formatAmount(rest)} tsp` : `${tbsp} tbsp`;
  }
  if (!unit) return formatAmount(amount);
  const label = amount > 1 && UNIT_PLURAL[unit] ? UNIT_PLURAL[unit] : unit;
  return `${formatAmount(amount)} ${label}`;
}

/**
 * Merges ingredient lists from several recipes into one shopping list:
 * the same ingredient appears once, with quantities added up where the units
 * match ("3 cloves" + "2 cloves" → "5 cloves") and listed side by side where
 * they don't ("1 cup + 200 g"). A recipe planned twice counts twice.
 */
export function mergeIngredients(lists: Ingredient[][]): Ingredient[] {
  const merged = new Map<string, { name: string; category: string; totals: Map<string, number>; loose: string[] }>();

  for (const list of lists) {
    for (const ing of list) {
      const key = ing.name.trim().toLowerCase();
      if (!key) continue;
      let row = merged.get(key);
      if (!row) {
        row = { name: ing.name.trim(), category: ing.category || "Pantry", totals: new Map(), loose: [] };
        merged.set(key, row);
      }
      const parsed = parseQty(ing.qty ?? "");
      if (parsed) row.totals.set(parsed.unit, (row.totals.get(parsed.unit) ?? 0) + parsed.amount);
      else if (ing.qty && !row.loose.includes(ing.qty)) row.loose.push(ing.qty);
    }
  }

  return [...merged.values()]
    .map((row) => ({
      name: row.name,
      category: row.category,
      qty: [...[...row.totals.entries()].map(([unit, amount]) => formatQty(amount, unit)), ...row.loose].join(" + "),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

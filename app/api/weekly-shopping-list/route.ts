import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId, getCurrentUserTier } from "@/lib/auth";
import { currentWeekLabel } from "@/lib/format";
import { canAccessRecipe, getRecipeById } from "@/lib/recipes";
import { FREE_PLAN_DAYS, mergeIngredients } from "@/lib/recipe-utils";
import { signInRequired } from "@/lib/sign-in";

const MAX_MEALS = 7;

/**
 * Weekly Shopping List: takes the recipes on the visitor's weekly plan,
 * combines their ingredients (duplicates merged, quantities added up) and
 * saves the result into the existing shopping_lists / shopping_list_items
 * tables — so it opens on the same /list/[id] page, with the same check-off
 * behaviour, as the single-meal list. No schema change.
 */
export async function POST(req: Request) {
  let body: { recipe_ids?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const ids = Array.isArray(body.recipe_ids) ? body.recipe_ids.filter((x): x is string => typeof x === "string") : [];
  if (ids.length === 0) {
    return NextResponse.json(
      { error: "empty_plan", message: "Add at least one meal to your week first." },
      { status: 400 },
    );
  }
  if (ids.length > MAX_MEALS) {
    return NextResponse.json({ error: "too_many_meals", message: "A week holds up to 7 meals." }, { status: 400 });
  }

  const userId = await getCurrentUserId();
  if (!userId) return signInRequired();

  const tier = await getCurrentUserTier();
  if (tier === "free" && ids.length > FREE_PLAN_DAYS) {
    return NextResponse.json(
      { error: "plan_requires_paid", message: `Free accounts plan ${FREE_PLAN_DAYS} days — Full Access plans all 7.` },
      { status: 403 },
    );
  }
  const recipes = [];
  for (const id of ids) {
    const recipe = getRecipeById(id);
    if (!recipe) {
      return NextResponse.json({ error: "recipe_not_found", message: "One of those recipes no longer exists." }, { status: 404 });
    }
    // Enforced here as well as in the UI, so a direct API call can't pull
    // Full Access recipes' ingredients on the free tier.
    if (!canAccessRecipe(recipe, tier)) {
      return NextResponse.json(
        { error: "recipe_requires_paid", message: `${recipe.title} is available with Full Access.` },
        { status: 403 },
      );
    }
    recipes.push(recipe);
  }

  const supabase = await createClient();

  const { data: list, error: listError } = await supabase
    .from("shopping_lists")
    .insert({
      user_id: userId,
      checkin_id: null,
      week_label: `${currentWeekLabel()} · weekly plan, ${recipes.length} meal${recipes.length === 1 ? "" : "s"}`,
      status: "active",
    })
    .select()
    .single();

  if (listError || !list) {
    return NextResponse.json(
      { error: "db_error", message: "Couldn't save your list — please try again." },
      { status: 500 },
    );
  }

  const items = mergeIngredients(recipes.map((r) => r.ingredients)).map((ing) => ({
    user_id: userId,
    shopping_list_id: list.id,
    ingredient_name: ing.name,
    quantity: ing.qty || null,
    category: ing.category ?? "Pantry",
    checked: false,
  }));

  const { error: itemsError } = await supabase.from("shopping_list_items").insert(items);
  if (itemsError) {
    return NextResponse.json(
      { error: "db_error", message: "Couldn't save your list — please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ shopping_list_id: list.id, item_count: items.length });
}

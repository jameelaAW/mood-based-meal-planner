import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { currentWeekLabel } from "@/lib/format";
import type { Ingredient } from "@/lib/types";

export async function POST(req: Request) {
  let body: { checkin_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const checkinId = body.checkin_id;
  if (!checkinId) {
    return NextResponse.json({ error: "missing_checkin_id" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: checkin, error: checkinError } = await supabase
    .from("mood_checkins")
    .select("id, suggested_meal_id")
    .eq("id", checkinId)
    .single();

  if (checkinError || !checkin || !checkin.suggested_meal_id) {
    return NextResponse.json({ error: "checkin_not_found" }, { status: 404 });
  }

  const { data: meal, error: mealError } = await supabase
    .from("meals")
    .select("id, ingredients")
    .eq("id", checkin.suggested_meal_id)
    .single();

  if (mealError || !meal) {
    return NextResponse.json({ error: "meal_not_found" }, { status: 404 });
  }

  const { data: list, error: listError } = await supabase
    .from("shopping_lists")
    .insert({
      checkin_id: checkinId,
      week_label: currentWeekLabel(),
      status: "active",
    })
    .select()
    .single();

  if (listError || !list) {
    return NextResponse.json({ error: "db_error", message: listError?.message }, { status: 500 });
  }

  const ingredients = (meal.ingredients ?? []) as Ingredient[];
  if (ingredients.length === 0) {
    // Still return the (empty) list id — the list page shows an appropriate empty state.
    return NextResponse.json({ shopping_list_id: list.id });
  }

  const itemsPayload = ingredients.map((ing) => ({
    shopping_list_id: list.id,
    ingredient_name: ing.name,
    quantity: ing.qty ?? null,
    category: ing.category ?? "Pantry",
    checked: false,
  }));

  const { error: itemsError } = await supabase.from("shopping_list_items").insert(itemsPayload);
  if (itemsError) {
    return NextResponse.json({ error: "db_error", message: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ shopping_list_id: list.id });
}

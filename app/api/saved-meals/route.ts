import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "sign_in_required", message: "Sign in to save meals." },
      { status: 401 },
    );
  }

  let body: { meal_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const mealId = body.meal_id;
  if (!mealId) {
    return NextResponse.json({ error: "missing_meal_id" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("saved_meals")
    .select("id")
    .eq("user_id", user.id)
    .eq("meal_id", mealId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("saved_meals").delete().eq("id", existing.id);
    if (error) return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
    return NextResponse.json({ saved: false });
  }

  const { error } = await supabase.from("saved_meals").insert({ user_id: user.id, meal_id: mealId });
  if (error) return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  return NextResponse.json({ saved: true });
}

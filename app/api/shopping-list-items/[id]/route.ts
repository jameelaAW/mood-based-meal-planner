import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: { checked?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof body.checked !== "boolean") {
    return NextResponse.json({ error: "missing_checked" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shopping_list_items")
    .update({ checked: body.checked })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "not_found", message: error?.message }, { status: 404 });
  }

  return NextResponse.json({ item: data });
}

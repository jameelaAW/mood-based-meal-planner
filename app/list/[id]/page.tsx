import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ShoppingListItem } from "@/lib/types";
import ShoppingListClient from "./ShoppingListClient";

export default async function ShoppingListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: list } = await supabase.from("shopping_lists").select("*").eq("id", id).single();
  if (!list) notFound();

  const { data: items } = await supabase
    .from("shopping_list_items")
    .select("*")
    .eq("shopping_list_id", id)
    .order("ingredient_name");

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="font-mono text-xs uppercase tracking-wider text-paper-dim hover:text-brand">
          ← Back
        </Link>
        <h1 className="mt-4 font-display text-3xl italic">Shopping list</h1>
        <p className="mt-1 text-sm text-paper-dim">{list.week_label}</p>

        <div className="mt-8">
          {items && items.length > 0 ? (
            <ShoppingListClient items={items as ShoppingListItem[]} />
          ) : (
            <p className="rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-6 text-center text-paper-dim">
              Nothing to show — regenerate from your recipe.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

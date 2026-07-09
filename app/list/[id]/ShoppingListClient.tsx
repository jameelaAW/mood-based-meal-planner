"use client";

import { useState } from "react";
import type { ShoppingListItem } from "@/lib/types";
import { CATEGORY_ORDER } from "@/lib/format";

export default function ShoppingListClient({ items }: { items: ShoppingListItem[] }) {
  const [state, setState] = useState(items);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  async function toggle(item: ShoppingListItem) {
    const nextChecked = !item.checked;
    setState((prev) => prev.map((i) => (i.id === item.id ? { ...i, checked: nextChecked } : i)));
    setPendingIds((prev) => new Set(prev).add(item.id));

    try {
      const res = await fetch(`/api/shopping-list-items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked: nextChecked }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      // Revert on failure — the list is the source of truth.
      setState((prev) => prev.map((i) => (i.id === item.id ? { ...i, checked: item.checked } : i)));
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  }

  const categories = CATEGORY_ORDER.filter((cat) => state.some((i) => (i.category ?? "Pantry") === cat));
  const uncategorized = state.filter((i) => !CATEGORY_ORDER.includes(i.category ?? ""));
  const groups = uncategorized.length > 0 ? [...categories, "Other"] : categories;

  const checkedCount = state.filter((i) => i.checked).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-paper-dim/20 pb-3">
        <span className="font-mono text-xs uppercase tracking-wider text-paper-dim">
          {checkedCount} / {state.length} collected
        </span>
      </div>

      {groups.map((category) => {
        const rows = category === "Other" ? uncategorized : state.filter((i) => (i.category ?? "Pantry") === category);
        if (rows.length === 0) return null;
        return (
          <div key={category}>
            <h2 className="mb-3 font-display text-lg italic text-brand">{category}</h2>
            <ul className="space-y-2">
              {rows.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => toggle(item)}
                    disabled={pendingIds.has(item.id)}
                    className="flex w-full items-center gap-3 rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-3 text-left transition hover:border-brand/40 disabled:opacity-60"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        item.checked ? "border-brand bg-brand text-ink" : "border-paper-dim/40"
                      }`}
                      aria-hidden
                    >
                      {item.checked ? "✓" : ""}
                    </span>
                    <span className={`flex-1 ${item.checked ? "text-paper-dim line-through" : "text-paper"}`}>
                      {item.ingredient_name}
                    </span>
                    {item.quantity && (
                      <span className="font-mono text-xs text-paper-dim">{item.quantity}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { MOOD_OPTIONS, type MoodOption } from "@/lib/moods";

export default function MoodPicker({
  onSubmit,
  loading,
  moodOptions = MOOD_OPTIONS,
  tier = "free",
}: {
  onSubmit: (moodLabel: string, freeText: string) => void;
  loading: boolean;
  moodOptions?: MoodOption[];
  tier?: "free" | "pro";
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [freeText, setFreeText] = useState("");
  const canSubmit = Boolean(selected) || freeText.trim().length > 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {moodOptions.map((mood) => {
          const isSelected = selected === mood.label;
          return (
            <button
              key={mood.label}
              onClick={() => setSelected(mood.label)}
              className="rounded-xl border px-4 py-4 text-center transition"
              style={{
                borderColor: isSelected ? `var(${mood.accentVar})` : "rgba(207,200,186,0.15)",
                background: isSelected ? `color-mix(in srgb, var(${mood.accentVar}) 18%, var(--color-ink-soft))` : "var(--color-ink-soft)",
              }}
            >
              <span className="block text-2xl">{mood.emoji}</span>
              <span className="mt-1 block text-sm text-paper">{mood.name}</span>
            </button>
          );
        })}
      </div>

      <input
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        placeholder={
          tier === "pro"
            ? "Not feeling any of these? Type any mood — even Anxious or Unfocused"
            : "Not feeling any of these? Describe your mood here"
        }
        className="w-full rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-3 text-sm text-paper placeholder:text-paper-dim/60 focus:border-brand"
      />

      <button
        onClick={() => canSubmit && onSubmit(selected ?? "", freeText)}
        disabled={!canSubmit || loading}
        className="w-full rounded-lg bg-brand py-3 font-medium text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Finding your meal…" : "Suggest a meal"}
      </button>
    </div>
  );
}

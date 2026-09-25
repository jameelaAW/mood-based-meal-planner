"use client";

import { useState } from "react";
import { canUseFreeText, EXTENDED_MOOD_WORDS, MOOD_OPTIONS, type MoodOption, type PlanTier } from "@/lib/moods";

export default function MoodPicker({
  onSubmit,
  loading,
  moodOptions = MOOD_OPTIONS,
  tier = "free",
}: {
  onSubmit: (moodLabel: string, freeText: string) => void;
  loading: boolean;
  moodOptions?: MoodOption[];
  tier?: PlanTier;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [freeText, setFreeText] = useState("");
  const showFreeText = canUseFreeText(tier);
  const canSubmit = Boolean(selected) || (showFreeText && freeText.trim().length > 0);

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

      {showFreeText && (
        <div className="space-y-2">
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                setSelected(null);
                setFreeText(e.target.value);
              }
            }}
            className="w-full rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-3 text-sm text-paper-dim focus:border-brand"
          >
            <option value="">Or pick a specific feeling…</option>
            {EXTENDED_MOOD_WORDS.map((word) => (
              <option key={word} value={word}>
                {word.charAt(0).toUpperCase() + word.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>

          <input
            value={freeText}
            onChange={(e) => {
              setSelected(null);
              setFreeText(e.target.value);
            }}
            placeholder="Not feeling any of these? Describe your mood here"
            className="w-full rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-3 text-sm text-paper placeholder:text-paper-dim/60 focus:border-brand"
          />
        </div>
      )}

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

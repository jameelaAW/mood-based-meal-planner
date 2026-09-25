// Free: 4 built-in moods, buttons only. Pro: all 6 built-in moods, still
// buttons only. Pro-Plus: all 6 built-in moods PLUS the free-text box to
// describe a mood beyond this fixed list.
export type PlanTier = "free" | "pro" | "pro_plus";

export interface MoodOption {
  label: string;
  name: string;
  emoji: string;
  accentVar: string;
  tier: "free" | "pro";
}

export const MOOD_OPTIONS: MoodOption[] = [
  { label: "stressed", name: "Stressed", emoji: "😤", accentVar: "--color-mood-stressed", tier: "free" },
  { label: "sluggish", name: "Sluggish", emoji: "🥱", accentVar: "--color-mood-sluggish", tier: "free" },
  { label: "sad", name: "Sad", emoji: "😔", accentVar: "--color-mood-sad", tier: "free" },
  { label: "happy", name: "Happy", emoji: "😊", accentVar: "--color-mood-happy", tier: "free" },
  { label: "anxious", name: "Anxious", emoji: "😬", accentVar: "--color-mood-anxious", tier: "pro" },
  { label: "unfocused", name: "Unfocused", emoji: "🌫️", accentVar: "--color-mood-unfocused", tier: "pro" },
];

export const MOOD_LABELS = MOOD_OPTIONS.map((m) => m.label);
export const FREE_MOOD_LABELS = MOOD_OPTIONS.filter((m) => m.tier === "free").map((m) => m.label);

// Pro and Pro-Plus both get all 6 built-in moods as buttons; only Free is
// capped at 4. What separates Pro from Pro-Plus is the free-text box itself
// (see canUseFreeText), not which built-in moods are selectable.
export function moodLabelsForTier(tier: PlanTier): string[] {
  return tier === "free" ? FREE_MOOD_LABELS : MOOD_LABELS;
}

export function moodOptionsForTier(tier: PlanTier): MoodOption[] {
  return tier === "free" ? MOOD_OPTIONS.filter((m) => m.tier === "free") : MOOD_OPTIONS;
}

export function canUseFreeText(tier: PlanTier): boolean {
  return tier === "pro_plus";
}

// "Adjacent mood" bonus per the Intelligence Layer scoring rule: tags that are
// conceptually close to the selected mood_label but not an exact match.
export const ADJACENT_TAGS: Record<string, string[]> = {
  stressed: ["overwhelmed", "anxious"],
  sluggish: ["tired", "low-energy"],
  sad: ["low", "melancholy"],
  happy: ["great", "energetic"],
  anxious: ["nervous", "restless"],
  unfocused: ["distracted", "foggy"],
};

export function moodAccent(label: string): string {
  return MOOD_OPTIONS.find((m) => m.label === label)?.accentVar ?? "--color-brand";
}

// Keyword bank for guess_mood_from_text(free_text) — the rule-based fallback
// that maps a free-text mood (one not in MOOD_OPTIONS) onto the closest
// canonical label so the tag-filter matching in lib/rank.ts still works.
// Keeps the "mood not listed" flow working even with the AI layer off.
const MOOD_KEYWORDS: Record<string, string[]> = {
  stressed: ["stress", "overwhelm", "swamped", "pressure", "deadline", "frazzled", "burnt out", "burned out"],
  sluggish: ["sluggish", "tired", "exhausted", "sleepy", "drained", "fatigue", "lethargic", "low energy", "low-energy", "worn out"],
  sad: ["sad", "down", "blue", "low", "depress", "melancholy", "upset", "heartbroken", "lonely", "gloomy"],
  happy: ["happy", "great", "good mood", "excited", "joyful", "cheerful", "elated", "content", "thrilled", "energetic"],
  anxious: ["anxious", "nervous", "worried", "restless", "on edge", "panicky", "uneasy", "tense"],
  unfocused: ["unfocused", "distracted", "foggy", "scattered", "can't concentrate", "cant concentrate", "brain fog", "spacey", "unmotivated"],
};

// Pro-Plus quick-pick dropdown: the "adjacent mood" synonyms above, minus any
// word that's already a canonical mood name (those already have their own
// button). Selecting one fills the free-text box with a word guaranteed to
// score well in guessMoodFromText, since meals are tagged with these same
// words (see docs/DATA_MODEL.md mood_tags).
export const EXTENDED_MOOD_WORDS: string[] = Array.from(
  new Set(Object.values(ADJACENT_TAGS).flat().filter((word) => !MOOD_LABELS.includes(word))),
);

export function guessMoodFromText(text: string, allowedLabels: string[] = MOOD_LABELS): string {
  const haystack = text.toLowerCase();
  let bestLabel = allowedLabels[0];
  let bestScore = 0;

  for (const label of allowedLabels) {
    const keywords = MOOD_KEYWORDS[label] ?? [];
    const score = keywords.reduce((sum, kw) => (haystack.includes(kw) ? sum + 1 : sum), 0);
    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  }

  return bestLabel;
}

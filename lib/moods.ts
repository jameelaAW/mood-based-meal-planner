export interface MoodOption {
  label: string;
  name: string;
  emoji: string;
  accentVar: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { label: "stressed", name: "Stressed", emoji: "😤", accentVar: "--color-mood-stressed" },
  { label: "sluggish", name: "Sluggish", emoji: "🥱", accentVar: "--color-mood-sluggish" },
  { label: "sad", name: "Sad", emoji: "😔", accentVar: "--color-mood-sad" },
  { label: "happy", name: "Happy", emoji: "😊", accentVar: "--color-mood-happy" },
  { label: "anxious", name: "Anxious", emoji: "😬", accentVar: "--color-mood-anxious" },
  { label: "unfocused", name: "Unfocused", emoji: "🌫️", accentVar: "--color-mood-unfocused" },
];

export const MOOD_LABELS = MOOD_OPTIONS.map((m) => m.label);

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
  sluggish: ["sluggish", "tired", "exhausted", "sleepy", "drained", "fatigue", "lethargic", "low energy", "worn out"],
  sad: ["sad", "down", "blue", "low", "depress", "melancholy", "upset", "heartbroken", "lonely", "gloomy"],
  happy: ["happy", "great", "good mood", "excited", "joyful", "cheerful", "elated", "content", "thrilled"],
  anxious: ["anxious", "nervous", "worried", "restless", "on edge", "panicky", "uneasy", "tense"],
  unfocused: ["unfocused", "distracted", "foggy", "scattered", "can't concentrate", "cant concentrate", "brain fog", "spacey", "unmotivated"],
};

export function guessMoodFromText(text: string): string {
  const haystack = text.toLowerCase();
  let bestLabel = MOOD_LABELS[0];
  let bestScore = 0;

  for (const label of MOOD_LABELS) {
    const keywords = MOOD_KEYWORDS[label] ?? [];
    const score = keywords.reduce((sum, kw) => (haystack.includes(kw) ? sum + 1 : sum), 0);
    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  }

  return bestLabel;
}

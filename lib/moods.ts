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

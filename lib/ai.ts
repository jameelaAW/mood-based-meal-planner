const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o";
const TIMEOUT_MS = 8000;

async function chatComplete(system: string, user: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.7,
        max_tokens: 120,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Empty OpenAI response");
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * generate_why_it_fits(meal, mood_label) — writes a short, specific sentence
 * on why the suggested meal fits the visitor's stated mood.
 */
export async function generateWhyItFits(
  mealTitle: string,
  mealDescription: string | null,
  moodLabel: string,
  freeText: string | null,
): Promise<string> {
  const system =
    "You write one warm, specific sentence (max 30 words) explaining why a recipe suits someone's current mood. " +
    "Reference a real nutritional or sensory mechanism. No preamble, no quotes, just the sentence.";
  const user = `Meal: "${mealTitle}"${mealDescription ? ` — ${mealDescription}` : ""}\nMood: ${moodLabel}${
    freeText ? `\nThey said: "${freeText}"` : ""
  }`;
  return chatComplete(system, user);
}

/**
 * interpret_mood(free_text) — turns a free-text mood note into a short
 * clinical-adjacent interpretation used for the ai_mood_interpretation field.
 */
export async function interpretMood(freeText: string, moodLabel: string): Promise<string> {
  const system =
    "You write one short, plain-language interpretation (max 25 words) of what someone needs emotionally and " +
    "physically right now, based on a mood label and their own words. No preamble.";
  const user = `Mood label: ${moodLabel}\nTheir words: "${freeText}"`;
  return chatComplete(system, user);
}

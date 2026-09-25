import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId, getCurrentUserTier } from "@/lib/auth";
import { pickMeal } from "@/lib/rank";
import { classifyMoodLabel, generateWhyItFits, interpretMood } from "@/lib/ai";
import { canUseFreeText, guessMoodFromText, MOOD_LABELS, moodLabelsForTier } from "@/lib/moods";
import type { Meal } from "@/lib/types";

export async function POST(req: Request) {
  let body: { mood_label?: string; free_text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const userTier = await getCurrentUserTier();
  const allowedMoods = moodLabelsForTier(userTier);

  let moodLabel = (body.mood_label ?? "").trim().toLowerCase();
  // The free-text box is a Plus feature — stripped for everyone else so
  // it can't be used for mood classification or the AI copy it flavours,
  // no matter what a direct API call sends.
  const freeText = canUseFreeText(userTier) ? body.free_text?.trim() || null : null;
  let moodLabelSource: "selected" | "ai" | "rule-based" = "selected";

  if (moodLabel && MOOD_LABELS.includes(moodLabel) && !allowedMoods.includes(moodLabel)) {
    return NextResponse.json(
      { error: "mood_requires_pro", message: "That mood is available on the Pro plan." },
      { status: 403 },
    );
  }

  if (!moodLabel || !MOOD_LABELS.includes(moodLabel)) {
    // No mood button picked — fall back to classifying the free text they typed
    // ("indicate a mood not listed"). Requires free_text; otherwise there's
    // nothing to go on. Classification is restricted to this visitor's allowed
    // moods so free-text can't be used to sneak into Pro-only moods.
    if (!freeText) {
      const message = canUseFreeText(userTier)
        ? "Pick a mood or describe how you feel."
        : "Pick a mood.";
      return NextResponse.json({ error: "invalid_mood", message }, { status: 400 });
    }

    try {
      const aiLabel = await classifyMoodLabel(freeText, allowedMoods);
      if (!allowedMoods.includes(aiLabel)) throw new Error(`unexpected label: ${aiLabel}`);
      moodLabel = aiLabel;
      moodLabelSource = "ai";
    } catch {
      moodLabel = guessMoodFromText(freeText, allowedMoods);
      moodLabelSource = "rule-based";
    }
  }

  const supabase = await createClient();

  const { data: allMeals, error: mealsError } = await supabase.from("meals").select("*");
  if (mealsError) {
    return NextResponse.json({ error: "db_error", message: mealsError.message }, { status: 500 });
  }
  if (!allMeals || allMeals.length === 0) {
    return NextResponse.json(
      { error: "no_match", message: "No meals in the database yet." },
      { status: 404 },
    );
  }

  const meals = userTier === "free" ? allMeals.filter((m) => m.tier === "free") : allMeals;

  const winner = pickMeal(meals as Meal[], moodLabel);
  if (!winner) {
    return NextResponse.json(
      { error: "no_match", message: "We don't have a match yet — try a different mood." },
      { status: 404 },
    );
  }

  // How many more recipes exist for this mood than this visitor's tier can
  // reach — powers the "N more recipes — unlock with Pro" upsell.
  const totalForMood = allMeals.filter((m) => m.mood_tags?.includes(moodLabel)).length;
  const accessibleForMood = meals.filter((m) => m.mood_tags?.includes(moodLabel)).length;
  const lockedMealCount = totalForMood - accessibleForMood;

  // Defaults: rule-based fallback (always valid per ARCHITECTURE.md "core runs without AI")
  let whyItFits = winner.why_it_fits ?? `${winner.title} is a solid pick for feeling ${moodLabel}.`;
  let whyItFitsSource = winner.why_it_fits_source ?? "rule-engine-v1";
  let whyItFitsConfidence = winner.why_it_fits_confidence ?? 0.75;

  let aiMoodInterpretation: string | null = null;
  let aiMoodSource: string | null = null;
  let aiMoodConfidence: number | null = null;

  try {
    const aiWhy = await generateWhyItFits(winner.title, winner.description, moodLabel, freeText);
    whyItFits = aiWhy;
    whyItFitsSource = "openai-gpt4o";
    whyItFitsConfidence = 0.9;

    // Best-effort: persist the freshly generated copy back onto the meal row.
    await supabase
      .from("meals")
      .update({
        why_it_fits: whyItFits,
        why_it_fits_source: whyItFitsSource,
        why_it_fits_confidence: whyItFitsConfidence,
        why_it_fits_review_status: "unreviewed",
      })
      .eq("id", winner.id);
  } catch (err) {
    console.error("generate_why_it_fits fallback:", err);
  }

  if (freeText) {
    try {
      aiMoodInterpretation = await interpretMood(freeText, moodLabel);
      aiMoodSource = "openai-gpt4o";
      aiMoodConfidence = 0.85;
    } catch (err) {
      console.error("interpret_mood fallback:", err);
    }
  }

  const userId = await getCurrentUserId();

  const { data: checkin, error: checkinError } = await supabase
    .from("mood_checkins")
    .insert({
      user_id: userId,
      mood_label: moodLabel,
      free_text: freeText,
      suggested_meal_id: winner.id,
      ai_mood_interpretation: aiMoodInterpretation,
      ai_mood_interpretation_source: aiMoodSource,
      ai_mood_interpretation_confidence: aiMoodConfidence,
      ai_mood_interpretation_review_status: aiMoodInterpretation ? "unreviewed" : null,
    })
    .select()
    .single();

  if (checkinError) {
    return NextResponse.json({ error: "db_error", message: checkinError.message }, { status: 500 });
  }

  return NextResponse.json({
    checkin_id: checkin.id,
    mood_label: moodLabel,
    mood_label_source: moodLabelSource,
    locked_meal_count: lockedMealCount,
    meal: {
      ...winner,
      why_it_fits: whyItFits,
      why_it_fits_source: whyItFitsSource,
      why_it_fits_confidence: whyItFitsConfidence,
    },
    ai_mood_interpretation: aiMoodInterpretation,
  });
}

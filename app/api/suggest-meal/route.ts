import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId, getCurrentUserTier } from "@/lib/auth";
import { lockedCountForMood, recipesForMood } from "@/lib/recipes";
import { ensureMealRow, recipeToMeal } from "@/lib/recipe-meals";
import { classifyMoodLabel, generateWhyItFits, interpretMood } from "@/lib/ai";
import { canUseFreeText, guessMoodFromText, MOOD_LABELS, moodLabelsForTier } from "@/lib/moods";
import { cookies } from "next/headers";
import { signInRequired } from "@/lib/sign-in";
import {
  ANON_USES_COOKIE,
  FREE_DAILY_LIMIT,
  anonCookieValue,
  countTodayForUser,
  readAnonCount,
} from "@/lib/limits";

export async function POST(req: Request) {
  let body: { mood_label?: string; free_text?: string; exclude_recipe_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const userId = await getCurrentUserId();
  if (!userId) return signInRequired();

  const userTier = await getCurrentUserTier();
  const allowedMoods = moodLabelsForTier(userTier);
  const supabase = await createClient();

  // Free tier: FREE_DAILY_LIMIT suggestions per day (resets at SGT midnight).
  // Checked before any AI call so capped visitors cost nothing.
  const cookieStore = await cookies();
  let usedToday = 0;
  if (userTier === "free") {
    usedToday = userId
      ? await countTodayForUser(supabase, userId)
      : readAnonCount(cookieStore.get(ANON_USES_COOKIE)?.value);
    if (usedToday >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: "daily_limit",
          signed_in: !!userId,
          limit: FREE_DAILY_LIMIT,
          message: `You've used today's ${FREE_DAILY_LIMIT} free meal ideas.`,
        },
        { status: 429 },
      );
    }
  }

  let moodLabel = (body.mood_label ?? "").trim().toLowerCase();
  // The free-text box is a paid Full Access feature — stripped for free
  // visitors so it can't be used for mood classification or the AI copy it
  // flavours, no matter what a direct API call sends.
  const freeText = canUseFreeText(userTier) ? body.free_text?.trim() || null : null;
  let moodLabelSource: "selected" | "ai" | "rule-based" = "selected";

  if (moodLabel && MOOD_LABELS.includes(moodLabel) && !allowedMoods.includes(moodLabel)) {
    return NextResponse.json(
      { error: "mood_requires_paid", message: "That mood is available with Full Access." },
      { status: 403 },
    );
  }

  if (!moodLabel || !MOOD_LABELS.includes(moodLabel)) {
    // No mood button picked — fall back to classifying the free text they typed
    // ("indicate a mood not listed"). Requires free_text; otherwise there's
    // nothing to go on. Classification is restricted to this visitor's allowed
    // moods so free-text can't be used to sneak into paid-only moods.
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

  // Recipes come from data/recipes.json — the same catalog /plan and /cook
  // use — so all three always agree. Free: the 2 free recipes for the mood;
  // Full Access: all 4.
  const candidates = recipesForMood(moodLabel, userTier);
  if (candidates.length === 0) {
    return NextResponse.json(
      { error: "no_match", message: "We don't have a match yet — try a different mood." },
      { status: 404 },
    );
  }
  // Avoid serving the recipe the visitor is already looking at when they ask again.
  const fresh = candidates.filter((r) => r.id !== body.exclude_recipe_id);
  const pool = fresh.length > 0 ? fresh : candidates;
  const recipe = pool[Math.floor(Math.random() * pool.length)];

  // "N more recipes for this mood with Full Access" — 2 on the free tier, 0 on paid.
  const lockedMealCount = lockedCountForMood(moodLabel, userTier);

  // Mirror the recipe into the meals table so history, favourites and the
  // single-meal shopping list (all keyed on a meals row) keep working.
  const mealRowId = await ensureMealRow(supabase, recipe);
  const winner = recipeToMeal(recipe, mealRowId);

  // Default: the recipe's own copy (always valid per ARCHITECTURE.md "core runs without AI")
  let whyItFits = recipe.why_it_fits;
  let whyItFitsSource = "recipes-json-v1";
  let whyItFitsConfidence = 0.8;

  let aiMoodInterpretation: string | null = null;
  let aiMoodSource: string | null = null;
  let aiMoodConfidence: number | null = null;

  try {
    const aiWhy = await generateWhyItFits(winner.title, winner.description, moodLabel, freeText);
    whyItFits = aiWhy;
    whyItFitsSource = "openai-gpt4o";
    whyItFitsConfidence = 0.9;
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

  const { data: checkin, error: checkinError } = await supabase
    .from("mood_checkins")
    .insert({
      user_id: userId,
      mood_label: moodLabel,
      free_text: freeText,
      suggested_meal_id: mealRowId,
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

  // Anonymous free visitors: bump the cookie counter only after a successful suggestion.
  if (userTier === "free" && !userId) {
    cookieStore.set(ANON_USES_COOKIE, anonCookieValue(usedToday + 1), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 36,
    });
  }

  const freeRemaining = userTier === "free" ? Math.max(0, FREE_DAILY_LIMIT - usedToday - 1) : null;

  return NextResponse.json({
    free_remaining: freeRemaining,
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MoodPicker from "@/app/components/MoodPicker";
import RecipeCard from "@/app/components/RecipeCard";
import AuthNav from "@/app/components/AuthNav";
import { moodAccent } from "@/lib/moods";
import type { Meal } from "@/lib/types";

type Status = "idle" | "loading" | "ready" | "no_match" | "error";

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [meal, setMeal] = useState<Meal | null>(null);
  const [checkinId, setCheckinId] = useState<string | null>(null);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveHint, setSaveHint] = useState<string | null>(null);

  async function handleSubmit(moodLabel: string, freeText: string) {
    setStatus("loading");
    setErrorMsg(null);
    setActiveMood(moodLabel);
    setSaved(false);
    setSaveHint(null);
    try {
      const res = await fetch("/api/suggest-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood_label: moodLabel, free_text: freeText || undefined }),
      });
      const data = await res.json();

      if (res.status === 404 && data.error === "no_match") {
        setStatus("no_match");
        return;
      }
      if (!res.ok) {
        setErrorMsg(data.message ?? "Something went wrong — please try again.");
        setStatus("error");
        return;
      }

      setMeal(data.meal);
      setCheckinId(data.checkin_id);
      setStatus("ready");
    } catch {
      setErrorMsg("Something went wrong — please try again.");
      setStatus("error");
    }
  }

  async function handleBuildList() {
    if (!checkinId) return;
    setBuilding(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/generate-shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkin_id: checkinId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message ?? "Couldn't build your list — please try again.");
        setBuilding(false);
        return;
      }
      router.push(`/list/${data.shopping_list_id}`);
    } catch {
      setErrorMsg("Couldn't build your list — please try again.");
      setBuilding(false);
    }
  }

  async function handleToggleSave() {
    if (!meal) return;
    setSaving(true);
    setSaveHint(null);
    try {
      const res = await fetch("/api/saved-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal_id: meal.id }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setSaveHint("Sign in to save meals.");
        return;
      }
      if (!res.ok) {
        setSaveHint("Couldn't save that — please try again.");
        return;
      }
      setSaved(data.saved);
    } catch {
      setSaveHint("Couldn't save that — please try again.");
    } finally {
      setSaving(false);
    }
  }

  const accentVar = activeMood ? moodAccent(activeMood) : "--color-brand";

  return (
    <main
      className="min-h-screen px-6 py-16 transition-colors duration-700"
      style={{
        background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, var(${accentVar}) 12%, var(--color-ink)), var(--color-ink) 70%)`,
      }}
    >
      <div className="mx-auto max-w-lg">
        <div className="mb-4">
          <AuthNav />
        </div>
        <header className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">Mood-based meal planner</p>
          <h1 className="mt-3 font-display text-4xl italic leading-tight">
            Tell us how you feel.
            <br />
            We&rsquo;ll tell you what to eat.
          </h1>
        </header>

        <MoodPicker onSubmit={handleSubmit} loading={status === "loading"} />

        {status === "loading" && (
          <div className="mt-8 animate-pulse space-y-4 rounded-2xl border border-paper-dim/15 bg-ink-soft p-6">
            <div className="h-48 rounded-lg bg-paper-dim/10" />
            <div className="h-4 w-2/3 rounded bg-paper-dim/10" />
            <div className="h-4 w-1/2 rounded bg-paper-dim/10" />
          </div>
        )}

        {status === "no_match" && (
          <p className="mt-8 rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-6 text-center text-paper-dim">
            We don&rsquo;t have a match yet — try a different mood.
          </p>
        )}

        {status === "error" && errorMsg && (
          <p className="mt-8 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-4 text-center text-sm text-red-200">
            {errorMsg}
          </p>
        )}

        {status === "ready" && meal && (
          <div className="mt-8 animate-reveal-up">
            <RecipeCard
              meal={meal}
              onBuildList={handleBuildList}
              building={building}
              saved={saved}
              onToggleSave={handleToggleSave}
              saving={saving}
            />
            {saveHint && <p className="mt-3 text-center text-xs text-paper-dim">{saveHint}</p>}
            {errorMsg && (
              <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-200">
                {errorMsg}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

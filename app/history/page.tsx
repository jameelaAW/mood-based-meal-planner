import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-paper">
        <div className="max-w-sm space-y-4 text-center">
          <h1 className="font-display text-2xl italic">Mood history</h1>
          <p className="text-sm text-paper-dim">Sign in to see your last check-ins and the meals we suggested.</p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-brand px-5 py-2.5 font-medium text-ink transition hover:brightness-110"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const { data: checkins } = await supabase
    .from("mood_checkins")
    .select("id, created_at, mood_label, free_text, meals(title, image_url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(7);

  return (
    <main className="min-h-screen bg-ink px-6 py-16 text-paper">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="font-mono text-xs uppercase tracking-wider text-paper-dim hover:text-brand">
          ← Back
        </Link>
        <h1 className="mt-4 font-display text-3xl italic">Your last check-ins</h1>

        <div className="mt-8 space-y-3">
          {checkins && checkins.length > 0 ? (
            checkins.map((c) => {
              const meal = Array.isArray(c.meals) ? c.meals[0] : c.meals;
              return (
                <div key={c.id} className="rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{c.mood_label}</span>
                    <span className="font-mono text-xs text-paper-dim">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {meal?.title && <p className="mt-1 text-sm text-paper-dim">→ {meal.title}</p>}
                  {c.free_text && <p className="mt-1 text-xs italic text-paper-dim/80">&ldquo;{c.free_text}&rdquo;</p>}
                </div>
              );
            })
          ) : (
            <p className="rounded-lg border border-paper-dim/15 bg-ink-soft px-4 py-6 text-center text-paper-dim">
              No check-ins yet — go pick a mood.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

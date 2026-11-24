/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import AuthNav from "@/app/components/AuthNav";
import FeatureNav, { type FeatureKey } from "@/app/components/FeatureNav";
import { loginHref } from "@/lib/next-path";
import type { Recipe } from "@/lib/recipe-utils";

/**
 * What a signed-out visitor sees on /plan and /cook: what the feature does,
 * a few real dishes, and a free sign-in button that brings them back here.
 */
export default function SignInGate({
  current,
  eyebrow,
  title,
  blurb,
  samples,
}: {
  current: FeatureKey;
  eyebrow: string;
  title: string;
  blurb: string;
  samples: Recipe[];
}) {
  const next = current === "plan" ? "/plan" : current === "cook" ? "/cook" : "/";
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-lg">
        <div className="mb-4">
          <AuthNav />
        </div>
        <header className="mb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl italic leading-tight">{title}</h1>
          <p className="mt-3 text-sm text-paper-dim">{blurb}</p>
        </header>
        <div className="mb-8">
          <FeatureNav current={current} />
        </div>
        <SignInCard next={next} samples={samples} />
      </div>
    </main>
  );
}

export function SignInCard({ next, samples = [] }: { next: string; samples?: Recipe[] }) {
  return (
    <section className="rounded-2xl border border-brand/30 bg-ink-soft p-6 text-center" aria-label="Sign in">
      {samples.length > 0 && (
        <div className="mb-5 grid grid-cols-3 gap-2">
          {samples.slice(0, 3).map((r) =>
            r.image_url ? (
              <figure key={r.id}>
                <img src={r.image_url} alt={r.title} loading="lazy" className="h-24 w-full rounded-lg object-cover" />
                <figcaption className="mt-1 truncate text-[11px] text-paper-dim">{r.title}</figcaption>
              </figure>
            ) : null,
          )}
        </div>
      )}
      <h2 className="font-display text-2xl italic">Sign in free to start</h2>
      <p className="mt-2 text-sm text-paper-dim">
        A free account gets you 3 meal ideas a day, a 3-day meal plan, cook-from-what-you-have and shopping lists.
        It takes 30 seconds with Google or your email.
      </p>
      <Link
        href={loginHref(next)}
        className="mt-5 block w-full rounded-lg bg-brand py-3 font-medium text-ink transition hover:brightness-110"
      >
        Sign in free
      </Link>
      <p className="mt-3 text-xs text-paper-dim">
        Want everything?{" "}
        <Link href="/pricing" className="text-brand hover:underline">
          Full Access is SGD 12 one-time
        </Link>
        .
      </p>
    </section>
  );
}

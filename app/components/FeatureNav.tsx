import Link from "next/link";

const LINKS = [
  { key: "home", href: "/", label: "Today" },
  { key: "plan", href: "/plan", label: "Weekly plan" },
  { key: "cook", href: "/cook", label: "Cook from what you have" },
] as const;

export type FeatureKey = (typeof LINKS)[number]["key"];

/** Tab row linking the mood check-in with the weekly plan and pantry features. */
export default function FeatureNav({ current }: { current: FeatureKey }) {
  return (
    <nav aria-label="Features" className="flex flex-wrap justify-center gap-2">
      {LINKS.map((link) => {
        const active = link.key === current;
        return (
          <Link
            key={link.key}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border px-4 py-1.5 text-xs transition ${
              active
                ? "border-brand bg-brand/15 text-paper"
                : "border-paper-dim/20 text-paper-dim hover:border-brand/40 hover:text-paper"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

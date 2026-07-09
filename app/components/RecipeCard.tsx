import type { Meal } from "@/lib/types";

export default function RecipeCard({
  meal,
  onBuildList,
  building,
  saved,
  onToggleSave,
  saving,
}: {
  meal: Meal;
  onBuildList: () => void;
  building: boolean;
  saved?: boolean;
  onToggleSave?: () => void;
  saving?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-paper-dim/15 bg-ink-soft">
      {meal.image_url && (
        // Recipe photos come from Unsplash URLs stored in the DB (docs/ARCHITECTURE.md).
        // eslint-disable-next-line @next/next/no-img-element
        <div className="relative">
          <img src={meal.image_url} alt={meal.title} className="h-56 w-full object-cover" />
          {onToggleSave && (
            <button
              onClick={onToggleSave}
              disabled={saving}
              aria-label={saved ? "Remove from saved meals" : "Save this meal"}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-lg backdrop-blur transition hover:bg-ink disabled:opacity-60"
            >
              {saved ? "♥" : "♡"}
            </button>
          )}
        </div>
      )}
      <div className="space-y-5 p-6">
        <div>
          <h2 className="font-display text-2xl italic">{meal.title}</h2>
          {meal.description && <p className="mt-1 text-sm text-paper-dim">{meal.description}</p>}
        </div>

        {meal.why_it_fits && (
          <p className="rounded-lg border-l-2 border-brand bg-ink px-4 py-3 text-sm leading-relaxed text-paper">
            {meal.why_it_fits}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-4">
          <Macro label="Cal" value={meal.calories} />
          <Macro label="Protein" value={meal.protein_g} suffix="g" />
          <Macro label="Carbs" value={meal.carbs_g} suffix="g" />
          <Macro label="Fat" value={meal.fat_g} suffix="g" />
        </div>

        <div>
          <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-paper-dim">
            Ingredients {meal.prep_minutes ? `· ${meal.prep_minutes} min` : ""}
          </h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-paper-dim">
            {meal.ingredients.map((ing, i) => (
              <li key={i}>
                {ing.name} <span className="text-paper-dim/60">· {ing.qty}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onBuildList}
          disabled={building}
          className="w-full rounded-lg bg-brand py-3 font-medium text-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {building ? "Building your list…" : "Build my shopping list"}
        </button>
      </div>
    </div>
  );
}

function Macro({ label, value, suffix = "" }: { label: string; value: number | null; suffix?: string }) {
  return (
    <div className="rounded-lg border border-paper-dim/15 bg-ink px-2 py-2 text-center">
      <div className="text-paper">{value ?? "—"}{value != null ? suffix : ""}</div>
      <div className="text-paper-dim">{label}</div>
    </div>
  );
}

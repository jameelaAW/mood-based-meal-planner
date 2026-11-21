import type { Recipe } from "@/lib/recipe-utils";

/** Ingredients + numbered steps for a recipe from data/recipes.json. */
export default function RecipeDetails({ recipe, missing }: { recipe: Recipe; missing?: string[] }) {
  return (
    <div className="space-y-4 border-t border-paper-dim/15 pt-4">
      <div>
        <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-paper-dim">
          Ingredients · serves {recipe.servings}
        </h4>
        <ul className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-paper-dim sm:grid-cols-2">
          {recipe.ingredients.map((ing) => {
            const isMissing = missing?.includes(ing.name);
            return (
              <li key={ing.name} className={isMissing ? "text-paper" : undefined}>
                {ing.name} <span className="text-paper-dim/60">· {ing.qty}</span>
                {isMissing && <span className="ml-1 font-mono text-[10px] uppercase text-brand">need</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-paper-dim">Method</h4>
        <ol className="list-decimal space-y-1.5 pl-4 text-sm text-paper-dim marker:text-brand">
          {recipe.steps.map((step, i) => (
            <li key={i} className="pl-1">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
import type { Recipe } from "@/lib/recipe-utils";

/** Square dish photo used in the weekly plan and pantry lists. */
export default function RecipePhoto({ recipe, size = 64 }: { recipe: Recipe; size?: number }) {
  if (!recipe.image_url) return null;
  return (
    <img
      src={recipe.image_url}
      alt={recipe.title}
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0 rounded-lg object-cover"
      style={{ width: size, height: size }}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

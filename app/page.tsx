import { Suspense } from "react";
import HomeClient from "@/app/HomeClient";
import { getCurrentUserId, getCurrentUserTier } from "@/lib/auth";
import { catalogStats, getRecipeById } from "@/lib/recipes";
import { recipeToMeal } from "@/lib/recipe-meals";

export default async function Home() {
  const [tier, userId] = await Promise.all([getCurrentUserTier(), getCurrentUserId()]);
  // Signed-out visitors see one real free recipe as a preview of the app.
  const sample = getRecipeById("stressed-soto-ayam");

  return (
    <Suspense>
      <HomeClient
        tier={tier}
        stats={catalogStats()}
        signedIn={!!userId}
        sampleMeal={!userId && sample ? recipeToMeal(sample, null) : null}
      />
    </Suspense>
  );
}

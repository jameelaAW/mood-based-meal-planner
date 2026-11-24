import { Suspense } from "react";
import HomeClient from "@/app/HomeClient";
import { getCurrentUserTier } from "@/lib/auth";
import { catalogStats } from "@/lib/recipes";

export default async function Home() {
  const tier = await getCurrentUserTier();

  return (
    <Suspense>
      <HomeClient tier={tier} stats={catalogStats()} />
    </Suspense>
  );
}

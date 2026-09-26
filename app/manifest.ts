import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mood-Based Meal Planner",
    short_name: "Mood Planner",
    description: "Tell us how you feel. We'll tell you what to eat — and build your shopping list.",
    start_url: "/",
    display: "standalone",
    background_color: "#211e26",
    theme_color: "#211e26",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "Mood-Based Meal Planner",
  description: "Tell us how you feel. We'll tell you what to eat — and build your shopping list.",
  openGraph: {
    title: "Mood-Based Meal Planner",
    description: "Tell us how you feel. We'll tell you what to eat — and build your shopping list.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mood-Based Meal Planner",
    description: "Tell us how you feel. We'll tell you what to eat — and build your shopping list.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

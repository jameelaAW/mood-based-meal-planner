import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mood-Based Meal Planner",
  description: "Tell us how you feel. We'll tell you what to eat — and build your shopping list.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import ServiceWorkerRegister from "@/app/components/ServiceWorkerRegister";
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mood Planner",
  },
};

export const viewport: Viewport = {
  themeColor: "#211e26",
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

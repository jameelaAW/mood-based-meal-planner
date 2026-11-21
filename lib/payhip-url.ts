/**
 * Payhip product page for the SGD 12 one-time Full Access. Public (it's just
 * a link) and safe to import from client components. Defaults to the live
 * product so every environment — including Vercel previews, which don't get
 * production env vars — links straight to Payhip; NEXT_PUBLIC_PAYHIP_PRODUCT_URL
 * can still override it.
 */
export const PAYHIP_PRODUCT_URL =
  process.env.NEXT_PUBLIC_PAYHIP_PRODUCT_URL?.trim() || "https://payhip.com/b/taj5H";

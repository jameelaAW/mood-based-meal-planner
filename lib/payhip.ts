import { createHash, timingSafeEqual } from "crypto";

/**
 * Payhip product page for the SGD 12 one-time Full Access, e.g.
 * https://payhip.com/b/AbC12. Public (it's just a link), so NEXT_PUBLIC_.
 * When unset, the pricing page falls back to the existing Stripe checkout.
 */
export const PAYHIP_PRODUCT_URL = process.env.NEXT_PUBLIC_PAYHIP_PRODUCT_URL?.trim() || "";

/** The product code at the end of the Payhip URL ("AbC12" above). */
export function payhipPermalink(url: string = PAYHIP_PRODUCT_URL): string {
  return url.replace(/\/+$/, "").split("/").pop() ?? "";
}

/**
 * Payhip signs every webhook with sha256(your API key) — see
 * https://help.payhip.com/article/115-webhooks ("Key notes").
 */
export function isValidPayhipSignature(signature: unknown): boolean {
  const apiKey = process.env.PAYHIP_API_KEY;
  if (!apiKey || typeof signature !== "string") return false;
  const expected = createHash("sha256").update(apiKey).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

import { createHash, timingSafeEqual } from "crypto";

import { PAYHIP_PRODUCT_URL } from "@/lib/payhip-url";

// The product URL lives in lib/payhip-url.ts so client components can use it
// without pulling in the Node crypto code below.
export { PAYHIP_PRODUCT_URL };

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

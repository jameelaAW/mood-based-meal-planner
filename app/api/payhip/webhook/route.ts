import { NextResponse } from "next/server";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { payhipPermalink, PAYHIP_PRODUCT_URL } from "@/lib/payhip";

interface PayhipItem {
  product_key?: string; // e.g. "taj5H"
  product_permalink?: string; // e.g. "https://payhip.com/b/taj5H"
}

interface PayhipEvent {
  id?: string;
  email?: string;
  type?: string;
  items?: PayhipItem[];
  signature?: string;
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a.toLowerCase());
  const y = Buffer.from(b.toLowerCase());
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Payhip's docs describe signature = sha256(API key). Some accounts send an
 * HMAC of the request body instead, so accept either — both need the key.
 */
function verifySignature(rawBody: string, body: Record<string, unknown>, headerSig: string | null): string | null {
  const apiKey = process.env.PAYHIP_API_KEY?.trim();
  if (!apiKey) return null;

  const sent = [typeof body.signature === "string" ? body.signature : null, headerSig].filter(
    (v): v is string => !!v,
  );
  if (sent.length === 0) return null;

  const { signature: _omit, ...withoutSig } = body;
  const candidates: Record<string, string> = {
    sha256_key: createHash("sha256").update(apiKey).digest("hex"),
    hmac_raw_body: createHmac("sha256", apiKey).update(rawBody).digest("hex"),
    hmac_body_without_signature: createHmac("sha256", apiKey).update(JSON.stringify(withoutSig)).digest("hex"),
  };

  for (const sig of sent) {
    for (const [method, expected] of Object.entries(candidates)) {
      if (safeEqual(sig, expected)) return method;
    }
  }
  return null;
}

/**
 * Payhip webhook — set in Payhip under Settings → Developer to
 * https://<your-domain>/api/payhip/webhook. Records Full Access purchases by
 * buyer email; access is picked up by getCurrentUserTier() on the buyer's
 * next page load.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const contentType = req.headers.get("content-type") ?? "";

  let body: PayhipEvent & Record<string, unknown>;
  try {
    if (contentType.includes("application/x-www-form-urlencoded")) {
      body = Object.fromEntries(new URLSearchParams(rawBody)) as PayhipEvent & Record<string, unknown>;
      if (typeof body.items === "string") body.items = JSON.parse(body.items as unknown as string);
    } else {
      body = JSON.parse(rawBody);
    }
  } catch {
    console.error("payhip webhook: could not parse body", { contentType, preview: rawBody.slice(0, 300) });
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const headerSig = req.headers.get("x-payhip-signature") ?? req.headers.get("signature");
  const method = verifySignature(rawBody, body, headerSig);
  if (!method) {
    // Diagnostic only — no secrets: field names, and the first 8 chars of
    // what was sent vs. what we expected.
    const apiKey = process.env.PAYHIP_API_KEY?.trim() ?? "";
    console.error("payhip webhook: signature mismatch", {
      keySet: apiKey.length > 0,
      keyLength: apiKey.length,
      contentType,
      fields: Object.keys(body),
      headers: Array.from(req.headers.keys()),
      sentSignature: String(body.signature ?? headerSig ?? "none").slice(0, 8),
      expectedSha256Key: createHash("sha256").update(apiKey).digest("hex").slice(0, 8),
    });
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }
  console.log("payhip webhook: verified via", method, "type:", body.type);

  // Only the app's Full Access product unlocks the app — planner or other
  // shop sales on the same Payhip store are acknowledged and ignored.
  const appPermalink = payhipPermalink(PAYHIP_PRODUCT_URL);
  const boughtApp =
    !!appPermalink &&
    (body.items ?? []).some(
      (i) => i.product_key === appPermalink || payhipPermalink(i.product_permalink ?? "") === appPermalink,
    );
  if (!boughtApp) return NextResponse.json({ ignored: true });

  const email = body.email?.trim().toLowerCase();
  if (!body.id || !email) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const status = body.type === "paid" ? "paid" : body.type === "refunded" ? "refunded" : null;
  if (!status) return NextResponse.json({ ignored: true });

  const admin = createAdminClient();
  const { error } = await admin.from("payhip_purchases").upsert(
    {
      transaction_id: body.id,
      email,
      product_permalink: appPermalink,
      status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "transaction_id" },
  );

  if (error) {
    console.error("payhip webhook: failed to record purchase", error);
    // Non-200 makes Payhip retry (hourly, up to 3 times).
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

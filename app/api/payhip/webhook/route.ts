import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidPayhipSignature, payhipPermalink, PAYHIP_PRODUCT_URL } from "@/lib/payhip";

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

/**
 * Payhip webhook — set in Payhip under Settings → Developer to
 * https://<your-domain>/api/payhip/webhook. Records Full Access purchases by
 * buyer email; access is picked up by getCurrentUserTier() on the buyer's
 * next page load.
 */
export async function POST(req: Request) {
  let body: PayhipEvent;
  try {
    body = (await req.json()) as PayhipEvent;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isValidPayhipSignature(body.signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

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

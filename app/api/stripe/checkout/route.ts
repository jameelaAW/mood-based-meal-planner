import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserId } from "@/lib/auth";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "auth_required", message: "Sign in to subscribe." }, { status: 401 });
  }

  let body: { plan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const plan = body.plan;
  if (plan !== "pro" && plan !== "pro_plus") {
    return NextResponse.json({ error: "invalid_plan", message: "Unknown plan." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id;
  if (customerId) {
    // A customer ID on file isn't guaranteed valid for the *current* Stripe
    // key — e.g. it was created against test mode before switching to live,
    // or was deleted in the Stripe dashboard. Verify before reusing it.
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) customerId = undefined;
    } catch {
      customerId = undefined;
    }
  }

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user?.email,
      metadata: { supabase_user_id: userId },
    });
    customerId = customer.id;

    await admin.from("subscriptions").upsert(
      { user_id: userId, stripe_customer_id: customerId, plan_tier: "free", status: "incomplete" },
      { onConflict: "user_id" },
    );
  }

  const origin = new URL(req.url).origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: STRIPE_PRICE_IDS[plan], quantity: 1 }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: { supabase_user_id: userId, plan },
      subscription_data: { metadata: { supabase_user_id: userId, plan } },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("stripe checkout session creation failed:", err);
    return NextResponse.json(
      { error: "checkout_failed", message: "Couldn't start checkout — please try again." },
      { status: 500 },
    );
  }
}

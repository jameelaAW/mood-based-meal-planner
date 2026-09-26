import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

async function grantFullAccess(session: Stripe.Checkout.Session) {
  const admin = createAdminClient();
  const userId = session.metadata?.supabase_user_id;

  const update = {
    stripe_checkout_session_id: session.id,
    plan_tier: "paid",
    status: "active",
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    await admin.from("subscriptions").update(update).eq("user_id", userId);
  } else {
    // Metadata missing (shouldn't happen via our own checkout flow) — fall
    // back to matching on the Stripe customer we already have on file.
    await admin.from("subscriptions").update(update).eq("stripe_customer_id", session.customer as string);
  }
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "invalid_signature", message: (err as Error).message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "payment" && session.payment_status === "paid") {
        await grantFullAccess(session);
      }
    }
  } catch (err) {
    console.error("stripe webhook handler error:", err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

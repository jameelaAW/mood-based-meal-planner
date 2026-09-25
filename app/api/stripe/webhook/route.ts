import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";

function planFromPriceId(priceId: string | undefined): "pro" | "pro_plus" | "free" {
  if (priceId === STRIPE_PRICE_IDS.pro) return "pro";
  if (priceId === STRIPE_PRICE_IDS.pro_plus) return "pro_plus";
  return "free";
}

async function upsertFromSubscription(sub: Stripe.Subscription) {
  const admin = createAdminClient();
  const userId = sub.metadata?.supabase_user_id;
  const item = sub.items.data[0];
  const priceId = item?.price.id;
  // current_period_end lives on the subscription item, not the subscription
  // itself, as of Stripe's newer API versions.
  const periodEndRaw = item?.current_period_end;

  const update = {
    stripe_subscription_id: sub.id,
    plan_tier: planFromPriceId(priceId),
    status: sub.status,
    current_period_end: periodEndRaw ? new Date(periodEndRaw * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    await admin.from("subscriptions").update(update).eq("user_id", userId);
  } else {
    // Metadata missing (e.g. subscription created outside our checkout flow) —
    // fall back to matching on the Stripe customer we already have on file.
    await admin.from("subscriptions").update(update).eq("stripe_customer_id", sub.customer as string);
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
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await upsertFromSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertFromSubscription(sub);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("stripe webhook handler error:", err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

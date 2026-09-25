import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserId } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "auth_required", message: "Sign in first." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data?.stripe_customer_id) {
    return NextResponse.json(
      { error: "no_subscription", message: "You don't have a subscription yet." },
      { status: 404 },
    );
  }

  const origin = new URL(req.url).origin;
  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${origin}/`,
  });

  return NextResponse.json({ url: session.url });
}

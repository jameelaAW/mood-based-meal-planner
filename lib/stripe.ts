import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PRICE_IDS = {
  pro: process.env.STRIPE_PRICE_PRO!,
  pro_plus: process.env.STRIPE_PRICE_PLUS!,
} as const;

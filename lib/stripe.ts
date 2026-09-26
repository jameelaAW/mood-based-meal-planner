import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PRICE_FULL_ACCESS = process.env.STRIPE_PRICE_FULL_ACCESS!;

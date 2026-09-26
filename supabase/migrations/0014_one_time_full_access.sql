-- Replace tiered recurring subscriptions (free/pro/pro_plus at $3-$6/mo)
-- with a single one-time "Full Access" purchase ($12). Existing paying
-- customers are grandfathered into full access at no extra charge; their
-- recurring Stripe subscriptions were canceled manually so they are not
-- billed again under the old model.

alter table subscriptions rename column stripe_subscription_id to stripe_checkout_session_id;

alter table subscriptions drop constraint if exists subscriptions_plan_tier_check;

update subscriptions set plan_tier = 'paid', status = 'active' where plan_tier in ('pro', 'pro_plus');

alter table subscriptions add constraint subscriptions_plan_tier_check check (plan_tier in ('free', 'paid'));

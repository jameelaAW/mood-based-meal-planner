-- Stripe subscriptions: one row per signed-in user who has ever started
-- checkout. plan_tier drives getCurrentUserTier() once billing is live.
-- Only the webhook (service role) writes this table; users can read their
-- own row to show their current plan.

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  plan_tier text not null default 'free' check (plan_tier in ('free', 'pro', 'pro_plus')),
  status text not null default 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "subscriptions_select_own" on subscriptions for select
  using (auth.uid() = user_id);

-- No insert/update/delete policies for anon/authenticated roles: only the
-- webhook route (using the service_role key, which bypasses RLS) writes here.

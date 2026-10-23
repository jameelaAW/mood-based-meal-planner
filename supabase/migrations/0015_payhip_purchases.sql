-- Payhip one-time "Full Access" purchases (SGD 12), recorded by the Payhip
-- webhook (/api/payhip/webhook). Payhip only gives us the buyer's email, so
-- access is matched to the signed-in user by email in getCurrentUserTier().
-- That works in either order: buy first then sign up, or sign up then buy.
--
-- Only the webhook (service role) writes or reads this table; no RLS policies
-- for anon/authenticated roles, so buyers' emails are never exposed.

create table if not exists payhip_purchases (
  transaction_id text primary key,
  email text not null,
  product_permalink text,
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payhip_purchases_email_idx on payhip_purchases (lower(email));

alter table payhip_purchases enable row level security;

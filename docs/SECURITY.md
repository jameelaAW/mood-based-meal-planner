# Security

## Secret Handling
- `OPENAI_API_KEY` lives only in Vercel environment variables — never in client code or committed files
- Supabase `service_role` key used only in server-side API routes; client uses the anon key
- `.env.local` is gitignored; `.env.example` lists key names with no values

## Permission Model (v1 → lock-down)
- v1: RLS policies are permissive (`using (true)`) — demo works without login
- Lock-down sprint: policies replaced with `auth.uid() = user_id`; anonymous rows become unowned and read-only
- No user can read or write another user's rows after lock-down

## Approved Tools Rule
- AI calls happen only inside named server-side functions (`interpret_mood`, `rank_meals`, `generate_why_it_fits`, `generate_shopping_list`)
- No `eval`, no dynamic tool dispatch, no raw `run_any` patterns
- Each tool logs its input + output before returning

## Audit Principle
- Every AI write is stored with `source`, `confidence`, and `review_status`
- `review_status` starts `'unreviewed'`; a future admin screen can flip to `'approved'` or `'rejected'`
- Agent inherits the same Supabase RLS permissions as the session that triggered it — it cannot escalate

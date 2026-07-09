# Mood-Based Meal Planner

**Problem:** Most meal planners ignore how people actually feel, even though emotional
eating is universal — this app intercepts that moment instead of fighting it.
**Solution:** Pick a mood, get a recipe matched to it with a plain-language "why this
fits" note, then generate a categorised, checkable shopping list in one click — no
login required. **Outcome:** A fully working, deployed end-to-end flow (mood → recipe →
shopping list → persisted check-offs) backed by a real Postgres database, with a
rule-based matching engine that keeps working even if the AI layer is unavailable.

<!-- Add a screenshot of the homepage + recipe card here before sharing, e.g.: -->
<!-- ![Homepage with mood picker and recipe card](./docs/screenshot-homepage.png) -->

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, Server Actions) |
| Language | TypeScript strict |
| Styles | Tailwind CSS v4 (CSS-first) |
| Auth + DB | Supabase (`@supabase/ssr`, Postgres + RLS) |
| AI | OpenAI GPT-4o (why-it-fits copy, mood interpretation) |
| Deploy | Vercel |

## How it works

1. Visitor picks a mood (or types free text) on the homepage
2. `/api/suggest-meal` tag-filters + scores candidate meals, asks GPT-4o for a
   tailored "why this fits" sentence (falls back to seeded rule-based copy if the
   AI call fails or `OPENAI_API_KEY` isn't set), and persists a `mood_checkin` row
3. The recipe card renders straight from that DB row — no client-side AI calls
4. "Build my shopping list" aggregates the recipe's ingredients into a new
   `shopping_list` + `shopping_list_items` rows, grouped by category
5. Checking an item PATCHes its state in the database and survives a refresh

See `docs/` for the full PRD, architecture, data model, and sprint plan this was
built from.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase + OpenAI keys
npm run dev
```

Open http://localhost:3000. The database schema lives in
`supabase/migrations/0001_init.sql` — run it against your Supabase project's SQL
Editor before your first local run.

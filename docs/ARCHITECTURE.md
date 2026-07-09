# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router)
- **Database:** Supabase (Postgres + RLS)
- **AI:** OpenAI GPT-4o via server-side API route
- **Hosting:** Vercel
- **Images:** Unsplash URLs stored in DB

## What to Build Now vs Later
| Now (v1) | Later |
|---|---|
| Mood picker → rule-based meal match + AI why-it-fits | User auth + saved history |
| Recipe card + shopping list generator | Swap / regenerate meal |
| Anonymous, fully open | Per-user RLS lock-down |
| 6 seeded meals | Dietary filters, macro targets |

## Key User Action — Step by Step
1. Visitor selects a mood on the homepage form
2. Browser POSTs to `/api/suggest-meal` with `{ mood_label, free_text }`
3. Server matches mood → candidate meals from DB (rule-based tag filter)
4. Server calls OpenAI to pick the best fit and write `why_it_fits` copy (stores value + source + confidence + review_status)
5. `mood_checkin` row written to DB with `suggested_meal_id`
6. Recipe card rendered from DB row — no client-side AI calls
7. Visitor clicks "Build shopping list" → POST `/api/generate-shopping-list`
8. Server aggregates ingredients, inserts `shopping_list` + `shopping_list_items` rows
9. Shopping list page reads from DB and renders grouped, checkable items
10. Checking an item PATCHes `shopping_list_items.checked` in DB

## Why the Core Runs Without AI
Mood→meal matching uses tag arrays on the `meals` table. If the OpenAI call fails, the rule-based match still returns a valid meal; `why_it_fits` falls back to the seeded static copy.

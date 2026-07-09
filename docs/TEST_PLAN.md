# Test Plan

## V1 Success Scenario (manual)
1. Open the deployed app URL — homepage renders with mood picker (no login prompt)
2. Click **"Stressed"** — loading skeleton appears, then recipe card renders with title, image, macros, and why-it-fits text
3. Check Supabase `mood_checkins` table — one new row exists with correct `mood_label` and `suggested_meal_id`
4. Click **"Build my shopping list"** — navigates to `/list/[id]`
5. Verify list shows grouped categories (Produce, Protein, Grains, Pantry, Dairy) with ingredient rows
6. Check one item — page updates immediately; refresh the page — item stays checked
7. Check Supabase `shopping_list_items` — `checked = true` on that row

Pass: all 7 steps complete with no errors in console or UI.

---

## Empty States
| Scenario | Expected |
|---|---|
| User opens app with no prior check-in | Hero + mood picker only; no list section |
| Mood has no matching meal in DB | "We don't have a match yet — try a different mood" message shown |
| Shopping list has no items (edge case) | "Nothing to show — regenerate from your recipe" prompt |

## Error States
| Scenario | Expected |
|---|---|
| OpenAI API key missing / rate-limited | Rule-based meal returned; why-it-fits uses seeded static copy; no crash |
| Supabase write fails on checkin | Error toast: "Something went wrong — please try again"; no broken state |
| `/list/[id]` with invalid ID | 404 page with link back to home |

## AI Field Checks
- `why_it_fits_source` is never null on a returned meal
- `why_it_fits_confidence` is between 0 and 1
- `why_it_fits_review_status` defaults to `'unreviewed'`

## Secrets Check
- Open browser DevTools → Network tab → inspect `/api/suggest-meal` response: no `OPENAI_API_KEY` visible
- View page source: no environment variable values present

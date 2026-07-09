# Product Requirements — Mood-Based Meal Planner

## Problem
Most meal planners ignore how you actually feel. People eat for their emotions — they just do it badly. This app intercepts that moment: ask "How are you today?", then suggest a meal that meets the emotional need *and* the nutritional one, and build a shopping list from it.

## Target User
Anyone who eats. Primary demo audience: recruiters and product folk who can try it in 30 seconds.

## Core Objects
| Object | Purpose |
|---|---|
| `meal` | Recipe with mood tags, ingredients, macros, why-it-fits copy |
| `mood_checkin` | A single "how are you" event → linked to a suggested meal |
| `shopping_list` | Aggregated ingredient list for the week, tied to a check-in |
| `shopping_list_item` | One ingredient row, checkable |

## MVP Must-Haves (v1)
- [ ] Mood picker (stressed / sluggish / sad / happy / anxious / unfocused + free text)
- [ ] AI-powered meal suggestion matched to mood, rendered as a recipe card
- [ ] "Why this meal?" copy on every card
- [ ] One-click shopping list generated from the suggestion
- [ ] Shopping list is checkable and persists state
- [ ] Works for anonymous visitors — no login required
- [ ] 5+ demo meals seeded so app looks alive on first load

## Non-Goals (v1)
- User accounts / auth
- Dietary filters
- Multiple meals per day
- Calorie targets
- Grocery store integrations

## Success Criteria
**End-to-end scenario:** A visitor lands on the homepage, picks "Stressed", sees a lemon herb pasta card with a "why it fits" note, clicks "Build my shopping list", and sees a categorised, checkable grocery list — all within 30 seconds, no login, no dead buttons.

## Definition of Done
Pass: the above scenario completes on the deployed Vercel URL with real DB reads/writes confirmed in Supabase dashboard. Every button persists data. Empty and error states render without crashes.

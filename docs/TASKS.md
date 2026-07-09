# Tasks & Sprints

## Sprint 1 — DB, seed data & mood→meal engine
**Goal:** The core action works: pick a mood, get a real recipe card from the DB.

- [ ] Run migration SQL (meals, mood_checkins, shopping_lists, shopping_list_items, saved_meals)
- [ ] Confirm 6 seeded demo meals visible in Supabase dashboard
- [ ] `/api/suggest-meal` POST: mood_label → tag-filter meals → GPT-4o why-it-fits → persist mood_checkin → return meal
- [ ] Mood picker UI (6 emotion buttons + optional free-text input)
- [ ] Recipe card component: image, title, description, why-it-fits, macros, ingredients list
- [ ] Loading state (skeleton card), error state (toast), empty state ("no match — try another mood")
- [ ] Verify: mood_checkin row appears in DB after submit

**Definition of Done:** Picking "Stressed" returns the pasta card with a why-it-fits sentence; the mood_checkin row exists in Supabase; no crashes on empty or error.

---

## Sprint 2 — Shopping list generation ✅ v1 FUNCTIONAL MILESTONE
**Goal:** Full end-to-end flow works; recruiter can demo it in 30 seconds.

- [ ] `/api/generate-shopping-list` POST: checkin_id → aggregate ingredients → insert shopping_list + items rows
- [ ] Shopping list page `/list/[id]`: grouped by category, checkbox per item
- [ ] PATCH `/api/shopping-list-items/[id]` to toggle `checked`
- [ ] Homepage shows latest active shopping list if one exists
- [ ] "Build my shopping list" button on recipe card → navigates to list page
- [ ] Empty state on homepage: hero + mood picker (no list yet)
- [ ] Error state: API failure shows inline message, does not crash page
- [ ] Verify: items rows update `checked` in DB when clicked

**Definition of Done:** Full scenario (mood → recipe → shopping list → check off item) works on deployed Vercel URL with live DB writes confirmed.

---

## Sprint 3 — Polish & portfolio readiness
**Goal:** First impression is sharp; shareable as a portfolio piece.

- [ ] Hero copy: *"Tell us how you feel. We'll tell you what to eat."*
- [ ] Mood → recipe transition animation
- [ ] Mobile-responsive layout (test at 375px)
- [ ] OG image + meta description for social sharing
- [ ] Case-study README with screenshots and 3-sentence problem/solution/outcome
- [ ] Favicon and page title set

**Definition of Done:** App looks polished on mobile; link preview shows OG image; README includes at least one screenshot.

---

## Sprint 4 — Lock it down
**Goal:** Real users can sign in; their data is private.

- [ ] Supabase Auth: email + Google provider
- [ ] Sign-in / sign-up pages (not on the demo path)
- [ ] Set `user_id` on mood_checkins and shopping_lists at creation if session exists
- [ ] Replace permissive RLS policies with `auth.uid() = user_id` owner policies
- [ ] Mood history page: last 7 check-ins for logged-in user
- [ ] Saved meals: heart icon on recipe card, saved_meals table
- [ ] Anonymous visitors still see demo meals; sign-in required to save history

**Definition of Done:** Logged-in user A cannot read logged-in user B's check-ins (confirmed via Supabase policy tester). Anonymous visitor sees demo content without error.

---

## Gantt (sprint → week)
| Task area | S1 | S2 | S3 | S4 |
|---|---|---|---|---|
| DB schema + seed | ✓ | | | |
| Mood → meal API | ✓ | | | |
| Shopping list API + UI | | ✓ | | |
| Homepage flow | ✓ | ✓ | | |
| Polish + mobile | | | ✓ | |
| Auth + RLS lock-down | | | | ✓ |

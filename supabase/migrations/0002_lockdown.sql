-- Sprint 4: lock it down.
-- meals is intentionally left alone — it's shared demo content with no owner.
-- The four user-owned tables get owner-aware policies:
--   - anonymous (user_id is null) rows stay visible to everyone, and writable
--     only by other anonymous (unauthenticated) requests — this keeps the v1
--     no-login demo path working exactly as before.
--   - once a row has an owner, only that owner can read or write it.

-- mood_checkins
drop policy if exists "mood_checkins_v1_read" on mood_checkins;
drop policy if exists "mood_checkins_v1_write" on mood_checkins;

create policy "mood_checkins_select" on mood_checkins for select
  using (user_id is null or auth.uid() = user_id);

create policy "mood_checkins_insert" on mood_checkins for insert
  with check ((auth.uid() is null and user_id is null) or auth.uid() = user_id);

create policy "mood_checkins_update" on mood_checkins for update
  using ((auth.uid() is null and user_id is null) or auth.uid() = user_id)
  with check ((auth.uid() is null and user_id is null) or auth.uid() = user_id);

create policy "mood_checkins_delete" on mood_checkins for delete
  using (auth.uid() = user_id);

-- shopping_lists
drop policy if exists "shopping_lists_v1_read" on shopping_lists;
drop policy if exists "shopping_lists_v1_write" on shopping_lists;

create policy "shopping_lists_select" on shopping_lists for select
  using (user_id is null or auth.uid() = user_id);

create policy "shopping_lists_insert" on shopping_lists for insert
  with check ((auth.uid() is null and user_id is null) or auth.uid() = user_id);

create policy "shopping_lists_update" on shopping_lists for update
  using ((auth.uid() is null and user_id is null) or auth.uid() = user_id)
  with check ((auth.uid() is null and user_id is null) or auth.uid() = user_id);

create policy "shopping_lists_delete" on shopping_lists for delete
  using (auth.uid() = user_id);

-- shopping_list_items (carries its own user_id, set at insert time to match
-- the parent list's owner so item-level RLS doesn't need a join)
drop policy if exists "shopping_list_items_v1_read" on shopping_list_items;
drop policy if exists "shopping_list_items_v1_write" on shopping_list_items;

create policy "shopping_list_items_select" on shopping_list_items for select
  using (user_id is null or auth.uid() = user_id);

create policy "shopping_list_items_insert" on shopping_list_items for insert
  with check ((auth.uid() is null and user_id is null) or auth.uid() = user_id);

create policy "shopping_list_items_update" on shopping_list_items for update
  using ((auth.uid() is null and user_id is null) or auth.uid() = user_id)
  with check ((auth.uid() is null and user_id is null) or auth.uid() = user_id);

create policy "shopping_list_items_delete" on shopping_list_items for delete
  using (auth.uid() = user_id);

-- saved_meals requires an account — no anonymous saves in v1 ("sign-in
-- required to save history" per docs/TASKS.md Sprint 4).
drop policy if exists "saved_meals_v1_read" on saved_meals;
drop policy if exists "saved_meals_v1_write" on saved_meals;

create policy "saved_meals_select" on saved_meals for select
  using (auth.uid() = user_id);

create policy "saved_meals_insert" on saved_meals for insert
  with check (auth.uid() = user_id);

create policy "saved_meals_delete" on saved_meals for delete
  using (auth.uid() = user_id);

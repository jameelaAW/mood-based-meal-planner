create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  title text not null,
  description text,
  mood_tags text[] not null default '{}',
  ingredients jsonb not null default '[]',
  instructions text,
  image_url text,
  prep_minutes int,
  calories int,
  protein_g int,
  carbs_g int,
  fat_g int,
  why_it_fits text,
  why_it_fits_source text,
  why_it_fits_confidence numeric,
  why_it_fits_review_status text default 'unreviewed'
);
alter table meals enable row level security;
drop policy if exists "meals_v1_read" on meals;
create policy "meals_v1_read" on meals for select using (true);
drop policy if exists "meals_v1_write" on meals;
create policy "meals_v1_write" on meals for all using (true) with check (true);

create table if not exists mood_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  mood_label text not null,
  mood_score int,
  free_text text,
  suggested_meal_id uuid references meals(id),
  ai_mood_interpretation text,
  ai_mood_interpretation_source text,
  ai_mood_interpretation_confidence numeric,
  ai_mood_interpretation_review_status text default 'unreviewed'
);
alter table mood_checkins enable row level security;
drop policy if exists "mood_checkins_v1_read" on mood_checkins;
create policy "mood_checkins_v1_read" on mood_checkins for select using (true);
drop policy if exists "mood_checkins_v1_write" on mood_checkins;
create policy "mood_checkins_v1_write" on mood_checkins for all using (true) with check (true);

create table if not exists shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  checkin_id uuid references mood_checkins(id),
  week_label text,
  status text not null default 'active'
);
alter table shopping_lists enable row level security;
drop policy if exists "shopping_lists_v1_read" on shopping_lists;
create policy "shopping_lists_v1_read" on shopping_lists for select using (true);
drop policy if exists "shopping_lists_v1_write" on shopping_lists;
create policy "shopping_lists_v1_write" on shopping_lists for all using (true) with check (true);

create table if not exists shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  shopping_list_id uuid references shopping_lists(id) on delete cascade,
  ingredient_name text not null,
  quantity text,
  category text,
  checked boolean not null default false
);
alter table shopping_list_items enable row level security;
drop policy if exists "shopping_list_items_v1_read" on shopping_list_items;
create policy "shopping_list_items_v1_read" on shopping_list_items for select using (true);
drop policy if exists "shopping_list_items_v1_write" on shopping_list_items;
create policy "shopping_list_items_v1_write" on shopping_list_items for all using (true) with check (true);

create table if not exists saved_meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  meal_id uuid references meals(id) on delete cascade
);
alter table saved_meals enable row level security;
drop policy if exists "saved_meals_v1_read" on saved_meals;
create policy "saved_meals_v1_read" on saved_meals for select using (true);
drop policy if exists "saved_meals_v1_write" on saved_meals;
create policy "saved_meals_v1_write" on saved_meals for all using (true) with check (true);

insert into meals (id, title, description, mood_tags, ingredients, instructions, image_url, prep_minutes, calories, protein_g, carbs_g, fat_g, why_it_fits, why_it_fits_source, why_it_fits_confidence, why_it_fits_review_status) values
(
  gen_random_uuid(),
  'Lemon Herb Pasta with Spinach',
  'A light, satisfying pasta with garlic, lemon zest, and wilted spinach.',
  ARRAY['stressed','overwhelmed','anxious'],
  '[{"name":"spaghetti","qty":"200g","category":"Grains"},{"name":"baby spinach","qty":"2 cups","category":"Produce"},{"name":"garlic","qty":"3 cloves","category":"Produce"},{"name":"lemon","qty":"1","category":"Produce"},{"name":"parmesan","qty":"30g","category":"Dairy"},{"name":"olive oil","qty":"2 tbsp","category":"Pantry"}]',
  'Boil pasta. Sauté garlic in olive oil, add spinach until wilted. Toss with pasta, lemon zest, and parmesan.',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
  20, 480, 18, 62, 14,
  'Complex carbs boost serotonin; lemon and garlic aromas are calming.',
  'rule-engine-v1', 0.85, 'unreviewed'
),
(
  gen_random_uuid(),
  'High-Protein Greek Salad Bowl',
  'Grilled chicken, chickpeas, cucumber, tomato, and feta on a bed of romaine.',
  ARRAY['sluggish','tired','low-energy'],
  '[{"name":"chicken breast","qty":"150g","category":"Protein"},{"name":"chickpeas","qty":"1/2 cup","category":"Protein"},{"name":"romaine lettuce","qty":"2 cups","category":"Produce"},{"name":"cucumber","qty":"1/2","category":"Produce"},{"name":"cherry tomatoes","qty":"10","category":"Produce"},{"name":"feta cheese","qty":"40g","category":"Dairy"},{"name":"olive oil","qty":"1 tbsp","category":"Pantry"}]',
  'Grill chicken. Combine all vegetables. Top with chicken, chickpeas, feta. Drizzle olive oil.',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  15, 420, 42, 24, 16,
  'High protein and iron from chicken + chickpeas combat fatigue and restore energy.',
  'rule-engine-v1', 0.90, 'unreviewed'
),
(
  gen_random_uuid(),
  'Golden Turmeric Lentil Soup',
  'Warming red lentil soup with turmeric, ginger, and coconut milk.',
  ARRAY['sad','low','melancholy'],
  '[{"name":"red lentils","qty":"1 cup","category":"Pantry"},{"name":"coconut milk","qty":"400ml","category":"Pantry"},{"name":"turmeric","qty":"1 tsp","category":"Pantry"},{"name":"ginger","qty":"1 tsp","category":"Pantry"},{"name":"onion","qty":"1","category":"Produce"},{"name":"vegetable stock","qty":"500ml","category":"Pantry"}]',
  'Sauté onion. Add spices, lentils, stock. Simmer 20 min. Stir in coconut milk.',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  30, 390, 20, 48, 10,
  'Turmeric''s curcumin has mood-lifting properties; warm soup provides emotional comfort.',
  'rule-engine-v1', 0.82, 'unreviewed'
),
(
  gen_random_uuid(),
  'Smashed Avocado & Poached Eggs on Sourdough',
  'Creamy avocado, perfectly poached eggs, chilli flakes on thick sourdough.',
  ARRAY['happy','great','energetic'],
  '[{"name":"sourdough bread","qty":"2 slices","category":"Grains"},{"name":"avocado","qty":"1","category":"Produce"},{"name":"eggs","qty":"2","category":"Protein"},{"name":"chilli flakes","qty":"pinch","category":"Pantry"},{"name":"lemon juice","qty":"1 tsp","category":"Pantry"}]',
  'Toast sourdough. Smash avocado with lemon. Poach eggs 3 min. Assemble, top with chilli flakes.',
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
  15, 440, 22, 38, 22,
  'Healthy fats sustain your great energy; protein keeps the mood stable all morning.',
  'rule-engine-v1', 0.88, 'unreviewed'
),
(
  gen_random_uuid(),
  'Walnut & Berry Overnight Oats',
  'Creamy oats soaked overnight, topped with mixed berries and walnuts.',
  ARRAY['anxious','nervous','restless'],
  '[{"name":"rolled oats","qty":"80g","category":"Grains"},{"name":"almond milk","qty":"200ml","category":"Dairy"},{"name":"mixed berries","qty":"1/2 cup","category":"Produce"},{"name":"walnuts","qty":"30g","category":"Pantry"},{"name":"honey","qty":"1 tsp","category":"Pantry"},{"name":"chia seeds","qty":"1 tbsp","category":"Pantry"}]',
  'Mix oats, milk, chia, honey. Refrigerate overnight. Top with berries and walnuts.',
  'https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=800',
  5, 380, 14, 52, 14,
  'Magnesium-rich walnuts and slow-release oats reduce cortisol and ease nervous tension.',
  'rule-engine-v1', 0.87, 'unreviewed'
),
(
  gen_random_uuid(),
  'Salmon & Roasted Sweet Potato Bowl',
  'Omega-3 rich salmon fillet with caramelised sweet potato and steamed broccoli.',
  ARRAY['unfocused','distracted','foggy'],
  '[{"name":"salmon fillet","qty":"180g","category":"Protein"},{"name":"sweet potato","qty":"1 medium","category":"Produce"},{"name":"broccoli","qty":"1 cup","category":"Produce"},{"name":"olive oil","qty":"1 tbsp","category":"Pantry"},{"name":"soy sauce","qty":"1 tbsp","category":"Pantry"},{"name":"sesame seeds","qty":"1 tsp","category":"Pantry"}]',
  'Roast sweet potato 25 min. Pan-fry salmon 4 min each side. Steam broccoli. Assemble with soy drizzle.',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
  30, 510, 38, 34, 20,
  'Omega-3s in salmon sharpen focus; complex carbs from sweet potato fuel sustained concentration.',
  'rule-engine-v1', 0.91, 'unreviewed'
);
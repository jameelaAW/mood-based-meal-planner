-- Sprint: meal variety + halal-only ingredients.
-- Adds 2 more meals per mood (on top of the original 6) so suggest-meal has
-- real variety to pick from instead of always returning the same recipe.
-- Every ingredient across the whole seed set (old + new) is halal-friendly:
-- no pork/bacon/ham, no alcohol (wine/beer/rum/liqueur), no non-halal gelatin.

insert into meals (id, title, description, mood_tags, ingredients, instructions, image_url, prep_minutes, calories, protein_g, carbs_g, fat_g, why_it_fits, why_it_fits_source, why_it_fits_confidence, why_it_fits_review_status) values
(
  gen_random_uuid(),
  'Chamomile Honey Rice Pudding',
  'Creamy rice pudding slow-cooked with chamomile-infused milk and honey.',
  ARRAY['stressed','overwhelmed'],
  '[{"name":"short-grain rice","qty":"1/2 cup","category":"Grains"},{"name":"whole milk","qty":"2 cups","category":"Dairy"},{"name":"chamomile tea bags","qty":"2","category":"Pantry"},{"name":"honey","qty":"2 tbsp","category":"Pantry"},{"name":"cinnamon","qty":"1/4 tsp","category":"Pantry"}]',
  'Steep chamomile in warm milk 5 min, remove bags. Simmer rice in the milk 25 min, stirring often. Stir in honey and cinnamon.',
  'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800',
  30, 340, 9, 58, 7,
  'Chamomile has a mild calming effect and warm milk-based comfort food lowers physical tension.',
  'rule-engine-v1', 0.84, 'unreviewed'
),
(
  gen_random_uuid(),
  'Miso-Glazed Salmon with Steamed Rice',
  'Pan-seared salmon glazed with miso and honey, served over steamed rice.',
  ARRAY['stressed','anxious'],
  '[{"name":"salmon fillet","qty":"180g","category":"Protein"},{"name":"white miso paste","qty":"1 tbsp","category":"Pantry"},{"name":"honey","qty":"1 tsp","category":"Pantry"},{"name":"steamed rice","qty":"1 cup","category":"Grains"},{"name":"scallions","qty":"2","category":"Produce"}]',
  'Mix miso and honey, brush onto salmon. Pan-sear 4 minutes each side. Serve over rice, top with sliced scallions.',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
  18, 460, 34, 32, 20,
  'Omega-3s in salmon help regulate cortisol; the umami glaze makes it deeply satisfying under stress.',
  'rule-engine-v1', 0.86, 'unreviewed'
),
(
  gen_random_uuid(),
  'Beef & Broccoli Stir-Fry',
  'Quick-seared beef strips with broccoli in a savoury garlic-ginger sauce.',
  ARRAY['sluggish','tired'],
  '[{"name":"beef sirloin","qty":"200g","category":"Protein"},{"name":"broccoli florets","qty":"2 cups","category":"Produce"},{"name":"garlic","qty":"2 cloves","category":"Produce"},{"name":"ginger","qty":"1 tsp","category":"Pantry"},{"name":"soy sauce","qty":"2 tbsp","category":"Pantry"},{"name":"jasmine rice","qty":"1 cup","category":"Grains"}]',
  'Sear beef strips 2 min per side, set aside. Stir-fry garlic, ginger, broccoli. Return beef, add soy sauce, toss. Serve over rice.',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
  18, 520, 40, 42, 18,
  'Iron-rich beef and quick-release rice carbs combat fatigue and restore alertness fast.',
  'rule-engine-v1', 0.88, 'unreviewed'
),
(
  gen_random_uuid(),
  'Spiced Chickpea & Sweet Potato Bowl',
  'Roasted sweet potato and spiced chickpeas over greens with tahini drizzle.',
  ARRAY['sluggish','low-energy'],
  '[{"name":"chickpeas","qty":"1.5 cups","category":"Protein"},{"name":"sweet potato","qty":"1 medium","category":"Produce"},{"name":"baby spinach","qty":"2 cups","category":"Produce"},{"name":"cumin","qty":"1 tsp","category":"Pantry"},{"name":"tahini","qty":"2 tbsp","category":"Pantry"}]',
  'Roast sweet potato and spiced chickpeas 25 min at 200°C. Serve over spinach, drizzle with tahini.',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  30, 410, 16, 56, 14,
  'Complex carbs and plant protein provide a steady energy release without a sugar crash.',
  'rule-engine-v1', 0.83, 'unreviewed'
),
(
  gen_random_uuid(),
  'Dark Chocolate Banana Smoothie Bowl',
  'Thick banana smoothie bowl with cacao, topped with berries and granola.',
  ARRAY['sad','low'],
  '[{"name":"frozen banana","qty":"2","category":"Produce"},{"name":"cacao powder","qty":"1 tbsp","category":"Pantry"},{"name":"almond milk","qty":"1/4 cup","category":"Dairy"},{"name":"mixed berries","qty":"1/2 cup","category":"Produce"},{"name":"granola","qty":"1/4 cup","category":"Pantry"}]',
  'Blend frozen banana, cacao, and almond milk until thick. Pour into a bowl, top with berries and granola.',
  'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
  10, 360, 8, 62, 9,
  'Cacao supports serotonin production; the ritual of a topped bowl adds a small moment of self-care.',
  'rule-engine-v1', 0.85, 'unreviewed'
),
(
  gen_random_uuid(),
  'Chicken Tikka with Basmati Rice',
  'Yogurt-marinated grilled chicken tikka with warm spices over basmati rice.',
  ARRAY['sad','melancholy'],
  '[{"name":"chicken thigh","qty":"200g","category":"Protein"},{"name":"plain yogurt","qty":"1/4 cup","category":"Dairy"},{"name":"garam masala","qty":"1 tsp","category":"Pantry"},{"name":"basmati rice","qty":"1 cup","category":"Grains"},{"name":"coriander","qty":"handful","category":"Produce"}]',
  'Marinate chicken in yogurt and garam masala 20 min. Grill or pan-sear until cooked through. Serve over basmati rice with coriander.',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  25, 470, 36, 44, 14,
  'Warm spices and a hearty, familiar dish offer grounding comfort on a low day.',
  'rule-engine-v1', 0.87, 'unreviewed'
),
(
  gen_random_uuid(),
  'Grilled Chicken Fajita Bowl',
  'Sizzled chicken and peppers with lime, served over rice with fresh salsa.',
  ARRAY['happy','energetic'],
  '[{"name":"chicken breast","qty":"180g","category":"Protein"},{"name":"bell peppers","qty":"2","category":"Produce"},{"name":"red onion","qty":"1/2","category":"Produce"},{"name":"lime","qty":"1","category":"Produce"},{"name":"rice","qty":"1 cup","category":"Grains"}]',
  'Sear sliced chicken and peppers with lime juice until charred at the edges. Serve over rice with fresh salsa.',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  20, 480, 38, 46, 12,
  'Bright citrus and lean protein match and sustain an already-good mood without weighing you down.',
  'rule-engine-v1', 0.86, 'unreviewed'
),
(
  gen_random_uuid(),
  'Berry & Yogurt Parfait',
  'Layered Greek yogurt, mixed berries, and honeyed granola.',
  ARRAY['happy','great'],
  '[{"name":"greek yogurt","qty":"1 cup","category":"Dairy"},{"name":"mixed berries","qty":"1 cup","category":"Produce"},{"name":"granola","qty":"1/2 cup","category":"Pantry"},{"name":"honey","qty":"1 tbsp","category":"Pantry"}]',
  'Layer yogurt, berries, and granola in a glass. Drizzle with honey.',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
  5, 320, 18, 44, 8,
  'A light, celebratory dish that matches a bright mood without any post-meal slump.',
  'rule-engine-v1', 0.89, 'unreviewed'
),
(
  gen_random_uuid(),
  'Chamomile & Almond Overnight Oats',
  'Overnight oats soaked in chamomile tea and almond milk, topped with sliced almonds.',
  ARRAY['anxious','nervous'],
  '[{"name":"rolled oats","qty":"80g","category":"Grains"},{"name":"almond milk","qty":"180ml","category":"Dairy"},{"name":"chamomile tea","qty":"1/4 cup brewed","category":"Pantry"},{"name":"sliced almonds","qty":"2 tbsp","category":"Pantry"},{"name":"honey","qty":"1 tsp","category":"Pantry"}]',
  'Mix oats, almond milk, and brewed chamomile. Refrigerate overnight. Top with sliced almonds and honey.',
  'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800',
  5, 340, 11, 46, 11,
  'Chamomile and slow-release oats work together to ease nervous energy before it builds.',
  'rule-engine-v1', 0.84, 'unreviewed'
),
(
  gen_random_uuid(),
  'Warm Ginger Beef Noodle Soup',
  'Comforting broth with tender beef, rice noodles, and fresh ginger.',
  ARRAY['anxious','restless'],
  '[{"name":"beef strips","qty":"150g","category":"Protein"},{"name":"rice noodles","qty":"100g","category":"Grains"},{"name":"beef broth","qty":"500ml","category":"Pantry"},{"name":"ginger","qty":"1 tbsp","category":"Pantry"},{"name":"bok choy","qty":"1 cup","category":"Produce"}]',
  'Simmer broth with ginger 10 min. Add beef and bok choy, cook through. Serve over rice noodles.',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  25, 420, 30, 40, 12,
  'A warm, slow-sipped broth gives restless energy something steady to settle into.',
  'rule-engine-v1', 0.85, 'unreviewed'
),
(
  gen_random_uuid(),
  'Herb-Crusted Baked Cod with Roasted Veg',
  'Flaky baked cod with a herb crust, served with roasted seasonal vegetables.',
  ARRAY['unfocused','distracted'],
  '[{"name":"cod fillet","qty":"180g","category":"Protein"},{"name":"parsley","qty":"2 tbsp chopped","category":"Produce"},{"name":"breadcrumbs","qty":"3 tbsp","category":"Pantry"},{"name":"carrots","qty":"1 cup","category":"Produce"},{"name":"zucchini","qty":"1","category":"Produce"}]',
  'Press herb-breadcrumb mix onto cod, bake 15 min at 200°C alongside roasted carrots and zucchini.',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  25, 400, 32, 30, 14,
  'Lean white fish and B-vitamin-rich vegetables support mental clarity and steady focus.',
  'rule-engine-v1', 0.87, 'unreviewed'
),
(
  gen_random_uuid(),
  'Turmeric Chicken & Quinoa Power Bowl',
  'Turmeric-spiced chicken over quinoa with roasted vegetables and a lemon-tahini drizzle.',
  ARRAY['unfocused','foggy'],
  '[{"name":"chicken breast","qty":"180g","category":"Protein"},{"name":"quinoa","qty":"3/4 cup","category":"Grains"},{"name":"turmeric","qty":"1 tsp","category":"Pantry"},{"name":"broccoli","qty":"1 cup","category":"Produce"},{"name":"tahini","qty":"1 tbsp","category":"Pantry"}]',
  'Season chicken with turmeric, pan-sear until cooked. Serve over quinoa with roasted broccoli and a tahini drizzle.',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
  25, 460, 38, 42, 14,
  'Turmeric and complex carbs from quinoa support sustained mental clarity through the afternoon.',
  'rule-engine-v1', 0.88, 'unreviewed'
);

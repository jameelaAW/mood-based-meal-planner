-- Sprint: expand meal variety further, one new recipe per mood.
-- Every ingredient is halal-friendly: no pork/bacon/ham, no alcohol
-- (wine/beer/rum/liqueur/mirin/sake), no non-halal gelatin.

insert into meals (id, title, description, mood_tags, ingredients, instructions, image_url, prep_minutes, calories, protein_g, carbs_g, fat_g, why_it_fits, why_it_fits_source, why_it_fits_confidence, why_it_fits_review_status) values
(
  gen_random_uuid(),
  'Turmeric Ginger Chicken Soup',
  'A warming, golden chicken soup with turmeric, ginger, and soft noodles.',
  ARRAY['stressed','overwhelmed','anxious'],
  '[{"name":"chicken breast","qty":"200g","category":"Protein"},{"name":"egg noodles","qty":"1 cup","category":"Grains"},{"name":"carrot","qty":"1","category":"Produce"},{"name":"ginger","qty":"1 tbsp","category":"Pantry"},{"name":"turmeric","qty":"1 tsp","category":"Pantry"},{"name":"chicken stock","qty":"3 cups","category":"Pantry"}]',
  'Simmer chicken in stock with ginger and turmeric 15 min, shred. Add carrot and noodles, cook 5 more minutes.',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
  25, 380, 30, 40, 8,
  'Turmeric and ginger calm inflammation while a warm broth soothes a racing mind.',
  'rule-engine-v1', 0.86, 'unreviewed'
),
(
  gen_random_uuid(),
  'Sweet Potato & Black Bean Power Bowl',
  'Roasted sweet potato, black beans, and corn over rice with a lime-yoghurt drizzle.',
  ARRAY['sluggish','tired','low-energy'],
  '[{"name":"sweet potato","qty":"1 medium","category":"Produce"},{"name":"black beans","qty":"1 cup","category":"Protein"},{"name":"corn kernels","qty":"1/2 cup","category":"Produce"},{"name":"brown rice","qty":"1 cup","category":"Grains"},{"name":"plain yoghurt","qty":"2 tbsp","category":"Dairy"},{"name":"lime","qty":"1","category":"Produce"}]',
  'Roast diced sweet potato 20 min at 200°C. Warm black beans and corn. Layer over rice, top with yoghurt and lime juice.',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
  25, 430, 15, 68, 9,
  'Slow-digesting carbs and fibre-rich beans give a steady energy climb instead of a quick crash.',
  'rule-engine-v1', 0.84, 'unreviewed'
),
(
  gen_random_uuid(),
  'Warm Cinnamon Apple Crumble Oats',
  'Stovetop oats folded with cinnamon-stewed apple and a crunchy oat topping.',
  ARRAY['sad','low','melancholy'],
  '[{"name":"rolled oats","qty":"1/2 cup","category":"Grains"},{"name":"apple","qty":"1","category":"Produce"},{"name":"cinnamon","qty":"1/2 tsp","category":"Pantry"},{"name":"honey","qty":"1 tbsp","category":"Pantry"},{"name":"walnuts","qty":"2 tbsp","category":"Pantry"},{"name":"milk","qty":"1 cup","category":"Dairy"}]',
  'Simmer oats in milk 5 min. Sauté diced apple with cinnamon and honey until soft, fold through. Top with crushed walnuts.',
  'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800',
  15, 360, 10, 54, 12,
  'A warm, spiced comfort bowl gives a small ritual of self-care and a gentle serotonin lift from the carbs.',
  'rule-engine-v1', 0.85, 'unreviewed'
),
(
  gen_random_uuid(),
  'Grilled Chicken & Mango Salsa Bowl',
  'Charred grilled chicken with a bright mango-lime salsa over jasmine rice.',
  ARRAY['happy','great','energetic'],
  '[{"name":"chicken breast","qty":"200g","category":"Protein"},{"name":"mango","qty":"1","category":"Produce"},{"name":"red onion","qty":"2 tbsp","category":"Produce"},{"name":"lime","qty":"1","category":"Produce"},{"name":"cilantro","qty":"2 tbsp","category":"Produce"},{"name":"jasmine rice","qty":"1 cup","category":"Grains"}]',
  'Grill chicken 6 min per side, slice. Toss diced mango, red onion, lime juice, and cilantro for salsa. Serve over rice, top with chicken and salsa.',
  'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800',
  20, 470, 36, 54, 9,
  'A bright, colourful plate matches an upbeat mood and keeps the energy going without weighing you down.',
  'rule-engine-v1', 0.87, 'unreviewed'
),
(
  gen_random_uuid(),
  'Chamomile Turkey Meatballs with Brown Rice',
  'Gently spiced turkey meatballs simmered in a mild tomato sauce, served over brown rice.',
  ARRAY['anxious','nervous','restless'],
  '[{"name":"ground turkey","qty":"200g","category":"Protein"},{"name":"breadcrumbs","qty":"1/4 cup","category":"Pantry"},{"name":"crushed tomatoes","qty":"1 cup","category":"Pantry"},{"name":"garlic","qty":"1 clove","category":"Produce"},{"name":"brown rice","qty":"1 cup","category":"Grains"},{"name":"parsley","qty":"1 tbsp","category":"Produce"}]',
  'Mix turkey with breadcrumbs and garlic, form meatballs. Simmer in crushed tomatoes 15 min. Serve over rice, top with parsley.',
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
  25, 420, 32, 46, 11,
  'Lean protein and a slow-simmered sauce make a grounding, unhurried meal that eases a restless mind.',
  'rule-engine-v1', 0.83, 'unreviewed'
),
(
  gen_random_uuid(),
  'Blueberry Walnut Brain-Boost Bowl',
  'Greek yoghurt bowl with blueberries, walnuts, and a drizzle of honey.',
  ARRAY['unfocused','distracted','foggy'],
  '[{"name":"greek yoghurt","qty":"1 cup","category":"Dairy"},{"name":"blueberries","qty":"1/2 cup","category":"Produce"},{"name":"walnuts","qty":"2 tbsp","category":"Pantry"},{"name":"honey","qty":"1 tbsp","category":"Pantry"},{"name":"chia seeds","qty":"1 tsp","category":"Pantry"}]',
  'Spoon yoghurt into a bowl. Top with blueberries, walnuts, chia seeds, and a drizzle of honey.',
  'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800',
  5, 320, 20, 32, 14,
  'Antioxidant-rich blueberries and omega-3s from walnuts support sharper, clearer thinking.',
  'rule-engine-v1', 0.85, 'unreviewed'
);

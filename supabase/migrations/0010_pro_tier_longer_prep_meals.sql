-- Pricing: Pro tier gets extra meal options, including longer-prep recipes
-- (45-100 min) that don't fit the free tier's "recipe in under 30 minutes"
-- promise. `tier` defaults to 'free' so every existing meal stays visible
-- to everyone; only these new rows are marked 'pro'.
-- Every ingredient is halal-friendly: no pork/bacon/ham, no alcohol.

alter table meals add column if not exists tier text not null default 'free' check (tier in ('free', 'pro'));

insert into meals (id, title, description, mood_tags, ingredients, instructions, image_url, prep_minutes, calories, protein_g, carbs_g, fat_g, why_it_fits, why_it_fits_source, why_it_fits_confidence, why_it_fits_review_status, tier) values
(
  gen_random_uuid(),
  'Slow-Braised Lamb Shank with Root Vegetables',
  'Lamb shank braised for hours until fall-off-the-bone tender, with carrots, parsnip, and pearl onions.',
  ARRAY['stressed','overwhelmed'],
  '[{"name":"lamb shank","qty":"2","category":"Protein"},{"name":"carrot","qty":"2","category":"Produce"},{"name":"parsnip","qty":"2","category":"Produce"},{"name":"pearl onions","qty":"1 cup","category":"Produce"},{"name":"beef stock","qty":"2 cups","category":"Pantry"},{"name":"rosemary","qty":"2 sprigs","category":"Produce"}]',
  'Sear lamb shanks on all sides. Add vegetables, stock, and rosemary. Cover and braise at 160°C for 2.5 hours until tender.',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  90, 540, 42, 28, 26,
  'A slow, unhurried braise is its own kind of stress relief — there is nothing to rush, just time doing the work.',
  'rule-engine-v1', 0.85, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Homemade Chicken Pot Pie',
  'A buttery, flaky crust over a creamy chicken and vegetable filling, baked until golden.',
  ARRAY['stressed','anxious'],
  '[{"name":"chicken thigh","qty":"300g","category":"Protein"},{"name":"puff pastry","qty":"1 sheet","category":"Pantry"},{"name":"carrot","qty":"1","category":"Produce"},{"name":"peas","qty":"1/2 cup","category":"Produce"},{"name":"cream","qty":"1/2 cup","category":"Dairy"},{"name":"chicken stock","qty":"1 cup","category":"Pantry"}]',
  'Simmer chicken and vegetables in stock and cream until thickened. Pour into a dish, top with pastry, and bake at 200°C for 25 minutes.',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
  60, 610, 38, 42, 32,
  'Rich, buttery comfort food that rewards the wait — a warm, familiar dish to come home to.',
  'rule-engine-v1', 0.84, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Beef Short Rib Ragu over Pappardelle',
  'Beef short ribs simmered for hours into a rich tomato ragu, tossed with wide pappardelle noodles.',
  ARRAY['sluggish','tired','low-energy'],
  '[{"name":"beef short rib","qty":"400g","category":"Protein"},{"name":"crushed tomatoes","qty":"2 cups","category":"Pantry"},{"name":"carrot","qty":"1","category":"Produce"},{"name":"celery","qty":"1 stalk","category":"Produce"},{"name":"pappardelle","qty":"200g","category":"Grains"},{"name":"parmesan","qty":"30g","category":"Dairy"}]',
  'Sear short ribs, then simmer with tomatoes, carrot, and celery for 2.5 hours until the meat shreds easily. Toss through cooked pappardelle, top with parmesan.',
  'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=800',
  100, 680, 44, 58, 28,
  'Deeply savoury, iron-rich beef slow-cooked to tenderness gives sustained energy without needing to lift a finger while it cooks.',
  'rule-engine-v1', 0.87, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Herb-Roasted Whole Chicken with Stuffing',
  'A whole chicken roasted with garlic and herbs, served with a savoury bread stuffing.',
  ARRAY['sluggish','tired'],
  '[{"name":"whole chicken","qty":"1.5kg","category":"Protein"},{"name":"bread cubes","qty":"3 cups","category":"Grains"},{"name":"onion","qty":"1","category":"Produce"},{"name":"celery","qty":"1 stalk","category":"Produce"},{"name":"thyme","qty":"1 tbsp","category":"Produce"},{"name":"butter","qty":"3 tbsp","category":"Dairy"}]',
  'Rub chicken with butter and herbs, roast at 190°C for 75 minutes. Sauté onion and celery, mix with bread cubes and thyme, bake stuffing alongside for the last 25 minutes.',
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
  75, 590, 46, 36, 24,
  'A full roast dinner is the kind of meal that restores energy for the whole evening, not just the next hour.',
  'rule-engine-v1', 0.85, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Baked Mac and Cheese with Crispy Top',
  'Creamy three-cheese macaroni baked until the top turns golden and crisp.',
  ARRAY['sad','low','melancholy'],
  '[{"name":"macaroni","qty":"250g","category":"Grains"},{"name":"cheddar cheese","qty":"1.5 cups","category":"Dairy"},{"name":"gruyere cheese","qty":"1/2 cup","category":"Dairy"},{"name":"milk","qty":"2 cups","category":"Dairy"},{"name":"breadcrumbs","qty":"1/2 cup","category":"Pantry"},{"name":"butter","qty":"2 tbsp","category":"Dairy"}]',
  'Make a cheese sauce with butter, milk, and cheeses. Toss with cooked macaroni, top with breadcrumbs, and bake at 190°C for 25 minutes until golden.',
  'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=800',
  55, 620, 26, 58, 32,
  'The most classic comfort food there is — a slow bake gives you time to sit with how you feel before the reward arrives.',
  'rule-engine-v1', 0.86, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Slow-Cooker Beef Stew',
  'Chunks of beef, potato, and carrot simmered low and slow into a thick, hearty stew.',
  ARRAY['sad','low'],
  '[{"name":"beef chuck","qty":"400g","category":"Protein"},{"name":"potato","qty":"2","category":"Produce"},{"name":"carrot","qty":"2","category":"Produce"},{"name":"beef stock","qty":"2 cups","category":"Pantry"},{"name":"tomato paste","qty":"1 tbsp","category":"Pantry"},{"name":"bay leaf","qty":"1","category":"Pantry"}]',
  'Sear beef, then combine with vegetables, stock, tomato paste, and bay leaf. Simmer on low for 3 hours until beef is fork-tender.',
  'https://images.unsplash.com/photo-1608835291093-394b0c943a75?w=800',
  100, 560, 40, 44, 20,
  'A stew that takes all afternoon is a small act of caring for yourself — something warm waiting at the end of a hard day.',
  'rule-engine-v1', 0.85, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Homemade Beef Lasagna',
  'Layers of pasta, seasoned beef ragu, and melted mozzarella baked until bubbling.',
  ARRAY['happy','great','energetic'],
  '[{"name":"lasagna sheets","qty":"9","category":"Grains"},{"name":"ground beef","qty":"400g","category":"Protein"},{"name":"crushed tomatoes","qty":"2 cups","category":"Pantry"},{"name":"mozzarella","qty":"1.5 cups","category":"Dairy"},{"name":"ricotta","qty":"1 cup","category":"Dairy"},{"name":"basil","qty":"2 tbsp","category":"Produce"}]',
  'Brown beef with tomatoes for a ragu. Layer with pasta sheets, ricotta, and mozzarella. Bake at 190°C for 45 minutes until golden and bubbling.',
  'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800',
  75, 650, 40, 52, 30,
  'A crowd-pleasing bake worth the effort — a great mood deserves a meal that feels like a celebration.',
  'rule-engine-v1', 0.87, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Whole Roasted Chicken with Lemon and Herbs',
  'A golden roasted chicken stuffed with lemon and fresh herbs, served with pan juices.',
  ARRAY['happy','energetic'],
  '[{"name":"whole chicken","qty":"1.5kg","category":"Protein"},{"name":"lemon","qty":"2","category":"Produce"},{"name":"garlic","qty":"1 head","category":"Produce"},{"name":"rosemary","qty":"2 sprigs","category":"Produce"},{"name":"olive oil","qty":"2 tbsp","category":"Pantry"},{"name":"potato","qty":"4 small","category":"Produce"}]',
  'Stuff chicken cavity with lemon, garlic, and rosemary. Rub skin with olive oil, roast at 200°C for 80 minutes with potatoes around it, basting halfway.',
  'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800',
  80, 570, 48, 30, 22,
  'A bright, golden roast matches a bright mood, and it is the kind of dish worth savouring slowly.',
  'rule-engine-v1', 0.86, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Chamomile-Braised Chicken Thighs with Root Vegetables',
  'Chicken thighs braised in chamomile-infused broth with carrots and turnip until tender.',
  ARRAY['anxious','nervous','restless'],
  '[{"name":"chicken thigh","qty":"4","category":"Protein"},{"name":"chamomile tea bags","qty":"2","category":"Pantry"},{"name":"carrot","qty":"2","category":"Produce"},{"name":"turnip","qty":"1","category":"Produce"},{"name":"chicken stock","qty":"1.5 cups","category":"Pantry"},{"name":"honey","qty":"1 tbsp","category":"Pantry"}]',
  'Steep chamomile in warm stock, remove bags. Sear chicken thighs, then braise with vegetables and chamomile stock at 160°C for 70 minutes.',
  'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800',
  70, 520, 38, 26, 24,
  'A long, gentle braise mirrors the pace you need when anxious — nothing to rush, just a slow return to calm.',
  'rule-engine-v1', 0.84, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Slow-Simmered Turkey Chili',
  'Ground turkey simmered for over an hour with beans, tomatoes, and warming spices.',
  ARRAY['anxious','restless'],
  '[{"name":"ground turkey","qty":"400g","category":"Protein"},{"name":"kidney beans","qty":"1.5 cups","category":"Protein"},{"name":"crushed tomatoes","qty":"2 cups","category":"Pantry"},{"name":"cumin","qty":"1 tsp","category":"Pantry"},{"name":"paprika","qty":"1 tsp","category":"Pantry"},{"name":"onion","qty":"1","category":"Produce"}]',
  'Brown turkey with onion, add beans, tomatoes, and spices. Simmer uncovered for 60 minutes, stirring occasionally, until thick.',
  'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=800',
  60, 480, 42, 38, 14,
  'A chili that simmers for an hour gives restless energy somewhere useful to go while the smell fills the kitchen.',
  'rule-engine-v1', 0.85, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Walnut-Crusted Baked Salmon with Roasted Vegetables',
  'Salmon fillet under a crunchy walnut crust, baked alongside roasted seasonal vegetables.',
  ARRAY['unfocused','distracted','foggy'],
  '[{"name":"salmon fillet","qty":"200g","category":"Protein"},{"name":"walnuts","qty":"1/4 cup","category":"Pantry"},{"name":"breadcrumbs","qty":"2 tbsp","category":"Pantry"},{"name":"broccoli","qty":"1 cup","category":"Produce"},{"name":"carrot","qty":"1","category":"Produce"},{"name":"honey","qty":"1 tsp","category":"Pantry"}]',
  'Crush walnuts with breadcrumbs and honey, press onto salmon. Roast salmon and vegetables together at 200°C for 45 minutes until the crust is golden.',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
  45, 490, 36, 22, 28,
  'Omega-3s from salmon and walnuts are two of the best-studied nutrients for sustained mental clarity.',
  'rule-engine-v1', 0.86, 'unreviewed', 'pro'
),
(
  gen_random_uuid(),
  'Slow-Roasted Beef Brisket with Roasted Carrots',
  'Beef brisket rubbed with spices and slow-roasted for hours until tender enough to shred.',
  ARRAY['unfocused','foggy','scattered'],
  '[{"name":"beef brisket","qty":"500g","category":"Protein"},{"name":"paprika","qty":"1 tbsp","category":"Pantry"},{"name":"cumin","qty":"1 tsp","category":"Pantry"},{"name":"carrot","qty":"3","category":"Produce"},{"name":"beef stock","qty":"1 cup","category":"Pantry"},{"name":"garlic","qty":"3 cloves","category":"Produce"}]',
  'Rub brisket with spices and garlic. Roast covered at 150°C with stock and carrots for 3 hours until fork-tender, then rest before slicing.',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  100, 610, 44, 20, 30,
  'A long, undistracted cook mirrors the focus you are looking to rebuild — one slow task instead of many scattered ones.',
  'rule-engine-v1', 0.83, 'unreviewed', 'pro'
);

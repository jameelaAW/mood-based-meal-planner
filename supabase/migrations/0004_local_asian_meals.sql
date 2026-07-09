-- Local Asian meals — halal-only (no pork, no alcohol anywhere), 2 per mood.
-- Brings every mood up to 5 total options (1 original + 2 variety-sprint + 2 here).

insert into meals (id, title, description, mood_tags, ingredients, instructions, image_url, prep_minutes, calories, protein_g, carbs_g, fat_g, why_it_fits, why_it_fits_source, why_it_fits_confidence, why_it_fits_review_status) values
(
  gen_random_uuid(),
  'Nasi Lemak with Chicken Sambal',
  'Fragrant coconut rice with spicy sambal, crispy fried chicken, and all the classic sides.',
  ARRAY['anxious','nervous'],
  '[{"name":"jasmine rice","qty":"1.5 cups","category":"Grains"},{"name":"coconut milk","qty":"1 cup","category":"Pantry"},{"name":"chicken thigh","qty":"200g","category":"Protein"},{"name":"sambal chilli paste","qty":"3 tbsp","category":"Pantry"},{"name":"dried anchovies","qty":"2 tbsp","category":"Protein"},{"name":"roasted peanuts","qty":"2 tbsp","category":"Pantry"},{"name":"cucumber","qty":"1/2","category":"Produce"},{"name":"hard-boiled egg","qty":"1","category":"Protein"}]',
  'Cook rice with coconut milk. Fry chicken until golden and crisp. Fry sambal paste with anchovies until fragrant. Plate rice with chicken, sambal, peanuts, cucumber, and egg.',
  'https://images.unsplash.com/photo-1770966485209-e20d97337f1a?w=800',
  35, 560, 32, 58, 22,
  'The gentle ritual of a full, familiar plate and warming spice can settle a nervous, anxious mind.',
  'rule-engine-v1', 0.85, 'unreviewed'
),
(
  gen_random_uuid(),
  'Hainanese Chicken Rice',
  'Poached chicken and fragrant chicken-fat rice, served with chilli-ginger and dark soy dipping sauces.',
  ARRAY['sluggish','low-energy'],
  '[{"name":"chicken thigh","qty":"250g","category":"Protein"},{"name":"jasmine rice","qty":"1.5 cups","category":"Grains"},{"name":"ginger","qty":"2 tbsp sliced","category":"Pantry"},{"name":"garlic","qty":"3 cloves","category":"Produce"},{"name":"chicken stock","qty":"600ml","category":"Pantry"},{"name":"cucumber","qty":"1/2","category":"Produce"},{"name":"light soy sauce","qty":"2 tbsp","category":"Pantry"}]',
  'Poach chicken gently in stock with ginger and garlic until just cooked. Cook rice in the poaching stock. Slice chicken, serve over rice with cucumber and dipping sauces.',
  'https://images.unsplash.com/photo-1603496987674-79600a000f55?w=800',
  40, 520, 38, 55, 14,
  'Lean protein and easy carbs from the rice give a steady, sustained lift out of an energy slump.',
  'rule-engine-v1', 0.88, 'unreviewed'
),
(
  gen_random_uuid(),
  'Chicken Laksa',
  'Creamy coconut curry noodle soup with shredded chicken, tofu puffs, and beansprouts.',
  ARRAY['sad','low'],
  '[{"name":"rice vermicelli noodles","qty":"150g","category":"Grains"},{"name":"chicken breast","qty":"180g","category":"Protein"},{"name":"coconut milk","qty":"400ml","category":"Pantry"},{"name":"laksa paste","qty":"3 tbsp","category":"Pantry"},{"name":"tofu puffs","qty":"6","category":"Protein"},{"name":"beansprouts","qty":"1 cup","category":"Produce"},{"name":"coriander","qty":"handful","category":"Produce"}]',
  'Simmer laksa paste with coconut milk and stock. Add poached shredded chicken and tofu puffs. Serve over noodles with beansprouts and coriander.',
  'https://images.unsplash.com/photo-1768703321790-e09a80a46f2c?w=800',
  25, 480, 30, 46, 20,
  'A rich, warming bowl of comfort food that feels like being taken care of on a low day.',
  'rule-engine-v1', 0.86, 'unreviewed'
),
(
  gen_random_uuid(),
  'Beef Rendang with Steamed Rice',
  'Slow-cooked beef in coconut milk and aromatic spices until deeply caramelised.',
  ARRAY['sluggish','tired'],
  '[{"name":"beef chuck","qty":"250g","category":"Protein"},{"name":"coconut milk","qty":"400ml","category":"Pantry"},{"name":"lemongrass","qty":"2 stalks","category":"Produce"},{"name":"galangal","qty":"1 tbsp","category":"Pantry"},{"name":"kaffir lime leaves","qty":"3","category":"Pantry"},{"name":"shallots","qty":"4","category":"Produce"},{"name":"steamed rice","qty":"1 cup","category":"Grains"}]',
  'Blend shallots, lemongrass, and galangal into a paste. Simmer beef in coconut milk with the paste for 90 minutes until the sauce reduces and the beef is deeply tender. Serve over rice.',
  'https://images.unsplash.com/photo-1677921755291-c39158477b8e?w=800',
  90, 560, 34, 40, 30,
  'Iron-rich beef slow-cooked to tender restores energy that a quick meal can''t match.',
  'rule-engine-v1', 0.87, 'unreviewed'
),
(
  gen_random_uuid(),
  'Chicken Satay with Peanut Sauce',
  'Char-grilled marinated chicken skewers with a rich peanut dipping sauce.',
  ARRAY['happy','energetic'],
  '[{"name":"chicken thigh","qty":"220g","category":"Protein"},{"name":"turmeric","qty":"1 tsp","category":"Pantry"},{"name":"lemongrass","qty":"1 stalk","category":"Produce"},{"name":"peanut sauce","qty":"4 tbsp","category":"Pantry"},{"name":"steamed rice","qty":"1 cup","category":"Grains"},{"name":"cucumber","qty":"1/2","category":"Produce"}]',
  'Marinate chicken in turmeric and lemongrass. Skewer and grill until charred at the edges. Serve with peanut sauce, rice, and cucumber.',
  'https://images.unsplash.com/photo-1755434315388-16387508c1fb?w=800',
  18, 460, 36, 30, 22,
  'A vibrant, sociable dish that matches and sustains an already bright, energetic mood.',
  'rule-engine-v1', 0.89, 'unreviewed'
),
(
  gen_random_uuid(),
  'Pad Thai with Prawns',
  'Stir-fried rice noodles with prawns, egg, tamarind, and crushed peanuts.',
  ARRAY['happy','great'],
  '[{"name":"rice noodles","qty":"180g","category":"Grains"},{"name":"prawns","qty":"150g","category":"Protein"},{"name":"eggs","qty":"2","category":"Protein"},{"name":"tamarind paste","qty":"2 tbsp","category":"Pantry"},{"name":"beansprouts","qty":"1 cup","category":"Produce"},{"name":"crushed peanuts","qty":"2 tbsp","category":"Pantry"},{"name":"lime","qty":"1","category":"Produce"}]',
  'Soak noodles until pliable. Stir-fry prawns and egg, add noodles and tamarind sauce, toss well. Fold in beansprouts, top with peanuts and lime.',
  'https://images.unsplash.com/photo-1759324342316-f6943c935c4a?w=800',
  18, 470, 28, 52, 16,
  'Bright tamarind and lime keep a good mood light instead of weighing it down.',
  'rule-engine-v1', 0.87, 'unreviewed'
),
(
  gen_random_uuid(),
  'Chicken Congee',
  'Silky rice porridge simmered with shredded chicken, ginger, and scallions.',
  ARRAY['stressed','overwhelmed'],
  '[{"name":"rice","qty":"3/4 cup","category":"Grains"},{"name":"chicken breast","qty":"180g","category":"Protein"},{"name":"ginger","qty":"1 tbsp sliced","category":"Pantry"},{"name":"chicken stock","qty":"1.2L","category":"Pantry"},{"name":"scallions","qty":"2","category":"Produce"},{"name":"sesame oil","qty":"1 tsp","category":"Pantry"}]',
  'Simmer rice in stock with ginger for 30-35 minutes, stirring occasionally, until thick and creamy. Stir in shredded poached chicken. Top with scallions and a drizzle of sesame oil.',
  'https://images.unsplash.com/photo-1766761562530-c8dd12c96d9a?w=800',
  35, 340, 26, 44, 8,
  'A soft, spoonable dish that asks nothing of you — easy to digest when everything feels like a lot.',
  'rule-engine-v1', 0.86, 'unreviewed'
),
(
  gen_random_uuid(),
  'Beef Pho',
  'Vietnamese beef noodle soup with a fragrant star anise and cinnamon broth.',
  ARRAY['stressed','anxious'],
  '[{"name":"rice noodles","qty":"200g","category":"Grains"},{"name":"beef sirloin","qty":"150g thinly sliced","category":"Protein"},{"name":"beef broth","qty":"800ml","category":"Pantry"},{"name":"star anise","qty":"2","category":"Pantry"},{"name":"cinnamon stick","qty":"1","category":"Pantry"},{"name":"thai basil","qty":"handful","category":"Produce"},{"name":"bean sprouts","qty":"1 cup","category":"Produce"}]',
  'Simmer broth with star anise and cinnamon for 20 minutes. Pour the hot broth over thinly sliced raw beef and noodles to gently cook the beef through. Top with basil and beansprouts.',
  'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=800',
  30, 420, 32, 46, 10,
  'The ritual of a slow-sipped aromatic broth gives racing thoughts something steady to follow.',
  'rule-engine-v1', 0.88, 'unreviewed'
),
(
  gen_random_uuid(),
  'Butter Chicken with Basmati Rice',
  'Creamy tomato-based chicken curry with warm garam masala, served over basmati rice.',
  ARRAY['sad','melancholy'],
  '[{"name":"chicken thigh","qty":"220g","category":"Protein"},{"name":"tomato puree","qty":"200ml","category":"Pantry"},{"name":"cream","qty":"100ml","category":"Dairy"},{"name":"garam masala","qty":"1.5 tsp","category":"Pantry"},{"name":"butter","qty":"2 tbsp","category":"Dairy"},{"name":"basmati rice","qty":"1 cup","category":"Grains"}]',
  'Marinate and sear chicken. Simmer in tomato puree, cream, butter, and garam masala until thick and glossy. Serve over basmati rice.',
  'https://images.unsplash.com/photo-1768179669433-bd9d52949c20?w=800',
  30, 540, 34, 46, 26,
  'Rich, warm spice and cream deliver the kind of deep comfort that meets a melancholy mood halfway.',
  'rule-engine-v1', 0.87, 'unreviewed'
),
(
  gen_random_uuid(),
  'Bibimbap with Beef Bulgogi',
  'Warm rice bowl with marinated beef bulgogi, sautéed vegetables, and a fried egg.',
  ARRAY['unfocused','foggy'],
  '[{"name":"beef sirloin","qty":"180g","category":"Protein"},{"name":"steamed rice","qty":"1 cup","category":"Grains"},{"name":"spinach","qty":"1 cup","category":"Produce"},{"name":"carrot","qty":"1","category":"Produce"},{"name":"shiitake mushrooms","qty":"1 cup","category":"Produce"},{"name":"egg","qty":"1","category":"Protein"},{"name":"gochujang","qty":"1 tbsp","category":"Pantry"}]',
  'Marinate and sear beef bulgogi-style. Sauté each vegetable individually and season lightly. Assemble everything over rice with a fried egg and a spoon of gochujang.',
  'https://images.unsplash.com/photo-1741295017668-c8132acd6fc0?w=800',
  30, 560, 36, 52, 20,
  'The colour, variety, and protein in one mixed bowl gives scattered focus something to gather around.',
  'rule-engine-v1', 0.85, 'unreviewed'
),
(
  gen_random_uuid(),
  'Mee Goreng',
  'Spicy stir-fried noodles with chicken, egg, and vegetables in a sweet-savoury sauce.',
  ARRAY['anxious','restless'],
  '[{"name":"yellow egg noodles","qty":"200g","category":"Grains"},{"name":"chicken breast","qty":"150g","category":"Protein"},{"name":"egg","qty":"1","category":"Protein"},{"name":"dark soy sauce","qty":"2 tbsp","category":"Pantry"},{"name":"bean sprouts","qty":"1 cup","category":"Produce"},{"name":"tomato","qty":"1","category":"Produce"}]',
  'Stir-fry chicken until cooked through. Push aside and scramble the egg. Add noodles and dark soy sauce, toss well, then fold in tomato and beansprouts.',
  'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800',
  18, 460, 26, 54, 14,
  'The hands-on sizzle of stir-frying gives restless energy something immediate to focus on.',
  'rule-engine-v1', 0.84, 'unreviewed'
),
(
  gen_random_uuid(),
  'Chicken Katsu Curry Rice',
  'Crispy breaded chicken cutlet with a mild Japanese curry sauce over rice.',
  ARRAY['unfocused','distracted'],
  '[{"name":"chicken breast","qty":"200g","category":"Protein"},{"name":"panko breadcrumbs","qty":"1 cup","category":"Pantry"},{"name":"japanese curry roux","qty":"2 cubes","category":"Pantry"},{"name":"carrot","qty":"1","category":"Produce"},{"name":"onion","qty":"1","category":"Produce"},{"name":"steamed rice","qty":"1 cup","category":"Grains"}]',
  'Bread the chicken with panko and pan-fry until golden and crisp. Simmer curry roux with carrot and onion until thick. Slice the chicken over rice and ladle the curry sauce on top.',
  'https://images.unsplash.com/photo-1768179669433-bd9d52949c20?w=800',
  30, 580, 36, 60, 20,
  'A satisfying crunch-then-comfort combination gives a distracted mind one clear thing to focus on.',
  'rule-engine-v1', 0.85, 'unreviewed'
);

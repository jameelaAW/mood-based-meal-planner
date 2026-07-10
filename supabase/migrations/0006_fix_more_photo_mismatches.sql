-- Second round of photo fixes, based on user screenshots showing real mismatches
-- that the first (0005) pass missed or didn't fully solve. Each replacement below
-- was verified by reading the actual Unsplash photo page description before use --
-- not just a search-result snippet, which is what caused some earlier mismatches.

update meals
set image_url = 'https://images.unsplash.com/photo-1708782344490-9026aaa5eec7?w=800'
where title = 'Hainanese Chicken Rice';

update meals
set image_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'
where title = 'Golden Turmeric Lentil Soup';

update meals
set image_url = 'https://images.unsplash.com/photo-1649069041246-457021025dea?w=800'
where title = 'Dark Chocolate Banana Smoothie Bowl';

update meals
set image_url = 'https://images.unsplash.com/photo-1767974877206-a594e0b1008e?w=800'
where title = 'Beef & Broccoli Stir-Fry';

update meals
set image_url = 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800'
where title = 'Beef Rendang with Steamed Rice';

update meals
set image_url = 'https://images.unsplash.com/photo-1689774187968-0e6c29a1d82e?w=800'
where title = 'Grilled Chicken Fajita Bowl';

update meals
set image_url = 'https://images.unsplash.com/photo-1775889184907-36742cafb945?w=800'
where title = 'Miso-Glazed Salmon with Steamed Rice';

update meals
set image_url = 'https://images.unsplash.com/photo-1520319888085-12744c760434?w=800'
where title = 'Chicken Congee';

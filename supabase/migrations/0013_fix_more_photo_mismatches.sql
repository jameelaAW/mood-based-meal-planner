-- Buyers reported recipe/photo mismatches. Audit found 10 dishes (mostly
-- among the Pro longer-prep meals added in 0009/0010) sharing an image with
-- a visually different dish -- e.g. BBQ ribs used for both "Lamb Shank" and
-- "Beef Brisket", a bowl of penne used for "Chicken Pot Pie", a plain curry
-- stew used for "Chicken Katsu" (no visible breaded cutlet). Replaced each
-- with a distinct, verified-matching free-license Unsplash photo.

update meals set image_url = 'https://images.unsplash.com/photo-1773417325310-cc9c9bef75e7?w=800'
  where title = 'Slow-Braised Lamb Shank with Root Vegetables';

update meals set image_url = 'https://images.unsplash.com/photo-1558030006-450675393462?w=800'
  where title = 'Slow-Roasted Beef Brisket with Roasted Carrots';

update meals set image_url = 'https://images.unsplash.com/photo-1723208841184-3d91ba244c60?w=800'
  where title = 'Chicken Katsu Curry Rice';

update meals set image_url = 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800'
  where title = 'Chamomile-Braised Chicken Thighs with Root Vegetables';

update meals set image_url = 'https://images.unsplash.com/photo-1596181367808-c7c64b779b46?w=800'
  where title = 'Grilled Chicken & Mango Salsa Bowl';

update meals set image_url = 'https://images.unsplash.com/photo-1612966948332-81d747414a8f?w=800'
  where title = 'Turmeric Ginger Chicken Soup';

update meals set image_url = 'https://images.unsplash.com/photo-1628642585518-2d63c2beab6b?w=800'
  where title = 'Homemade Chicken Pot Pie';

update meals set image_url = 'https://images.unsplash.com/photo-1680404840959-3211731fbb52?w=800'
  where title = 'Walnut-Crusted Baked Salmon with Roasted Vegetables';

update meals set image_url = 'https://images.unsplash.com/photo-1662743086910-38419bbf7f34?w=800'
  where title = 'Sweet Potato & Black Bean Power Bowl';

update meals set image_url = 'https://images.unsplash.com/photo-1602881916963-5daf2d97c06e?w=800'
  where title = 'Turmeric Chicken & Quinoa Power Bowl';

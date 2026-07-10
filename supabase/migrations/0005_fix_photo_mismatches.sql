-- Fixes confirmed image mismatches from the original (unverified) seed data.
-- These three photo URLs were set from memory in the earliest build session
-- without checking they actually matched the dish — unlike every image added
-- since (verified by fetching the real Unsplash photo page first).

update meals
set image_url = 'https://images.unsplash.com/photo-1490323948794-cc6dde6e8f5b?w=800'
where title = 'Dark Chocolate Banana Smoothie Bowl';

update meals
set image_url = 'https://images.unsplash.com/photo-1654199903998-e49181b41a95?w=800'
where title = 'Spiced Chickpea & Sweet Potato Bowl';

update meals
set image_url = 'https://images.unsplash.com/photo-1676300185165-3f543c1fcb72?w=800'
where title = 'Miso-Glazed Salmon with Steamed Rice';

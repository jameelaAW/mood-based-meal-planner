-- Chamomile & Almond Overnight Oats was showing an unrelated photo of books
-- and a notebook (no food at all). Replaced with a real, free, verified
-- overnight oats bowl photo.
update meals
set image_url = 'https://images.unsplash.com/photo-1682622110332-d50f50b7146d?w=800'
where title = 'Chamomile & Almond Overnight Oats';

-- Hainanese Chicken Rice: free stock has no good match for this specific
-- dish (checked several rounds -- everything close is either a recipe blog,
-- not licensed for use, or paid iStock/Unsplash+). This is the closest
-- genuinely free chicken-and-rice photo available; it's fried chicken with
-- fried rice and coleslaw, not the poached/cucumber version, but it is at
-- least correctly chicken + rice rather than curry or biryani.
update meals
set image_url = 'https://images.unsplash.com/photo-1757715376249-b2a3e943cdf5?w=800'
where title = 'Hainanese Chicken Rice';

-- Third round of photo fixes, based on direct user comparison screenshots.
-- Two of these (rendang, congee) have genuinely thin free-stock coverage on
-- Unsplash for the specific dish -- see commit message for caveats on each.

-- Was showing shrimp/prawns instead of beef. Reuses the verified Pho Bo photo
-- (same one used for the Beef Pho dish) since it's a confirmed real beef
-- noodle soup and Unsplash has no second distinct free beef-noodle-soup photo.
update meals
set image_url = 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?w=800'
where title = 'Warm Ginger Beef Noodle Soup';

-- Was showing salmon in orange sauce (the 0006 "fix" was wrong). This is the
-- most specific free photo tagged specifically under Unsplash's own
-- "rendang" search results.
update meals
set image_url = 'https://images.unsplash.com/photo-1620700668269-d3ad2a88f27e?w=800'
where title = 'Beef Rendang with Steamed Rice';

-- Was showing an unrelated dark dessert/drink, not congee at all. Free
-- Unsplash coverage of congee is very thin -- the only genuinely free congee
-- photo available shows shrimp rather than chicken. Correct dish, wrong
-- garnish; flagging honestly rather than leaving the previous wrong-dish photo.
update meals
set image_url = 'https://images.unsplash.com/photo-1766761562530-c8dd12c96d9a?w=800'
where title = 'Chicken Congee';

-- Was showing instant-noodle/Maggi-style ramen with a soft-boiled egg, not
-- Mee Goreng. Replaced with a real dry stir-fried noodle plate.
update meals
set image_url = 'https://images.unsplash.com/photo-1767324672643-c4979362f922?w=800'
where title = 'Mee Goreng';

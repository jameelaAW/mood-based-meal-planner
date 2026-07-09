# Data Model

## meals
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | owner scope (v1: null for seeded rows) |
| title | text | |
| description | text | |
| mood_tags | text[] | e.g. `['stressed','anxious']` |
| ingredients | jsonb | `[{name, qty, category}]` |
| instructions | text | |
| image_url | text | Unsplash URL |
| prep_minutes | int | |
| calories / protein_g / carbs_g / fat_g | int | |
| why_it_fits | text | **AI field** |
| why_it_fits_source | text | `'openai-gpt4o'` or `'rule-engine-v1'` |
| why_it_fits_confidence | numeric | 0–1 |
| why_it_fits_review_status | text | default `'unreviewed'` |

## mood_checkins
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| mood_label | text | selected mood string |
| mood_score | int | 1–10 optional |
| free_text | text | optional user note |
| suggested_meal_id | uuid FK → meals | |
| ai_mood_interpretation | text | **AI field** |
| ai_mood_interpretation_source | text | |
| ai_mood_interpretation_confidence | numeric | |
| ai_mood_interpretation_review_status | text | default `'unreviewed'` |

## shopping_lists
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| checkin_id | uuid FK → mood_checkins | |
| week_label | text | e.g. `'Week of Jun 9'` |
| status | text | `'active'` / `'archived'` |

## shopping_list_items
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| shopping_list_id | uuid FK → shopping_lists | cascade delete |
| ingredient_name | text | |
| quantity | text | |
| category | text | Produce / Protein / Grains / Dairy / Pantry |
| checked | boolean | default false |

## saved_meals
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| meal_id | uuid FK → meals | |

## RLS (v1)
All tables: permissive `select` and `all` policies so the demo works without login. Lock-down sprint replaces these with `auth.uid() = user_id`.
